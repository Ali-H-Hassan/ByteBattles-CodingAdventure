using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Test;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ByteBattles.API.Controllers;

/// <summary>
/// Controller for test operations.
/// Handles CRUD for company coding tests.
/// </summary>
[ApiController]
[Route("api/tests")]
public class TestsController : ControllerBase
{
    private readonly ITestService _testService;
    private readonly ILogger<TestsController> _logger;

    public TestsController(ITestService testService, ILogger<TestsController> logger)
    {
        _testService = testService;
        _logger = logger;
    }

    /// <summary>
    /// Get all tests.
    /// </summary>
    [HttpGet("all")]
    [ProducesResponseType(typeof(IEnumerable<TestResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllTests()
    {
        try
        {
            var tests = await _testService.GetAllAsync();
            _logger.LogInformation("Fetched {Count} tests", tests.Count());
            return Ok(tests);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching tests");
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get test by ID.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TestResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTestById(int id)
    {
        try
        {
            var test = await _testService.GetByIdAsync(id);
            if (test == null)
            {
                return NotFound(new { message = "Test not found" });
            }
            return Ok(test);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching test {Id}", id);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get tests by company ID.
    /// </summary>
    [HttpGet("company")]
    [ProducesResponseType(typeof(IEnumerable<TestResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTestsByCompanyId([FromQuery] int companyId)
    {
        try
        {
            var tests = await _testService.GetByCompanyIdAsync(companyId);
            return Ok(tests);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching company tests for {CompanyId}", companyId);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Create a new test.
    /// </summary>
    [HttpPost("create")]
    [Authorize(Roles = "company,admin")]
    [ProducesResponseType(typeof(TestResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateTest([FromBody] CreateTestDto dto)
    {
        try
        {
            var test = await _testService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetTestById), new { id = test.Id }, test);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating test");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update test by ID.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "company,admin")]
    [ProducesResponseType(typeof(TestResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateTestById(int id, [FromBody] CreateTestDto dto)
    {
        try
        {
            var test = await _testService.UpdateAsync(id, dto);
            if (test == null)
            {
                return NotFound(new { message = "Test not found" });
            }
            return Ok(test);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating test {Id}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete test by ID.
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "company,admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTestById(int id)
    {
        try
        {
            var success = await _testService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Test not found" });
            }
            return Ok(new { message = "Test deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting test {Id}", id);
            return StatusCode(500, new { message = ex.Message });
        }
    }
}

