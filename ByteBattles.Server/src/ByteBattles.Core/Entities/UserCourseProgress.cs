namespace ByteBattles.Core.Entities;

/// <summary>
/// Tracks a user's progress in a specific course.
/// </summary>
public class UserCourseProgress
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public int CourseId { get; set; }
    
    /// <summary>
    /// Progress percentage (0-100)
    /// </summary>
    public decimal Progress { get; set; } = 0;
    
    public DateTime? LastAccessed { get; set; }
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    
    public virtual Course Course { get; set; } = null!;
}

