namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a role assigned to a user.
/// Roles: "learner", "admin", "company"
/// </summary>
public class UserRole
{
    public int UserId { get; set; }
    
    public string Role { get; set; } = null!;
    
    // Navigation property
    public virtual User User { get; set; } = null!;
}

