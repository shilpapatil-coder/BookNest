using BookNest.Api.Controllers;
using BookNest.Api.Data;
using BookNest.Api.Models;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookNest.Api.Tests
{
    [TestFixture]
    public class BooksControllerUnitTests
    {
        private AppDbContext _context;
        private BooksController _controller;

        [SetUp]
        public void Setup()
        {
            // 1. Arrange: Create a fake database in RAM
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "BookDb_" + System.Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);

            // Create the controller directly and pass it our fake database
            _controller = new BooksController(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task GetBooks_ReturnsAllBooks()
        {
            // Arrange: Add dummy data
            _context.Books.Add(new Book { Title = "Book 1", Price = 10, StockQuantity = 5 });
            _context.Books.Add(new Book { Title = "Book 2", Price = 20, StockQuantity = 2 });
            await _context.SaveChangesAsync();

            // Act: Call the controller method directly
            var result = await _controller.GetBooks();

            // Assert: Verify it returns the 2 books we added
            var booksList = result.Value as List<Book>;
            Assert.That(booksList, Is.Not.Null);
            Assert.That(booksList.Count, Is.EqualTo(2));
            Assert.That(booksList[0].Title, Is.EqualTo("Book 1"));
        }

        [Test]
        public async Task GetBook_WhenIdIsInvalid_ReturnsNotFoundResult()
        {
            // Act: Call the method with a non-existent ID (99)
            var result = await _controller.GetBook(99);

            // Assert: Verify the result is of type NotFoundObjectResult
            Assert.That(result.Result, Is.InstanceOf<Microsoft.AspNetCore.Mvc.NotFoundObjectResult>());
        }
        [Test]
        public async Task PostBook_WithValidBook_SavesToDatabase()
        {
            // Arrange: Create a new book object
            var newBook = new Book
            {
                Title = "New Unit Testing Book",
                Author = "Test Author",
                Price = 15.99m,
                StockQuantity = 10
            };

            // Act: Call the post method
            await _controller.PostBook(newBook);

            // Assert: Check if the book was actually saved to our fake database
            var savedBook = await _context.Books.FirstOrDefaultAsync(b => b.Title == "New Unit Testing Book");

            Assert.That(savedBook, Is.Not.Null);
            Assert.That(savedBook.Author, Is.EqualTo("Test Author"));
            // The ID should be auto-incremented by the database (usually 1 in a fresh memory DB)
            Assert.That(savedBook.Id, Is.GreaterThan(0));
        }

    }
}
