namespace backend.Models;

public class PurchaseHistory
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public DateTime Timestamp { get; set; }
}
