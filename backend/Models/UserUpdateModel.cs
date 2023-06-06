namespace backend.Models;

public class UserUpdateModel
{
    public string FullName { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string Gender { get; set; }
    public string PostalCode { get; set; }
    public string Address { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }
}
