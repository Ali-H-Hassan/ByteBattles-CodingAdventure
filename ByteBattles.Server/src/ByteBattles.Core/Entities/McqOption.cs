namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents an option for a multiple-choice question.
/// </summary>
public class McqOption
{
    public int Id { get; set; }
    
    public int McqQuestionId { get; set; }
    
    public string Text { get; set; } = null!;
    
    public bool IsCorrect { get; set; } = false;
    
    // Navigation property
    public virtual McqQuestion McqQuestion { get; set; } = null!;
}

