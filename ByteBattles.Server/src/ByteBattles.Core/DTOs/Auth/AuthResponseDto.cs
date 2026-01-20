namespace ByteBattles.Core.DTOs.Auth;

/// <summary>
/// Data transfer object for authentication response.
/// </summary>
public class AuthResponseDto
{
    public UserDto User { get; set; } = null!;
    public string Token { get; set; } = null!;
}

/// <summary>
/// User data transfer object (excludes sensitive data like password).
/// </summary>
public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Name { get; set; }
    public string? ContactNumber { get; set; }
    public string? Address { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string UserType { get; set; } = null!;
    public string? CompanyName { get; set; }
    public string? CompanyAddress { get; set; }
    public string? CompanyContactNumber { get; set; }
    public int ExperiencePoints { get; set; }
    public int HighScore { get; set; }
    public int Rank { get; set; }
    public string? LearningPath { get; set; }
    public List<string> Roles { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
}

