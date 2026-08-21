using System.ComponentModel.DataAnnotations;

namespace BookNest.Api.Models;

public class Order
{
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    [Required]
    public decimal TotalAmount { get; set; }

    // Status: Processing, Shipped, Delivered
    public string Status { get; set; } = "Processing";

    public List<OrderItem> OrderItems { get; set; } = new();
}
