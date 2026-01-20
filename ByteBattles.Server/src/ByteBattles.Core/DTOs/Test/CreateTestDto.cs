using System.ComponentModel.DataAnnotations;

namespace ByteBattles.Core.DTOs.Test;

/// <summary>
/// Data transfer object for creating a new test.
/// </summary>
public class CreateTestDto
{
    [Required]
    public string Title { get; set; } = null!;
    
    [Required]
    public int CreatedBy { get; set; }
    
    public List<CreateMcqQuestionDto> McqQuestions { get; set; } = new();
    
    public CreateProgrammingQuestionDto? ProgrammingQuestion { get; set; }
}

public class CreateMcqQuestionDto
{
    [Required]
    public string QuestionText { get; set; } = null!;
    
    public List<CreateMcqOptionDto> Options { get; set; } = new();
}

public class CreateMcqOptionDto
{
    [Required]
    public string Text { get; set; } = null!;
    
    public bool IsCorrect { get; set; } = false;
}

public class CreateProgrammingQuestionDto
{
    [Required]
    public string QuestionText { get; set; } = null!;
    
    public string? StarterCode { get; set; }
    
    public List<CreateProgrammingTestCaseDto> TestCases { get; set; } = new();
}

public class CreateProgrammingTestCaseDto
{
    [Required]
    public string Input { get; set; } = null!;
    
    [Required]
    public string Output { get; set; } = null!;
}

