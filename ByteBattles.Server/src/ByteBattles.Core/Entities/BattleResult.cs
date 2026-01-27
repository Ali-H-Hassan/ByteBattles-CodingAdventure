namespace ByteBattles.Core.Entities;

public class BattleResult
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ChallengeTitle { get; set; } = null!;
    public string ChallengeDescription { get; set; } = null!;
    public string UserCode { get; set; } = null!;
    public string AiSolutionCode { get; set; } = null!;
    public string Winner { get; set; } = null!; // "user", "ai", or "tie"
    public double UserExecutionTime { get; set; }
    public double AiExecutionTime { get; set; }
    public bool UserPassed { get; set; }
    public bool AiPassed { get; set; }
    public string UserOutput { get; set; } = null!;
    public string AiOutput { get; set; } = null!;
    public string? AiFeedback { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual User User { get; set; } = null!;
}

