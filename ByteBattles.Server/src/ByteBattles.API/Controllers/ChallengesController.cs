using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Battle;
using ByteBattles.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ByteBattles.API.Controllers;

/// <summary>
/// Controller for challenge operations.
/// Handles coding challenge retrieval.
/// </summary>
[ApiController]
[Route("api/challenges")]
public class ChallengesController : ControllerBase
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IGeminiService _geminiService;
    private readonly ILogger<ChallengesController> _logger;

    public ChallengesController(
        IChallengeRepository challengeRepository, 
        IGeminiService geminiService,
        ILogger<ChallengesController> logger)
    {
        _challengeRepository = challengeRepository;
        _geminiService = geminiService;
        _logger = logger;
    }

    /// <summary>
    /// Get all challenges.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllChallenges()
    {
        try
        {
            var challenges = await _challengeRepository.GetAllAsync();
            return Ok(challenges.Select(c => new
            {
                c.Id,
                c.Title,
                c.Description,
                c.Difficulty,
                c.CreatedAt,
                TemplateCodes = c.TemplateCodes.ToDictionary(tc => tc.Language, tc => tc.Code),
                TestCases = c.TestCases.Select(tc => new
                {
                    Input = tc.Input,
                    Output = tc.ExpectedOutput
                })
            }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching challenges");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get challenge by ID.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetChallengeById(int id)
    {
        try
        {
            var challenge = await _challengeRepository.GetByIdAsync(id);
            if (challenge == null)
            {
                return NotFound(new { message = "Challenge not found" });
            }

            return Ok(new
            {
                challenge.Id,
                challenge.Title,
                challenge.Description,
                challenge.Difficulty,
                challenge.CreatedAt,
                TemplateCodes = challenge.TemplateCodes.ToDictionary(tc => tc.Language, tc => tc.Code),
                TestCases = challenge.TestCases.Select(tc => new
                {
                    Input = tc.Input,
                    Output = tc.ExpectedOutput
                })
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching challenge {Id}", id);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get a random challenge for AI battle.
    /// </summary>
    [HttpGet("random")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetRandomChallenge()
    {
        try
        {
            var challenge = await _challengeRepository.GetRandomAsync();
            if (challenge == null)
            {
                return NotFound(new { message = "No challenges available" });
            }

            return Ok(new
            {
                challenge.Id,
                challenge.Title,
                challenge.Description,
                challenge.Difficulty,
                challenge.CreatedAt,
                TemplateCodes = challenge.TemplateCodes.ToDictionary(tc => tc.Language, tc => tc.Code),
                TestCases = challenge.TestCases.Select(tc => new
                {
                    Input = tc.Input,
                    Output = tc.ExpectedOutput
                })
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching random challenge");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Generate a new AI challenge.
    /// </summary>
    [HttpPost("generate")]
    [Authorize]
    [ProducesResponseType(typeof(GeneratedChallengeDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GenerateChallenge()
    {
        try
        {
            var challenge = await _geminiService.GenerateChallengeAsync();
            return Ok(challenge);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating challenge");
            return StatusCode(500, new { message = ex.Message });
        }
    }
}

