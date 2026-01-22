namespace ByteBattles.Core.DTOs.Profile;

/// <summary>
/// Data transfer object for updating user profile.
/// </summary>
public class UpdateProfileDto
{
    public string? Name { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? ContactNumber { get; set; }
    public string? Address { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? LearningPath { get; set; }
    
    // Company-specific fields
    public string? CompanyName { get; set; }
    public string? CompanyAddress { get; set; }
    public string? CompanyContactNumber { get; set; }
}

