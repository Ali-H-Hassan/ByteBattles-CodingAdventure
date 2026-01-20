using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Test;
using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;

namespace ByteBattles.Application.Services;

/// <summary>
/// Test service implementation.
/// Handles test CRUD operations.
/// </summary>
public class TestService : ITestService
{
    private readonly ITestRepository _testRepository;

    public TestService(ITestRepository testRepository)
    {
        _testRepository = testRepository;
    }

    public async Task<TestResponseDto?> GetByIdAsync(int id)
    {
        var test = await _testRepository.GetByIdAsync(id);
        return test == null ? null : MapToDto(test);
    }

    public async Task<IEnumerable<TestResponseDto>> GetAllAsync()
    {
        var tests = await _testRepository.GetAllAsync();
        return tests.Select(MapToDto);
    }

    public async Task<IEnumerable<TestResponseDto>> GetByCompanyIdAsync(int companyId)
    {
        var tests = await _testRepository.GetByCompanyIdAsync(companyId);
        return tests.Select(MapToDto);
    }

    public async Task<TestResponseDto> CreateAsync(CreateTestDto dto)
    {
        var test = new Test
        {
            Title = dto.Title,
            CreatedById = dto.CreatedBy,
            CreatedAt = DateTime.UtcNow
        };

        // Add MCQ questions
        foreach (var mcqDto in dto.McqQuestions)
        {
            var mcqQuestion = new McqQuestion
            {
                QuestionText = mcqDto.QuestionText
            };

            foreach (var optionDto in mcqDto.Options)
            {
                mcqQuestion.Options.Add(new McqOption
                {
                    Text = optionDto.Text,
                    IsCorrect = optionDto.IsCorrect
                });
            }

            test.McqQuestions.Add(mcqQuestion);
        }

        // Add programming question if provided
        if (dto.ProgrammingQuestion != null)
        {
            var programmingQuestion = new ProgrammingQuestion
            {
                QuestionText = dto.ProgrammingQuestion.QuestionText,
                StarterCode = dto.ProgrammingQuestion.StarterCode
            };

            foreach (var testCaseDto in dto.ProgrammingQuestion.TestCases)
            {
                programmingQuestion.TestCases.Add(new ProgrammingTestCase
                {
                    Input = testCaseDto.Input,
                    ExpectedOutput = testCaseDto.Output
                });
            }

            test.ProgrammingQuestion = programmingQuestion;
        }

        var createdTest = await _testRepository.CreateAsync(test);
        return MapToDto(createdTest);
    }

    public async Task<TestResponseDto?> UpdateAsync(int id, CreateTestDto dto)
    {
        var existingTest = await _testRepository.GetByIdAsync(id);
        if (existingTest == null)
            return null;

        // Update basic properties
        existingTest.Title = dto.Title;

        // Clear and re-add MCQ questions
        existingTest.McqQuestions.Clear();
        foreach (var mcqDto in dto.McqQuestions)
        {
            var mcqQuestion = new McqQuestion
            {
                QuestionText = mcqDto.QuestionText
            };

            foreach (var optionDto in mcqDto.Options)
            {
                mcqQuestion.Options.Add(new McqOption
                {
                    Text = optionDto.Text,
                    IsCorrect = optionDto.IsCorrect
                });
            }

            existingTest.McqQuestions.Add(mcqQuestion);
        }

        // Update programming question
        if (dto.ProgrammingQuestion != null)
        {
            if (existingTest.ProgrammingQuestion == null)
            {
                existingTest.ProgrammingQuestion = new ProgrammingQuestion();
            }

            existingTest.ProgrammingQuestion.QuestionText = dto.ProgrammingQuestion.QuestionText;
            existingTest.ProgrammingQuestion.StarterCode = dto.ProgrammingQuestion.StarterCode;
            existingTest.ProgrammingQuestion.TestCases.Clear();

            foreach (var testCaseDto in dto.ProgrammingQuestion.TestCases)
            {
                existingTest.ProgrammingQuestion.TestCases.Add(new ProgrammingTestCase
                {
                    Input = testCaseDto.Input,
                    ExpectedOutput = testCaseDto.Output
                });
            }
        }
        else
        {
            existingTest.ProgrammingQuestion = null;
        }

        await _testRepository.UpdateAsync(existingTest);
        return MapToDto(existingTest);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (!await _testRepository.ExistsAsync(id))
            return false;

        await _testRepository.DeleteAsync(id);
        return true;
    }

    private static TestResponseDto MapToDto(Test test)
    {
        return new TestResponseDto
        {
            Id = test.Id,
            Title = test.Title,
            CreatedBy = test.CreatedById,
            CreatedAt = test.CreatedAt,
            McqQuestions = test.McqQuestions.Select(mq => new McqQuestionResponseDto
            {
                Id = mq.Id,
                QuestionText = mq.QuestionText,
                Options = mq.Options.Select(o => new McqOptionResponseDto
                {
                    Id = o.Id,
                    Text = o.Text,
                    IsCorrect = o.IsCorrect
                }).ToList()
            }).ToList(),
            ProgrammingQuestion = test.ProgrammingQuestion == null ? null : new ProgrammingQuestionResponseDto
            {
                Id = test.ProgrammingQuestion.Id,
                QuestionText = test.ProgrammingQuestion.QuestionText,
                StarterCode = test.ProgrammingQuestion.StarterCode,
                TestCases = test.ProgrammingQuestion.TestCases.Select(tc => new ProgrammingTestCaseResponseDto
                {
                    Id = tc.Id,
                    Input = tc.Input,
                    Output = tc.ExpectedOutput
                }).ToList()
            }
        };
    }
}

