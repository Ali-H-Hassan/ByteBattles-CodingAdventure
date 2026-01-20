using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Auth;
using ByteBattles.Core.DTOs.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ByteBattles.API.Controllers;

/// <summary>
/// Controller for profile operations.
/// Handles user profile management and leaderboard.
/// </summary>
[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(IProfileService profileService, ILogger<ProfileController> logger)
    {
        _profileService = profileService;
        _logger = logger;
    }

    /// <summary>
    /// Get current user's profile.
    /// </summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var profile = await _profileService.GetProfileAsync(userId);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching profile");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get profile by user ID.
    /// </summary>
    [HttpGet("{userId}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfileById(int userId)
    {
        try
        {
            var profile = await _profileService.GetProfileAsync(userId);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching profile {UserId}", userId);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update current user's profile.
    /// </summary>
    [HttpPut]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var profile = await _profileService.UpdateProfileAsync(userId, dto);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get leaderboard (top users by score).
    /// </summary>
    [HttpGet("leaderboard")]
    [ProducesResponseType(typeof(IEnumerable<UserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLeaderboard([FromQuery] int take = 10)
    {
        try
        {
            var leaderboard = await _profileService.GetLeaderboardAsync(take);
            return Ok(leaderboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching leaderboard");
            return StatusCode(500, new { message = ex.Message });
        }
    }
}

