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
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ReviewsController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // 1. Anyone can READ reviews for a book
    [HttpGet("book/{bookId}")]
    public async Task<IActionResult> GetReviewsForBook(int bookId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User) // Include user to show their name
            .Where(r => r.BookId == bookId)
            .OrderByDescending(r => r.CreatedDate)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Comment,
                r.CreatedDate,
                UserName = r.User!.FullName
            })
            .ToListAsync();

        return Ok(reviews);
    }

    // 2. Only logged-in users can ADD a review
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddReview([FromBody] ReviewDto reviewDto)
    {
        if (reviewDto.Rating < 1 || reviewDto.Rating > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5." });

        // Figure out who is leaving the review
        var email = User.FindFirstValue(ClaimTypes.Email);
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return Unauthorized();

        // Optional cool feature: prevent spam by checking if they already reviewed this book!
        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.BookId == reviewDto.BookId && r.UserId == user.Id);

        if (existingReview != null)
            return BadRequest(new { message = "You have already reviewed this book." });

        var review = new Review
        {
            BookId = reviewDto.BookId,
            UserId = user.Id,
            Rating = reviewDto.Rating,
            Comment = reviewDto.Comment,
            CreatedDate = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Review added successfully!" });
    }
}
