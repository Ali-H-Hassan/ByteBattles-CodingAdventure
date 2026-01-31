using ByteBattles.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ByteBattles.API.Controllers;

/// <summary>
/// Admin controller for database management operations.
/// </summary>
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly ByteBattlesDbContext _context;
    private readonly ILogger<AdminController> _logger;

    public AdminController(ByteBattlesDbContext context, ILogger<AdminController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Reset and seed the database with demo data.
    /// WARNING: This will delete all existing data!
    /// </summary>
    [HttpPost("seed-database")]
    [AllowAnonymous] // Allow anonymous for development
    public async Task<IActionResult> SeedDatabase()
    {
        try
        {
            _logger.LogWarning("Database seeding initiated - this will delete all existing data!");
            
            // Clean and seed
            await DataSeeder.SeedAsync(_context);
            
            _logger.LogInformation("Database seeded successfully");
            return Ok(new { message = "Database seeded successfully with demo data" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding database");
            return StatusCode(500, new { message = "Error seeding database", error = ex.Message });
        }
    }

    /// <summary>
    /// Reset the database (delete all data).
    /// WARNING: This will delete all existing data!
    /// </summary>
    [HttpPost("reset-database")]
    [AllowAnonymous] // Allow anonymous for development - remove in production
    public async Task<IActionResult> ResetDatabase()
    {
        try
        {
            _logger.LogWarning("Database reset initiated - this will delete all existing data!");
            
            // Delete all data
            _context.TestResults.RemoveRange(_context.TestResults);
            _context.ProgrammingTestCases.RemoveRange(_context.ProgrammingTestCases);
            _context.ProgrammingQuestions.RemoveRange(_context.ProgrammingQuestions);
            _context.McqOptions.RemoveRange(_context.McqOptions);
            _context.McqQuestions.RemoveRange(_context.McqQuestions);
            _context.Tests.RemoveRange(_context.Tests);
            _context.UserCompletedChallenges.RemoveRange(_context.UserCompletedChallenges);
            _context.ChallengeTestCases.RemoveRange(_context.ChallengeTestCases);
            _context.ChallengeTemplateCodes.RemoveRange(_context.ChallengeTemplateCodes);
            _context.Challenges.RemoveRange(_context.Challenges);
            _context.UserCourseProgress.RemoveRange(_context.UserCourseProgress);
            _context.Courses.RemoveRange(_context.Courses);
            _context.UserRoles.RemoveRange(_context.UserRoles);
            _context.Users.RemoveRange(_context.Users);
            
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Database reset successfully");
            return Ok(new { message = "Database reset successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting database");
            return StatusCode(500, new { message = "Error resetting database", error = ex.Message });
        }
    }
}

