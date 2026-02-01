using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

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
        // Check model validation
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors.Select(e => 
                    $"{x.Key}: {e.ErrorMessage}"))
                .ToList();
            
            var errorMessage = errors.Count > 0 
                ? string.Join(" ", errors)
                : "Invalid registration data. Please check your input.";
            
            return BadRequest(new { message = errorMessage });
        }

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
            return StatusCode(500, new { message = "An unexpected error occurred during registration. Please try again later." });
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
        // Check model validation
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .SelectMany(x => x.Value!.Errors.Select(e => 
                    $"{x.Key}: {e.ErrorMessage}"))
                .ToList();
            
            var errorMessage = errors.Count > 0 
                ? string.Join(" ", errors)
                : "Please provide a valid email address and password.";
            
            return BadRequest(new { message = errorMessage });
        }

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
            return StatusCode(500, new { message = "An unexpected error occurred during login. Please try again later." });
        }
    }

    /// <summary>
    /// Request a password reset link.
    /// </summary>
    /// <param name="dto">Email address</param>
    /// <returns>Success message</returns>
    [HttpPost("forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        try
        {
            var result = await _authService.ForgotPasswordAsync(dto);

            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            // In development, return the token for testing
            // In production, remove resetToken from response and send via email
            return Ok(new
            {
                message = result.Message,
                resetToken = result.ResetToken // Remove in production
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password for email: {Email}", dto.Email);
            return StatusCode(500, new { message = "Error processing request: " + ex.Message });
        }
    }

    /// <summary>
    /// Reset password using a valid reset token.
    /// </summary>
    /// <param name="dto">Reset password details</param>
    /// <returns>Success message</returns>
    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        try
        {
            var result = await _authService.ResetPasswordAsync(dto);

            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(new { message = result.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset for email: {Email}", dto.Email);
            return StatusCode(500, new { message = "Error processing request: " + ex.Message });
        }
    }
}

