using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Register
{
    [Required]
    public string? Email { get; set; }

    [Required]
    public string? Password { get; set; }

    [Required]
    public DateOnly DateOfBirth { get; set; }

    [Required]
    public string? Gender { get; set; }

    [Required]
    public string? FullName { get; set; }
}