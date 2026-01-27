using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Battle;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ByteBattles.API.Controllers;

/// <summary>
/// Controller for AI battle operations.
/// Handles coding battles between users and AI.
/// </summary>
[ApiController]
[Route("api/battle")]
public class BattleController : ControllerBase
{
    private readonly IBattleService _battleService;
    private readonly IBattleResultService _battleResultService;
    private readonly ILogger<BattleController> _logger;

    public BattleController(
        IBattleService battleService, 
        IBattleResultService battleResultService,
        ILogger<BattleController> logger)
    {
        _battleService = battleService;
        _battleResultService = battleResultService;
        _logger = logger;
    }

    /// <summary>
    /// Run a coding battle against AI.
    /// </summary>
    /// <param name="request">Battle request with user code</param>
    /// <returns>Battle results including winner, execution times, and AI feedback</returns>
    [HttpPost("run")]
    [Authorize]
    [ProducesResponseType(typeof(BattleResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RunBattle([FromBody] BattleRequestDto request)
    {
        try
        {
            // Get user ID from claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            // Override userId from request with the one from token for security
            request.UserId = userId;

            var result = await _battleService.RunBattleAsync(request);
            
            // Save battle result
            try
            {
                var challengeTitle = request.ChallengeTitle ?? "AI Challenge";
                var challengeDescription = request.ChallengeDescription ?? "Solve the coding challenge";
                await _battleResultService.SaveBattleResultAsync(
                    userId, 
                    result, 
                    challengeTitle, 
                    challengeDescription,
                    request.UserCode,
                    result.AiSolutionCode ?? ""
                );
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to save battle result, but battle completed successfully");
                // Don't fail the request if saving fails
            }
            
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Challenge not found: {ChallengeId}", request.ChallengeId);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error running battle for user {UserId}", request.UserId);
            return StatusCode(500, new { message = "Error running the battle", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all battle results for the current user.
    /// </summary>
    [HttpGet("results")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<BattleResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyBattleResults()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var results = await _battleResultService.GetUserBattleResultsAsync(userId);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching battle results");
            return StatusCode(500, new { message = "An error occurred while fetching battle results" });
        }
    }
}

