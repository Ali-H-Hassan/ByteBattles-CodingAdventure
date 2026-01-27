namespace ByteBattles.Core.DTOs.Battle;

public class BattleResultDto
{
    public int Id { get; set; }
    public string ChallengeTitle { get; set; } = null!;
    public string ChallengeDescription { get; set; } = null!;
    public string Winner { get; set; } = null!;
    public double UserExecutionTime { get; set; }
    public double AiExecutionTime { get; set; }
    public bool UserPassed { get; set; }
    public bool AiPassed { get; set; }
    public string? AiFeedback { get; set; }
    public DateTime CompletedAt { get; set; }
}

