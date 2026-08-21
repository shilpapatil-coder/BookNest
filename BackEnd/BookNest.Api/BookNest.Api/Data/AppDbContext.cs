using BookNest.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BookNest.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Order> Orders { get; set; }        
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<Review> Reviews { get; set; }
}