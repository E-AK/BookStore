using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class ShoppingCartItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; }

    [Required]
    public int BookId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than or equal to 1.")]
    public int Quantity { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    [ForeignKey("BookId")]
    public Book Book { get; set; }
}