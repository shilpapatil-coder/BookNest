using System.ComponentModel.DataAnnotations;

namespace BookNest.Api.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order? Order { get; set; }

    public int BookId { get; set; }
    public Book? Book { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public decimal UnitPrice { get; set; }
}
