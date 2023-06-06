using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class User : IdentityUser
{
    public DateOnly DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? PostalCode { get; set; }
    public string? Address { get; set; }
    public string? FullName { get; set; }
}
