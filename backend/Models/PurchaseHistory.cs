namespace backend.Models;

public class PurchaseHistory
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public DateTime Timestamp { get; set; }
    // Additional properties as needed
}
