using System.ComponentModel.DataAnnotations;

namespace ByteBattles.Core.DTOs.Auth;

/// <summary>
/// Data transfer object for user login.
/// </summary>
public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
    
    [Required]
    public string Password { get; set; } = null!;
}

