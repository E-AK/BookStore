using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Services;

public class AuthenticationService
{
    UserManager<IdentityUser> _userManager;
    SignInManager<IdentityUser> _signInManager;

    public AuthenticationService(UserManager<IdentityUser> userManager,
    SignInManager<IdentityUser> signInManager)
    {
        _userManager= userManager;
        _signInManager= signInManager;
    }

    public async Task<bool> RegisterNewUser(Register user)
    {
        var identityUser = new IdentityUser()
        {
            Email = user.Email,
            UserName = user.Email
        };
        var result = await _userManager.CreateAsync(identityUser, user.Password);
        if (result.Succeeded) 
        {
            return true;
        }
        return false;
    }

    public async Task<bool> Authenticate(Login user)
    {
          
        var result = await _signInManager.PasswordSignInAsync(user.Email, user.Password, false, true);
            
        if (result.Succeeded) 
        {
            return true;
        }
        return false;
    }
}