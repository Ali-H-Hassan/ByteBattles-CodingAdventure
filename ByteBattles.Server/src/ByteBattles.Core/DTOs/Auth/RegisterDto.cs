using System.ComponentModel.DataAnnotations;

namespace ByteBattles.Core.DTOs.Auth;

/// <summary>
/// Data transfer object for user registration.
/// </summary>
public class RegisterDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Username { get; set; } = null!;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
    
    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = null!;
    
    /// <summary>
    /// User type: "individual" or "company"
    /// </summary>
    public string UserType { get; set; } = "individual";
    
    // Optional company fields
    public string? CompanyName { get; set; }
    public string? CompanyAddress { get; set; }
    public string? CompanyContactNumber { get; set; }
}

