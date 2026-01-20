namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a company-created coding test for hiring purposes.
/// </summary>
public class Test
{
    public int Id { get; set; }
    
    public string Title { get; set; } = null!;
    
    public int CreatedById { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual User CreatedBy { get; set; } = null!;
    
    public virtual ICollection<McqQuestion> McqQuestions { get; set; } = new List<McqQuestion>();
    
    public virtual ProgrammingQuestion? ProgrammingQuestion { get; set; }
}

