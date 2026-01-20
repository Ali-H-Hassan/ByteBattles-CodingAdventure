namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a programming question in a test.
/// </summary>
public class ProgrammingQuestion
{
    public int Id { get; set; }
    
    public int TestId { get; set; }
    
    public string QuestionText { get; set; } = null!;
    
    /// <summary>
    /// Starter code provided to the candidate
    /// </summary>
    public string? StarterCode { get; set; }
    
    // Navigation properties
    public virtual Test Test { get; set; } = null!;
    
    public virtual ICollection<ProgrammingTestCase> TestCases { get; set; } = new List<ProgrammingTestCase>();
}

