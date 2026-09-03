using BookNest.Api.Data;
using BookNest.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookNest.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly AppDbContext _context;

    public WishlistController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetWishlist()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var wishlistBooks = await _context.WishlistItems
            .Where(w => w.UserId == userId)
            .Include(w => w.Book)
            .Select(w => w.Book)
            .ToListAsync();

        return Ok(wishlistBooks);
    }

    [HttpPost("{bookId}")]
    public async Task<ActionResult> AddToWishlist(int bookId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var bookExists = await _context.Books.AnyAsync(b => b.Id == bookId);
        if (!bookExists) return NotFound("Book not found.");

        var alreadyInWishlist = await _context.WishlistItems
            .AnyAsync(w => w.UserId == userId && w.BookId == bookId);

        if (alreadyInWishlist) return BadRequest("Book is already in your wishlist.");

        var item = new WishlistItem
        {
            UserId = userId,
            BookId = bookId
        };

        _context.WishlistItems.Add(item);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{bookId}")]
    public async Task<ActionResult> RemoveFromWishlist(int bookId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var item = await _context.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.BookId == bookId);

        if (item == null) return NotFound("Book not found in wishlist.");

        _context.WishlistItems.Remove(item);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
