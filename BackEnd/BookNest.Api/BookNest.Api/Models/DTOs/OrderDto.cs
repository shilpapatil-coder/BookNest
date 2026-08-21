namespace BookNest.Api.Models.DTOs;

public class OrderDto
{
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int BookId { get; set; }
    public int Quantity { get; set; }
}
