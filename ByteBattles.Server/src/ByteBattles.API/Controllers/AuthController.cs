using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;

namespace ByteBattles.API.Controllers;

/// <summary>
/// Controller for authentication operations.
/// Handles user registration, login, and OAuth.
/// </summary>
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user.
    /// </summary>
    /// <param name="dto">Registration details</param>
    /// <returns>User and JWT token</returns>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            var result = await _authService.RegisterAsync(dto);
            
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return CreatedAtAction(nameof(Register), new AuthResponseDto
            {
                User = result.User!,
                Token = result.Token!
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for email: {Email}", dto.Email);
            return StatusCode(500, new { message = "Error during registration: " + ex.Message });
        }
    }

    /// <summary>
    /// Login with email and password.
    /// </summary>
    /// <param name="dto">Login credentials</param>
    /// <returns>User and JWT token</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto);
            
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(new { user = result.User, token = result.Token });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", dto.Email);
            return StatusCode(500, new { message = "Error during login: " + ex.Message });
        }
    }
}

