using System.ComponentModel.DataAnnotations;

namespace ByteBattles.Core.DTOs.Battle;

/// <summary>
/// Data transfer object for starting an AI battle.
/// </summary>
public class BattleRequestDto
{
    [Required]
    public int UserId { get; set; }
    
    [Required]
    public int ChallengeId { get; set; }
    
    [Required]
    public string UserCode { get; set; } = null!;
    
    public string Language { get; set; } = "javascript";
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

