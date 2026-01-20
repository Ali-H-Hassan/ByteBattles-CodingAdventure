namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a multiple-choice question in a test.
/// </summary>
public class McqQuestion
{
    public int Id { get; set; }
    
    public int TestId { get; set; }
    
    public string QuestionText { get; set; } = null!;
    
    // Navigation properties
    public virtual Test Test { get; set; } = null!;
    
    public virtual ICollection<McqOption> Options { get; set; } = new List<McqOption>();
}

