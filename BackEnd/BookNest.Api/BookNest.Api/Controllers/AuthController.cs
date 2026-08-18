using BookNest.Api.Models;
using BookNest.Api.Models.DTOs;
using BookNest.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BookNest.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = new ApplicationUser
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FullName = registerDto.FullName
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            // For now, assigning a default "User" role. 
            var token = _tokenService.CreateToken(user, "User");
            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FullName = user.FullName
            });
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(loginDto.Email);

        // Check if user exists and password is correct
        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var token = _tokenService.CreateToken(user, "User");

        return Ok(new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            FullName = user.FullName
        });
    }
}
