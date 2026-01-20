namespace ByteBattles.Core.Entities;

/// <summary>
/// Tracks which challenges a user has completed.
/// </summary>
public class UserCompletedChallenge
{
    public int UserId { get; set; }
    
    public int ChallengeId { get; set; }
    
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    
    public virtual Challenge Challenge { get; set; } = null!;
}

