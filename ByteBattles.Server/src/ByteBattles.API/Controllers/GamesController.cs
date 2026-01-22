using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Game;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ByteBattles.API.Controllers;

/// <summary>
/// Controller for game operations.
/// Handles course retrieval and score submission.
/// </summary>
[ApiController]
[Route("api/games")]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly ILogger<GamesController> _logger;

    public GamesController(IGameService gameService, ILogger<GamesController> logger)
    {
        _gameService = gameService;
        _logger = logger;
    }

    /// <summary>
    /// Get all active courses.
    /// </summary>
    [HttpGet("courses")]
    [ProducesResponseType(typeof(IEnumerable<CourseResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCourses()
    {
        try
        {
            var courses = await _gameService.GetCoursesAsync();
            return Ok(courses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching courses");
            return StatusCode(500, new { message = "An error occurred while fetching courses", error = ex.Message });
        }
    }

    /// <summary>
    /// Get game scene configuration for a course.
    /// </summary>
    [HttpGet("config/{courseId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetGameConfig(int courseId)
    {
        try
        {
            var config = await _gameService.GetGameConfigAsync(courseId);
            return Ok(config);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching game config for course {CourseId}", courseId);
            return StatusCode(500, new { message = "An error occurred while fetching game config", error = ex.Message });
        }
    }

    /// <summary>
    /// Submit game score.
    /// </summary>
    [HttpPost("submit-score")]
    [Authorize]
    [ProducesResponseType(typeof(ScoreResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SubmitScore([FromBody] SubmitScoreDto dto)
    {
        try
        {
            var result = await _gameService.SubmitScoreAsync(dto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "User not found: {UserId}", dto.UserId);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting score");
            return StatusCode(500, new { message = "An error occurred while submitting score", error = ex.Message });
        }
    }
}

