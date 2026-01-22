namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a user's test result/score for a company coding test.
/// </summary>
public class TestResult
{
    public int Id { get; set; }
    
    public int TestId { get; set; }
    
    public int UserId { get; set; }
    
    /// <summary>
    /// Total score achieved (percentage)
    /// </summary>
    public decimal Score { get; set; }
    
    /// <summary>
    /// Number of correct MCQ answers
    /// </summary>
    public int McqCorrectCount { get; set; }
    
    /// <summary>
    /// Total number of MCQ questions
    /// </summary>
    public int McqTotalCount { get; set; }
    
    /// <summary>
    /// Whether the programming question was solved correctly
    /// </summary>
    public bool ProgrammingCorrect { get; set; }
    
    /// <summary>
    /// User's answers to MCQ questions (JSON format: { questionId: optionId })
    /// </summary>
    public string? McqAnswers { get; set; }
    
    /// <summary>
    /// User's programming solution code
    /// </summary>
    public string? ProgrammingAnswer { get; set; }
    
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Test Test { get; set; } = null!;
    
    public virtual User User { get; set; } = null!;
}

