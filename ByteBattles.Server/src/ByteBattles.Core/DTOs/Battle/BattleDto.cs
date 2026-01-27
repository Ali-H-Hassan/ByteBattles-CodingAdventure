using System.ComponentModel.DataAnnotations;

namespace ByteBattles.Core.DTOs.Battle;

/// <summary>
/// Data transfer object for starting an AI battle.
/// </summary>
public class BattleRequestDto
{
    [Required]
    public int UserId { get; set; }
    
    public int? ChallengeId { get; set; }
    
    [Required]
    public string UserCode { get; set; } = null!;
    
    public string Language { get; set; } = "javascript";
    
    public string? ChallengeDescription { get; set; }
    
    public string? ChallengeTitle { get; set; }
}

/// <summary>
/// Data transfer object for battle results.
/// </summary>
public class BattleResponseDto
{
    public string Winner { get; set; } = null!;
    public CodeExecutionResultDto UserResults { get; set; } = null!;
    public CodeExecutionResultDto AiResults { get; set; } = null!;
    public string AiFeedback { get; set; } = null!;
    public string? AiSolutionCode { get; set; }
}

/// <summary>
/// Data transfer object for code execution results.
/// </summary>
public class CodeExecutionResultDto
{
    public double ExecutionTime { get; set; }
    public string Output { get; set; } = null!;
    public bool Passed { get; set; }
}

/// <summary>
/// Data transfer object for AI-generated challenge.
/// </summary>
public class GeneratedChallengeDto
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Difficulty { get; set; } = null!;
    public string? TemplateCode { get; set; }
    public List<ChallengeTestCaseDto> TestCases { get; set; } = new();
}

/// <summary>
/// Data transfer object for challenge test case.
/// </summary>
public class ChallengeTestCaseDto
{
    public string Input { get; set; } = null!;
    public string ExpectedOutput { get; set; } = null!;
}

