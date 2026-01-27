using System.Diagnostics;
using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Battle;
using ByteBattles.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace ByteBattles.Application.Services;

/// <summary>
/// AI Battle service implementation.
/// Handles coding battles between users and AI.
/// </summary>
public class BattleService : IBattleService
{
    private readonly IChallengeRepository _challengeRepository;
    private readonly IGeminiService _geminiService;
    private readonly ILogger<BattleService> _logger;

    public BattleService(
        IChallengeRepository challengeRepository,
        IGeminiService geminiService,
        ILogger<BattleService> logger)
    {
        _challengeRepository = challengeRepository;
        _geminiService = geminiService;
        _logger = logger;
    }

    public async Task<BattleResponseDto> RunBattleAsync(BattleRequestDto request)
    {
        // Get the challenge description
        string challengeDescription = request.ChallengeDescription ?? "Solve the coding challenge";
        
        if (request.ChallengeId.HasValue && request.ChallengeId.Value > 0)
        {
            var challenge = await _challengeRepository.GetByIdAsync(request.ChallengeId.Value);
            if (challenge != null)
            {
                challengeDescription = $"{challenge.Title}\n\n{challenge.Description}";
            }
        }

        // Generate AI solution
        string aiSolutionCode = await _geminiService.GenerateSolutionAsync(challengeDescription, request.Language);
        
        // Clean up AI solution (remove markdown code blocks if present)
        aiSolutionCode = aiSolutionCode.Trim();
        if (aiSolutionCode.StartsWith("```javascript") || aiSolutionCode.StartsWith("```js"))
        {
            var lines = aiSolutionCode.Split('\n');
            aiSolutionCode = string.Join("\n", lines.Skip(1).TakeWhile(l => !l.Trim().StartsWith("```")));
        }
        else if (aiSolutionCode.StartsWith("```"))
        {
            var lines = aiSolutionCode.Split('\n');
            aiSolutionCode = string.Join("\n", lines.Skip(1).TakeWhile(l => !l.Trim().StartsWith("```")));
        }
        aiSolutionCode = aiSolutionCode.Trim();

        // Execute user code
        var userResults = await ExecuteCodeAsync(request.UserCode, challengeDescription);
        
        // Execute AI code
        var aiResults = await ExecuteCodeAsync(aiSolutionCode, challengeDescription);

        // Get AI feedback
        string aiFeedback;
        if (string.IsNullOrWhiteSpace(request.UserCode))
        {
            aiFeedback = "No user code was provided. Please write your code solution.";
        }
        else
        {
            aiFeedback = await _geminiService.AnalyzeCodeAsync(request.UserCode);
        }

        // Determine winner
        string winner;
        if (!userResults.Passed && !aiResults.Passed)
        {
            winner = "tie";
        }
        else if (!userResults.Passed)
        {
            winner = "ai";
        }
        else if (!aiResults.Passed)
        {
            winner = "user";
        }
        else
        {
            // Both passed - compare execution time
            winner = userResults.ExecutionTime < aiResults.ExecutionTime ? "user" : "ai";
        }

        return new BattleResponseDto
        {
            Winner = winner,
            UserResults = userResults,
            AiResults = aiResults,
            AiFeedback = aiFeedback,
            AiSolutionCode = aiSolutionCode
        };
    }

    private async Task<CodeExecutionResultDto> ExecuteCodeAsync(string code, string challengeDescription)
    {
        if (string.IsNullOrEmpty(code))
        {
            return new CodeExecutionResultDto
            {
                ExecutionTime = 0,
                Output = "No code provided",
                Passed = false
            };
        }

        try
        {
            var stopwatch = Stopwatch.StartNew();
            
            // Use AI to check if code is correct
            var isCorrect = await _geminiService.IsCodeCorrectAsync(code, challengeDescription);
            
            stopwatch.Stop();
            var executionTime = stopwatch.Elapsed.TotalMilliseconds + new Random().NextDouble() * 2;

            return new CodeExecutionResultDto
            {
                ExecutionTime = Math.Round(executionTime, 2),
                Output = isCorrect ? "Correct" : "Incorrect",
                Passed = isCorrect
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing code");
            return new CodeExecutionResultDto
            {
                ExecutionTime = 0,
                Output = ex.Message,
                Passed = false
            };
        }
    }

    private CodeExecutionResultDto ExecuteCode(string code, string input)
    {
        if (string.IsNullOrEmpty(code))
        {
            return new CodeExecutionResultDto
            {
                ExecutionTime = 0,
                Output = "No code provided",
                Passed = false
            };
        }

        try
        {
            // Note: In production, you would use a proper sandboxed execution environment
            // like Docker containers, Azure Functions, or a dedicated code execution service.
            // For now, we simulate the execution.

            var stopwatch = Stopwatch.StartNew();
            
            // Simulate code execution
            // In a real implementation, you would:
            // 1. Use Roslyn for C# code compilation and execution
            // 2. Use Jint for JavaScript execution in a sandbox
            // 3. Or call an external code execution service
            
            // For the demo, we'll check if the code contains the expected patterns
            var isCorrect = SimulateCodeExecution(code, input);
            
            stopwatch.Stop();
            var executionTime = stopwatch.Elapsed.TotalMilliseconds + new Random().NextDouble() * 2;

            return new CodeExecutionResultDto
            {
                ExecutionTime = Math.Round(executionTime, 2),
                Output = isCorrect ? "Correct" : "Incorrect",
                Passed = isCorrect
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing code");
            return new CodeExecutionResultDto
            {
                ExecutionTime = 0,
                Output = ex.Message,
                Passed = false
            };
        }
    }

    private bool SimulateCodeExecution(string code, string input)
    {
        // Simple simulation for the reverse string challenge
        // In production, this would actually execute the code
        
        // Check if the code looks like it might reverse a string
        var reversalPatterns = new[]
        {
            "reverse",
            "split",
            "join",
            "for",
            "while",
            "=>",
            "function"
        };

        var codeNormalized = code.ToLower();
        var hasReversalLogic = reversalPatterns.Any(p => codeNormalized.Contains(p));
        
        // Add some randomness for demo purposes (70% pass rate if code looks valid)
        if (hasReversalLogic)
        {
            return new Random().NextDouble() > 0.3;
        }

        return false;
    }
}

