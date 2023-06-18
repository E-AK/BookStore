using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpGet("user")]
    [Authorize]
    public async Task<IActionResult> GetUser()
    {
        try
        {
            // Получение идентификатора текущего пользователя
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Выполнение логики для получения данных пользователя из базы данных или другого источника
            var user = await _userManager.FindByIdAsync(userId);

            // Проверка наличия пользователя
            if (user == null)
            {
                return NotFound();
            }

            // Возвращение данных пользователя в ответе
            return Ok(user);
        }
        catch (Exception ex)
        {
            // Обработка ошибки
            return StatusCode(500, "Произошла ошибка при получении данных пользователя");
        }
    }

    [HttpGet("role")]
    [Authorize]
    public async Task<IActionResult> GetUserRole()
    {
        try
        {
            // Получение идентификатора текущего пользователя
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Получение ролей пользователя из репозитория или службы
            var roles = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(userId));

            // Проверка наличия ролей пользователя
            if (roles == null || !roles.Any())
            {
                return NotFound();
            }

            // Возвращение ролей пользователя в ответе
            return Ok(roles);
        }
        catch (Exception ex)
        {
            // Обработка ошибки
            return StatusCode(500, "Произошла ошибка при получении роли пользователя");
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(Register model)
    {
        var user = new User
        {
            UserName = model.Email,
            Email = model.Email,
            DateOfBirth = model.DateOfBirth,
            Gender = model.Gender,
            FullName = model.FullName
        };
        
        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, "User");

            return Ok();
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(Login model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var roles = await _userManager.GetRolesAsync(user);
            var token = GenerateJwtToken(user, roles);

            return Ok(new TokenResponse { Token = token });
        }

        return Unauthorized();
    }

    private string GenerateJwtToken(User user, IList<string> roles)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"]);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }

    [HttpPut("user")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(UserUpdateModel model)
    {
        try
        {
            // Получение идентификатора текущего пользователя
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Поиск пользователя по идентификатору
            var user = await _userManager.FindByIdAsync(userId);

            // Проверка наличия пользователя
            if (user == null)
            {
                return NotFound();
            }

            // Обновление свойств пользователя
            user.FullName = model.FullName;
            user.DateOfBirth = model.DateOfBirth;
            user.Gender = model.Gender;
            user.PostalCode = model.PostalCode;
            user.Address = model.Address;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;

            // Обновление пользователя в базе данных
            var result = await _userManager.UpdateAsync(user);

            // Проверка результата обновления
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Проверка наличия нового пароля
            if (!string.IsNullOrEmpty(model.NewPassword))
            {
                // Смена пароля пользователя
                var changePasswordResult = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

                // Проверка результата смены пароля
                if (!changePasswordResult.Succeeded)
                {
                    return BadRequest(changePasswordResult.Errors);
                }
            }

            return Ok();
        }
        catch (Exception ex)
        {
            // Обработка ошибки
            return StatusCode(500, "Произошла ошибка при обновлении данных пользователя");
        }
    }

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetUsers()
    {
        try
        {
            var users = _userManager.Users.ToList();
            return Ok(users);
        }
        catch (Exception ex)
        {
            // Обработка ошибки
            return StatusCode(500, "Произошла ошибка при получении пользователей");
        }
    }

    [HttpDelete("users/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            // Обработка ошибки
            return StatusCode(500, "Произошла ошибка при удалении пользователя");
        }
    }
}