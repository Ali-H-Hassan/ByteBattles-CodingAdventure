using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Battle;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    private readonly ILogger<BattleController> _logger;

    public BattleController(IBattleService battleService, ILogger<BattleController> logger)
    {
        _battleService = battleService;
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
            var result = await _battleService.RunBattleAsync(request);
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
}

