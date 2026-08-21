using System.ComponentModel.DataAnnotations;

namespace BookNest.Api.Models;

public class Review
{
    public int Id { get; set; }

    public int BookId { get; set; }
    public Book? Book { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }

    [Required]
    [Range(1, 5)] // Ensures rating is between 1 and 5
    public int Rating { get; set; }

    public string Comment { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
