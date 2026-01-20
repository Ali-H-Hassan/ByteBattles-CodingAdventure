using ByteBattles.Application.Services;
using ByteBattles.Core.DTOs.Test;
using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using Moq;

namespace ByteBattles.Tests.Services;

/// <summary>
/// Unit tests for the TestService.
/// </summary>
public class TestServiceTests
{
    private readonly Mock<ITestRepository> _testRepositoryMock;
    private readonly TestService _testService;

    public TestServiceTests()
    {
        _testRepositoryMock = new Mock<ITestRepository>();
        _testService = new TestService(_testRepositoryMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WithExistingTest_ReturnsTest()
    {
        // Arrange
        var test = CreateSampleTest();
        _testRepositoryMock.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(test);

        // Act
        var result = await _testService.GetByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Sample Test", result.Title);
        Assert.Single(result.McqQuestions);
    }

    [Fact]
    public async Task GetByIdAsync_WithNonExistingTest_ReturnsNull()
    {
        // Arrange
        _testRepositoryMock.Setup(r => r.GetByIdAsync(999))
            .ReturnsAsync((Test?)null);

        // Act
        var result = await _testService.GetByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllTests()
    {
        // Arrange
        var tests = new List<Test>
        {
            CreateSampleTest(1, "Test 1"),
            CreateSampleTest(2, "Test 2")
        };
        _testRepositoryMock.Setup(r => r.GetAllAsync())
            .ReturnsAsync(tests);

        // Act
        var result = await _testService.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByCompanyIdAsync_ReturnsCompanyTests()
    {
        // Arrange
        var companyId = 5;
        var tests = new List<Test>
        {
            CreateSampleTest(1, "Company Test 1"),
            CreateSampleTest(2, "Company Test 2")
        };
        _testRepositoryMock.Setup(r => r.GetByCompanyIdAsync(companyId))
            .ReturnsAsync(tests);

        // Act
        var result = await _testService.GetByCompanyIdAsync(companyId);

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task CreateAsync_CreatesNewTest()
    {
        // Arrange
        var dto = new CreateTestDto
        {
            Title = "New Test",
            CreatedBy = 1,
            McqQuestions = new List<CreateMcqQuestionDto>
            {
                new CreateMcqQuestionDto
                {
                    QuestionText = "What is 2+2?",
                    Options = new List<CreateMcqOptionDto>
                    {
                        new CreateMcqOptionDto { Text = "3", IsCorrect = false },
                        new CreateMcqOptionDto { Text = "4", IsCorrect = true }
                    }
                }
            }
        };

        _testRepositoryMock.Setup(r => r.CreateAsync(It.IsAny<Test>()))
            .ReturnsAsync((Test t) => { t.Id = 1; return t; });

        // Act
        var result = await _testService.CreateAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Test", result.Title);
        Assert.Single(result.McqQuestions);
        _testRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<Test>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WithExistingTest_ReturnsTrue()
    {
        // Arrange
        _testRepositoryMock.Setup(r => r.ExistsAsync(1))
            .ReturnsAsync(true);
        _testRepositoryMock.Setup(r => r.DeleteAsync(1))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _testService.DeleteAsync(1);

        // Assert
        Assert.True(result);
        _testRepositoryMock.Verify(r => r.DeleteAsync(1), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WithNonExistingTest_ReturnsFalse()
    {
        // Arrange
        _testRepositoryMock.Setup(r => r.ExistsAsync(999))
            .ReturnsAsync(false);

        // Act
        var result = await _testService.DeleteAsync(999);

        // Assert
        Assert.False(result);
        _testRepositoryMock.Verify(r => r.DeleteAsync(It.IsAny<int>()), Times.Never);
    }

    private static Test CreateSampleTest(int id = 1, string title = "Sample Test")
    {
        var test = new Test
        {
            Id = id,
            Title = title,
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
}

