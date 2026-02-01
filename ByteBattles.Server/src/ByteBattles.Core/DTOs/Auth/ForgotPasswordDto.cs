using System.ComponentModel.DataAnnotations;

namespace ByteBattles.Core.DTOs.Auth;

/// <summary>
/// Data transfer object for forgot password request.
/// </summary>
public class ForgotPasswordDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
}
