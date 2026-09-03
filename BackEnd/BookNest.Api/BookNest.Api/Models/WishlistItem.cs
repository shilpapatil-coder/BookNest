using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookNest.Api.Models;

public class WishlistItem
{
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;

    [Required]
    public int BookId { get; set; }

    public Book Book { get; set; } = null!;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
