using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Statistics;
using ByteBattles.Core.DTOs.Test;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ByteBattles.API.Controllers;

/// <summary>
/// Controller for test result operations.
/// Handles test submission and result retrieval.
/// </summary>
[ApiController]
[Route("api/test-results")]
[Authorize]
public class TestResultsController : ControllerBase
{
    private readonly ITestResultService _testResultService;
    private readonly ILogger<TestResultsController> _logger;

    public TestResultsController(ITestResultService testResultService, ILogger<TestResultsController> logger)
    {
        _testResultService = testResultService;
        _logger = logger;
    }

    /// <summary>
    /// Submit test answers and get results.
    /// </summary>
    [HttpPost("submit/{testId}")]
    [ProducesResponseType(typeof(TestResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> SubmitTest(int testId, [FromBody] SubmitTestDto dto)
    {
        try
        {
            // Get user ID from claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var result = await _testResultService.SubmitTestAsync(testId, userId, dto);
            _logger.LogInformation("Test {TestId} submitted by user {UserId} with score {Score}", testId, userId, result.Score);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "User attempted to retake test {TestId}", testId);
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogError(ex, "Invalid test submission for test {TestId}", testId);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting test {TestId}", testId);
            return StatusCode(500, new { message = "An error occurred while submitting the test" });
        }
    }

    /// <summary>
    /// Get all test results for the current user.
    /// </summary>
    [HttpGet("my-results")]
    [ProducesResponseType(typeof(IEnumerable<TestResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyResults()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var results = await _testResultService.GetUserResultsAsync(userId);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user results");
            return StatusCode(500, new { message = "An error occurred while fetching results" });
        }
    }

    /// <summary>
    /// Get result for a specific test by test ID.
    /// </summary>
    [HttpGet("test/{testId}")]
    [ProducesResponseType(typeof(TestResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetResultByTestId(int testId)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var result = await _testResultService.GetResultByTestIdAndUserIdAsync(testId, userId);
            if (result == null)
            {
                return NotFound(new { message = "Test result not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching test result for test {TestId}", testId);
            return StatusCode(500, new { message = "An error occurred while fetching the result" });
        }
    }

    /// <summary>
    /// Check if user has already taken a test.
    /// </summary>
    [HttpGet("has-taken/{testId}")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    public async Task<IActionResult> HasTakenTest(int testId)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var hasTaken = await _testResultService.HasUserTakenTestAsync(testId, userId);
            return Ok(new { hasTaken });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if user has taken test {TestId}", testId);
            return StatusCode(500, new { message = "An error occurred while checking test status" });
        }
    }

    /// <summary>
    /// Get user statistics (total tests, passed, failed, average score).
    /// </summary>
    [HttpGet("statistics")]
    [ProducesResponseType(typeof(UserStatisticsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserStatistics()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var statistics = await _testResultService.GetUserStatisticsAsync(userId);
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user statistics");
            return StatusCode(500, new { message = "An error occurred while fetching statistics" });
        }
    }
}

