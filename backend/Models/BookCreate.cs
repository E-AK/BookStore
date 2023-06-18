namespace backend.Models;

public class BookCreate
{
    public IFormFile? Preview { get; set; }
    public string? Title { get; set; }
    public string? Author { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Genre { get; set; }
}