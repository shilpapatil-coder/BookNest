using BookNest.Api.Data;
using BookNest.Api.Models;
using BookNest.Api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookNest.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Only logged-in users can place orders!
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public OrdersController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] OrderDto orderDto)
    {
        if (orderDto.Items == null || orderDto.Items.Count == 0)
            return BadRequest(new { message = "Cart is empty." });

        // 1. Find out who is logged in using their JWT Token
        var email = User.FindFirstValue(ClaimTypes.Email);
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null) return Unauthorized();

        // 2. Create the new Order
        var newOrder = new Order
        {
            UserId = user.Id,
            OrderDate = DateTime.UtcNow,
            Status = "Processing",
            TotalAmount = 0
        };

        // 3. Loop through the cart items
        foreach (var item in orderDto.Items)
        {
            var book = await _context.Books.FindAsync(item.BookId);
            if (book == null) return BadRequest(new { message = $"Book ID {item.BookId} not found." });

            if (book.StockQuantity < item.Quantity)
                return BadRequest(new { message = $"Not enough stock for {book.Title}. Only {book.StockQuantity} left." });

            // Deduct the stock
            book.StockQuantity -= item.Quantity;

            // Add the item to the order
            var orderItem = new OrderItem
            {
                BookId = book.Id,
                Quantity = item.Quantity,
                UnitPrice = book.Price
            };

            newOrder.OrderItems.Add(orderItem);
            newOrder.TotalAmount += (item.Quantity * book.Price); // Calculate total securely on backend
        }

        // 4. Save to Database
        _context.Orders.Add(newOrder);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Order placed successfully!", orderId = newOrder.Id });
    }

    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders()
    {
        // Find out who is logged in
        var email = User.FindFirstValue(ClaimTypes.Email);
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null) return Unauthorized();

        // Get all orders for this specific user, including the books they bought
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .Where(o => o.UserId == user.Id)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders);
    }
    [HttpGet("all-orders")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllOrders()
    {
        // Fetch every single order in the database, newest first
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string newStatus)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound(new { message = "Order not found." });

        order.Status = newStatus;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Order status updated successfully!" });
    }
}
