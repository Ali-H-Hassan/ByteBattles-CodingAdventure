using ByteBattles.Application.Services;
using ByteBattles.Core.DTOs.Test;
using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using Moq;

namespace ByteBattles.Tests.Services;

/// <summary>
/// Unit tests for the TestResultService.
/// Tests test submission, scoring, and result retrieval functionality.
/// </summary>
public class TestResultServiceTests
{
    private readonly Mock<ITestResultRepository> _testResultRepositoryMock;
    private readonly Mock<ITestRepository> _testRepositoryMock;
    private readonly TestResultService _testResultService;

    public TestResultServiceTests()
    {
        _testResultRepositoryMock = new Mock<ITestResultRepository>();
        _testRepositoryMock = new Mock<ITestRepository>();
        _testResultService = new TestResultService(
            _testResultRepositoryMock.Object,
            _testRepositoryMock.Object);
    }

    #region SubmitTestAsync Tests

    [Fact]
    public async Task SubmitTestAsync_WithValidSubmission_ReturnsResult()
    {
        // Arrange
        var testId = 1;
        var userId = 1;
        var test = CreateSampleTestWithMcq();
        var submitDto = new SubmitTestDto
        {
            McqAnswers = new Dictionary<int, int> { { 1, 2 } } // Correct answer
        };

        _testResultRepositoryMock.Setup(r => r.GetByTestIdAndUserIdAsync(testId, userId))
            .ReturnsAsync((TestResult?)null);
        _testRepositoryMock.Setup(r => r.GetByIdAsync(testId))
            .ReturnsAsync(test);
        _testResultRepositoryMock.Setup(r => r.CreateAsync(It.IsAny<TestResult>()))
            .ReturnsAsync((TestResult tr) =>
            {
                tr.Id = 1;
                tr.Test = test;
                tr.User = CreateSampleUser();
                return tr;
            });

        // Act
        var result = await _testResultService.SubmitTestAsync(testId, userId, submitDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(testId, result.TestId);
        _testResultRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<TestResult>()), Times.Once);
    }

    [Fact]
    public async Task SubmitTestAsync_WhenUserAlreadyTookTest_ThrowsInvalidOperationException()
    {
        // Arrange
        var testId = 1;
        var userId = 1;
        var existingResult = new TestResult { Id = 1, TestId = testId, UserId = userId };

        _testResultRepositoryMock.Setup(r => r.GetByTestIdAndUserIdAsync(testId, userId))
            .ReturnsAsync(existingResult);

        var submitDto = new SubmitTestDto();

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _testResultService.SubmitTestAsync(testId, userId, submitDto));
        Assert.Contains("already taken", exception.Message);
    }

    [Fact]
    public async Task SubmitTestAsync_WhenTestNotFound_ThrowsArgumentException()
    {
        // Arrange
        var testId = 999;
        var userId = 1;

        _testResultRepositoryMock.Setup(r => r.GetByTestIdAndUserIdAsync(testId, userId))
            .ReturnsAsync((TestResult?)null);
        _testRepositoryMock.Setup(r => r.GetByIdAsync(testId))
            .ReturnsAsync((Test?)null);

        var submitDto = new SubmitTestDto();

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _testResultService.SubmitTestAsync(testId, userId, submitDto));
        Assert.Contains("not found", exception.Message);
    }

    [Fact]
    public async Task SubmitTestAsync_WithCorrectMcqAnswers_CalculatesCorrectScore()
    {
        // Arrange
        var testId = 1;
        var userId = 1;
        var test = CreateSampleTestWithMcq();
        var submitDto = new SubmitTestDto
        {
            McqAnswers = new Dictionary<int, int> { { 1, 2 } } // Option 2 is correct
        };

        _testResultRepositoryMock.Setup(r => r.GetByTestIdAndUserIdAsync(testId, userId))
            .ReturnsAsync((TestResult?)null);
        _testRepositoryMock.Setup(r => r.GetByIdAsync(testId))
            .ReturnsAsync(test);
        _testResultRepositoryMock.Setup(r => r.CreateAsync(It.IsAny<TestResult>()))
            .ReturnsAsync((TestResult tr) =>
            {
                tr.Id = 1;
                tr.Test = test;
                tr.User = CreateSampleUser();
                return tr;
            });

        // Act
        var result = await _testResultService.SubmitTestAsync(testId, userId, submitDto);

        // Assert
        Assert.Equal(1, result.McqCorrectCount);
        Assert.Equal(1, result.McqTotalCount);
    }

    #endregion

    #region GetUserResultsAsync Tests

    [Fact]
    public async Task GetUserResultsAsync_WithResults_ReturnsResults()
    {
        // Arrange
        var userId = 1;
        var results = new List<TestResult>
        {
            CreateSampleTestResult(1, 1, userId),
            CreateSampleTestResult(2, 2, userId)
        };

        _testResultRepositoryMock.Setup(r => r.GetByUserIdAsync(userId))
            .ReturnsAsync(results);

        // Act
        var result = await _testResultService.GetUserResultsAsync(userId);

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetUserResultsAsync_WithNoResults_ReturnsEmptyList()
    {
        // Arrange
        var userId = 1;
        _testResultRepositoryMock.Setup(r => r.GetByUserIdAsync(userId))
            .ReturnsAsync(new List<TestResult>());

        // Act
        var result = await _testResultService.GetUserResultsAsync(userId);

        // Assert
        Assert.Empty(result);
    }

    #endregion

    #region GetResultByTestIdAndUserIdAsync Tests

    [Fact]
    public async Task GetResultByTestIdAndUserIdAsync_WithExistingResult_ReturnsResult()
    {
        // Arrange
        var testId = 1;
        var userId = 1;
        var testResult = CreateSampleTestResult(1, testId, userId);

        _testResultRepositoryMock.Setup(r => r.GetByTestIdAndUserIdAsync(testId, userId))
            .ReturnsAsync(testResult);

        // Act
        var result = await _testResultService.GetResultByTestIdAndUserIdAsync(testId, userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(testId, result.TestId);
    }

    [Fact]
    public async Task GetResultByTestIdAndUserIdAsync_WithNoResult_ReturnsNull()
    {
        // Arrange
        var testId = 1;
        var userId = 1;

        _testResultRepositoryMock.Setup(r => r.GetByTestIdAndUserIdAsync(testId, userId))
            .ReturnsAsync((TestResult?)null);

        // Act
        var result = await _testResultService.GetResultByTestIdAndUserIdAsync(testId, userId);

        // Assert
        Assert.Null(result);
    }

    #endregion

    #region HasUserTakenTestAsync Tests

    [Fact]
    public async Task HasUserTakenTestAsync_WhenTaken_ReturnsTrue()
    {
        // Arrange
        _testResultRepositoryMock.Setup(r => r.ExistsAsync(1, 1))
            .ReturnsAsync(true);

        // Act
        var result = await _testResultService.HasUserTakenTestAsync(1, 1);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task HasUserTakenTestAsync_WhenNotTaken_ReturnsFalse()
    {
        // Arrange
        _testResultRepositoryMock.Setup(r => r.ExistsAsync(1, 1))
            .ReturnsAsync(false);

        // Act
        var result = await _testResultService.HasUserTakenTestAsync(1, 1);

        // Assert
        Assert.False(result);
    }

    #endregion

    #region GetUserStatisticsAsync Tests

    [Fact]
    public async Task GetUserStatisticsAsync_WithResults_ReturnsCorrectStatistics()
    {
        // Arrange
        var userId = 1;
        var results = new List<TestResult>
        {
            CreateSampleTestResult(1, 1, userId, 80), // Passed
            CreateSampleTestResult(2, 2, userId, 70), // Passed
            CreateSampleTestResult(3, 3, userId, 50)  // Failed
        };

        _testResultRepositoryMock.Setup(r => r.GetByUserIdAsync(userId))
            .ReturnsAsync(results);

        // Act
        var stats = await _testResultService.GetUserStatisticsAsync(userId);

        // Assert
        Assert.Equal(3, stats.TotalTestsTaken);
        Assert.Equal(2, stats.PassedTests);
        Assert.Equal(1, stats.FailedTests);
    }

    [Fact]
    public async Task GetUserStatisticsAsync_WithNoResults_ReturnsZeroStatistics()
    {
        // Arrange
        var userId = 1;
        _testResultRepositoryMock.Setup(r => r.GetByUserIdAsync(userId))
            .ReturnsAsync(new List<TestResult>());

        // Act
        var stats = await _testResultService.GetUserStatisticsAsync(userId);

        // Assert
        Assert.Equal(0, stats.TotalTestsTaken);
        Assert.Equal(0, stats.PassedTests);
        Assert.Equal(0, stats.FailedTests);
        Assert.Equal(0, stats.AverageScore);
    }

    #endregion

    #region GetTopTestTakersAsync Tests

    [Fact]
    public async Task GetTopTestTakersAsync_ReturnsOrderedByAverageScore()
    {
        // Arrange
        var results = new List<TestResult>
        {
            CreateSampleTestResult(1, 1, 1, 90),
            CreateSampleTestResult(2, 2, 1, 80),
            CreateSampleTestResult(3, 1, 2, 70),
            CreateSampleTestResult(4, 2, 2, 60),
            CreateSampleTestResult(5, 1, 3, 50)
        };

        _testResultRepositoryMock.Setup(r => r.GetAllAsync())
            .ReturnsAsync(results);

        // Act
        var leaderboard = await _testResultService.GetTopTestTakersAsync(3);

        // Assert
        var leaderboardList = leaderboard.ToList();
        Assert.Equal(3, leaderboardList.Count);
        // User 1 has highest average (85), then user 2 (65), then user 3 (50)
        Assert.Equal(1, leaderboardList[0].UserId);
    }

    #endregion

    #region GetResultsByTestIdAsync Tests

    [Fact]
    public async Task GetResultsByTestIdAsync_FiltersOutCompanyUsers()
    {
        // Arrange
        var testId = 1;
        var individualUser = CreateSampleUser(1, "individual");
        individualUser.UserType = "individual";
        var companyUser = CreateSampleUser(2, "company");
        companyUser.UserType = "company";

        var results = new List<TestResult>
        {
            new TestResult { Id = 1, TestId = testId, UserId = 1, User = individualUser, Test = CreateSampleTestWithMcq() },
            new TestResult { Id = 2, TestId = testId, UserId = 2, User = companyUser, Test = CreateSampleTestWithMcq() }
        };

        _testResultRepositoryMock.Setup(r => r.GetByTestIdAsync(testId))
            .ReturnsAsync(results);

        // Act
        var result = await _testResultService.GetResultsByTestIdAsync(testId);

        // Assert
        Assert.Single(result);
        Assert.Equal("individual", result.First().UserType);
    }

    #endregion

    #region Helper Methods

    private static Test CreateSampleTestWithMcq()
    {
        var test = new Test
        {
            Id = 1,
            Title = "Sample Test",
            CreatedById = 1,
            CreatedAt = DateTime.UtcNow
        };

        var mcqQuestion = new McqQuestion
        {
            Id = 1,
            QuestionText = "What is 2+2?"
        };
        mcqQuestion.Options.Add(new McqOption { Id = 1, Text = "3", IsCorrect = false });
        mcqQuestion.Options.Add(new McqOption { Id = 2, Text = "4", IsCorrect = true });
        test.McqQuestions.Add(mcqQuestion);

        return test;
    }

    private static User CreateSampleUser(int id = 1, string username = "testuser")
    {
        var user = new User
        {
            Id = id,
            Username = username,
            Email = $"{username}@example.com",
            UserType = "individual"
        };
        return user;
    }

    private static TestResult CreateSampleTestResult(int id, int testId, int userId, decimal score = 75)
    {
        var test = new Test
        {
            Id = testId,
            Title = $"Test {testId}",
            CreatedById = 1
        };

        var user = new User
        {
            Id = userId,
            Username = $"user{userId}",
            Email = $"user{userId}@example.com",
            UserType = "individual"
        };

        return new TestResult
        {
            Id = id,
            TestId = testId,
            UserId = userId,
            Score = score,
            McqCorrectCount = 3,
            McqTotalCount = 4,
            ProgrammingCorrect = true,
            CompletedAt = DateTime.UtcNow,
            Test = test,
            User = user
        };
    }

    #endregion
}
