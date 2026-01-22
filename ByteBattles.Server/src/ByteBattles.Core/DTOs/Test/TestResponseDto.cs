namespace ByteBattles.Core.DTOs.Test;

/// <summary>
/// Data transfer object for test response.
/// </summary>
public class TestResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public int CreatedBy { get; set; }
    public string? CompanyName { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<McqQuestionResponseDto> McqQuestions { get; set; } = new();
    public ProgrammingQuestionResponseDto? ProgrammingQuestion { get; set; }
}

public class McqQuestionResponseDto
{
    public int Id { get; set; }
    public string QuestionText { get; set; } = null!;
    public List<McqOptionResponseDto> Options { get; set; } = new();
}

public class McqOptionResponseDto
{
    public int Id { get; set; }
    public string Text { get; set; } = null!;
    public bool IsCorrect { get; set; }
}

public class ProgrammingQuestionResponseDto
{
    public int Id { get; set; }
    public string QuestionText { get; set; } = null!;
    public string? StarterCode { get; set; }
    public List<ProgrammingTestCaseResponseDto> TestCases { get; set; } = new();
}

public class ProgrammingTestCaseResponseDto
{
    public int Id { get; set; }
    public string Input { get; set; } = null!;
    public string Output { get; set; } = null!;
}

