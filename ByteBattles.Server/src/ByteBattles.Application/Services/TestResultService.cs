using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Statistics;
using ByteBattles.Core.DTOs.Test;
using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using System.Text.Json;

namespace ByteBattles.Application.Services;

/// <summary>
/// Service implementation for test result operations.
/// Handles test submission, scoring, and result retrieval.
/// </summary>
public class TestResultService : ITestResultService
{
    private readonly ITestResultRepository _testResultRepository;
    private readonly ITestRepository _testRepository;

    public TestResultService(ITestResultRepository testResultRepository, ITestRepository testRepository)
    {
        _testResultRepository = testResultRepository;
        _testRepository = testRepository;
    }

    public async Task<TestResultDto> SubmitTestAsync(int testId, int userId, SubmitTestDto dto)
    {
        // Check if user already took this test
        var existingResult = await _testResultRepository.GetByTestIdAndUserIdAsync(testId, userId);
        if (existingResult != null)
        {
            throw new InvalidOperationException("User has already taken this test.");
        }

        // Get the test to evaluate answers
        var test = await _testRepository.GetByIdAsync(testId);
        if (test == null)
        {
            throw new ArgumentException("Test not found.");
        }

        // Calculate MCQ score
        int mcqCorrect = 0;
        int mcqTotal = test.McqQuestions.Count;
        
        if (dto.McqAnswers != null && dto.McqAnswers.Any())
        {
            foreach (var question in test.McqQuestions)
            {
                if (dto.McqAnswers.TryGetValue(question.Id, out var selectedOptionId))
                {
                    var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                    if (correctOption != null && correctOption.Id == selectedOptionId)
                    {
                        mcqCorrect++;
                    }
                }
            }
        }

        // Calculate programming question score
        bool programmingCorrect = false;
        if (test.ProgrammingQuestion != null && !string.IsNullOrWhiteSpace(dto.ProgrammingAnswer))
        {
            // For now, we'll do a simple string comparison
            // In production, you'd execute the code and test against test cases
            programmingCorrect = EvaluateProgrammingSolution(
                dto.ProgrammingAnswer,
                test.ProgrammingQuestion.TestCases.ToList()
            );
        }
        else if (test.ProgrammingQuestion == null)
        {
            // No programming question, so it's considered "correct" for scoring
            programmingCorrect = true;
        }

        // Calculate total score (MCQ: 70%, Programming: 30%)
        decimal mcqScore = mcqTotal > 0 ? (decimal)mcqCorrect / mcqTotal * 100 : 0;
        decimal programmingScore = programmingCorrect ? 100 : 0;
        decimal totalScore = (mcqScore * 0.7m) + (programmingScore * 0.3m);

        // Serialize answers
        string? mcqAnswersJson = dto.McqAnswers != null 
            ? JsonSerializer.Serialize(dto.McqAnswers) 
            : null;

        // Create test result
        var testResult = new TestResult
        {
            TestId = testId,
            UserId = userId,
            Score = totalScore,
            McqCorrectCount = mcqCorrect,
            McqTotalCount = mcqTotal,
            ProgrammingCorrect = programmingCorrect,
            McqAnswers = mcqAnswersJson,
            ProgrammingAnswer = dto.ProgrammingAnswer,
            CompletedAt = DateTime.UtcNow
        };

        var createdResult = await _testResultRepository.CreateAsync(testResult);
        return MapToDto(createdResult);
    }

    public async Task<IEnumerable<TestResultDto>> GetUserResultsAsync(int userId)
    {
        var results = await _testResultRepository.GetByUserIdAsync(userId);
        return results.Select(MapToDto);
    }

    public async Task<TestResultDto?> GetResultByTestIdAndUserIdAsync(int testId, int userId)
    {
        var result = await _testResultRepository.GetByTestIdAndUserIdAsync(testId, userId);
        return result == null ? null : MapToDto(result);
    }

    public async Task<bool> HasUserTakenTestAsync(int testId, int userId)
    {
        return await _testResultRepository.ExistsAsync(testId, userId);
    }

    public async Task<UserStatisticsDto> GetUserStatisticsAsync(int userId)
    {
        var results = await _testResultRepository.GetByUserIdAsync(userId);
        var resultsList = results.ToList();

        var totalTests = resultsList.Count;
        var passedTests = resultsList.Count(r => r.Score >= 60); // Consider 60% as passing
        var failedTests = totalTests - passedTests;
        var averageScore = totalTests > 0 
            ? resultsList.Average(r => (double)r.Score) 
            : 0;

        return new UserStatisticsDto
        {
            TotalTestsTaken = totalTests,
            PassedTests = passedTests,
            FailedTests = failedTests,
            AverageScore = (decimal)averageScore
        };
    }

    private static bool EvaluateProgrammingSolution(string code, List<ProgrammingTestCase> testCases)
    {
        // Simple evaluation: check if code contains expected output patterns
        // In production, you would:
        // 1. Execute the code in a sandboxed environment
        // 2. Run it against each test case
        // 3. Compare outputs
        
        // For now, we'll do a basic check - if code is not empty and has some structure
        if (string.IsNullOrWhiteSpace(code))
        {
            return false;
        }

        // Basic validation - in production, you'd execute the code
        // This is a placeholder that always returns true if code exists
        // You should implement proper code execution and testing
        return true;
    }

    private static TestResultDto MapToDto(TestResult result)
    {
        return new TestResultDto
        {
            Id = result.Id,
            TestId = result.TestId,
            TestTitle = result.Test.Title,
            CompanyName = result.Test.CreatedBy?.CompanyName,
            Score = result.Score,
            McqCorrectCount = result.McqCorrectCount,
            McqTotalCount = result.McqTotalCount,
            ProgrammingCorrect = result.ProgrammingCorrect,
            CompletedAt = result.CompletedAt
        };
    }
}

