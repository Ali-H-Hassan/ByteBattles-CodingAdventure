namespace ByteBattles.Core.Entities;

/// <summary>
/// Stores template/starter code for a challenge in different programming languages.
/// </summary>
public class ChallengeTemplateCode
{
    public int Id { get; set; }
    
    public int ChallengeId { get; set; }
    
    /// <summary>
    /// Programming language (e.g., "javascript", "python", "csharp")
    /// </summary>
    public string Language { get; set; } = null!;
    
    /// <summary>
    /// The starter code for this language
    /// </summary>
    public string Code { get; set; } = null!;
    
    // Navigation property
    public virtual Challenge Challenge { get; set; } = null!;
}

