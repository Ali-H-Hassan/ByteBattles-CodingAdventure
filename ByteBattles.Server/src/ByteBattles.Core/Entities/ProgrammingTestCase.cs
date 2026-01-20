namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a test case for a programming question.
/// </summary>
public class ProgrammingTestCase
{
    public int Id { get; set; }
    
    public int ProgrammingQuestionId { get; set; }
    
    public string Input { get; set; } = null!;
    
    public string ExpectedOutput { get; set; } = null!;
    
    // Navigation property
    public virtual ProgrammingQuestion ProgrammingQuestion { get; set; } = null!;
}

