namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a learning course in the system.
/// </summary>
public class Course
{
    public int Id { get; set; }
    
    public string Title { get; set; } = null!;
    
    public string Description { get; set; } = null!;
    
    /// <summary>
    /// Difficulty level: "Beginner", "Intermediate", "Advanced"
    /// </summary>
    public string Difficulty { get; set; } = null!;
    
    public string ImageUrl { get; set; } = null!;
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<UserCourseProgress> UserProgress { get; set; } = new List<UserCourseProgress>();
}

