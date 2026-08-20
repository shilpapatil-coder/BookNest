using BookNest.Api.Data;
using BookNest.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookNest.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _context;

    public BooksController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Books (Public: Everyone can view the catalog)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        return await _context.Books.ToListAsync();
    }

    // GET: api/Books/5 (Public: View a specific book's details)
    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await _context.Books.FindAsync(id);

        if (book == null)
        {
            return NotFound(new { message = "Book not found." });
        }

        return book;
    }

    // POST: api/Books (Secure: Must be logged in to add a book)
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Book>> PostBook([FromBody] Book book)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // Ensure the ID is not set so the database auto-increments it
        book.Id = 0;
        book.CreatedDate = DateTime.UtcNow;

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
    }

    // PUT: api/Books/5 (Secure: Update an existing book)
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutBook(int id, [FromBody] Book book)
    {
        if (id != book.Id)
        {
            return BadRequest(new { message = "ID mismatch." });
        }

        _context.Entry(book).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Books.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Books/5 (Secure: Remove a book from inventory)
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
