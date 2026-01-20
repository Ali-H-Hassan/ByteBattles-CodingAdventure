namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a test case for validating challenge solutions.
/// </summary>
public class ChallengeTestCase
{
    public int Id { get; set; }
    
    public int ChallengeId { get; set; }
    
    /// <summary>
    /// Input data as JSON array
    /// </summary>
    public string Input { get; set; } = null!;
    
    /// <summary>
    /// Expected output
    /// </summary>
    public string ExpectedOutput { get; set; } = null!;
    
    // Navigation property
    public virtual Challenge Challenge { get; set; } = null!;
}

