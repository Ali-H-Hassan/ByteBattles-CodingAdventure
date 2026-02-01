using System.ComponentModel.DataAnnotations;

namespace ByteBattles.Core.DTOs.Auth;

/// <summary>
/// Data transfer object for password reset.
/// </summary>
public class ResetPasswordDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Token { get; set; } = null!;

    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string NewPassword { get; set; } = null!;

    [Required]
    [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = null!;
}
