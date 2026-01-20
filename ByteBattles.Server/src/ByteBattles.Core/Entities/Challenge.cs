namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a coding challenge for AI battles.
/// </summary>
public class Challenge
{
    public int Id { get; set; }
    
    public string Title { get; set; } = null!;
    
    public string Description { get; set; } = null!;
    
    /// <summary>
    /// Difficulty level: "Easy", "Medium", "Hard"
    /// </summary>
    public string? Difficulty { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<ChallengeTemplateCode> TemplateCodes { get; set; } = new List<ChallengeTemplateCode>();
    
    public virtual ICollection<ChallengeTestCase> TestCases { get; set; } = new List<ChallengeTestCase>();
    
    public virtual ICollection<UserCompletedChallenge> CompletedByUsers { get; set; } = new List<UserCompletedChallenge>();
}

