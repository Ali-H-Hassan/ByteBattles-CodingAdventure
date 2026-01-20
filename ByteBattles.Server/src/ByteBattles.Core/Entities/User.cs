namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a user in the ByteBattles system.
/// Can be either an individual learner or a company.
/// </summary>
public class User
{
    public int Id { get; set; }
    
    /// <summary>
    /// Google OAuth ID for social login
    /// </summary>
    public string? GoogleId { get; set; }
    
    public string Username { get; set; } = null!;
    
    public string Email { get; set; } = null!;
    
    /// <summary>
    /// BCrypt hashed password. Null if user registered via Google OAuth.
    /// </summary>
    public string? PasswordHash { get; set; }
    
    public string? Name { get; set; }
    
    public string? ContactNumber { get; set; }
    
    public string? Address { get; set; }
    
    public string? Country { get; set; }
    
    public string? City { get; set; }
    
    public string? ProfilePictureUrl { get; set; }
    
    /// <summary>
    /// User type: "individual" or "company"
    /// </summary>
    public string UserType { get; set; } = "individual";
    
    // Company-specific fields
    public string? CompanyName { get; set; }
    
    public string? CompanyAddress { get; set; }
    
    public string? CompanyContactNumber { get; set; }
    
    /// <summary>
    /// Experience points earned through learning activities
    /// </summary>
    public int ExperiencePoints { get; set; } = 0;
    
    /// <summary>
    /// Highest score achieved in games
    /// </summary>
    public int HighScore { get; set; } = 0;
    
    /// <summary>
    /// User's rank based on performance
    /// </summary>
    public int Rank { get; set; } = 1;
    
    /// <summary>
    /// Learning path: "Frontend" or "Backend"
    /// </summary>
    public string? LearningPath { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? LastLogin { get; set; }
    
    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    
    public virtual ICollection<UserCourseProgress> CourseProgress { get; set; } = new List<UserCourseProgress>();
    
    public virtual ICollection<UserCompletedChallenge> CompletedChallenges { get; set; } = new List<UserCompletedChallenge>();
    
    public virtual ICollection<Test> CreatedTests { get; set; } = new List<Test>();
}

