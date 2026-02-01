namespace ByteBattles.Core.Entities;

/// <summary>
/// Represents a password reset token for user account recovery.
/// </summary>
public class PasswordResetToken
{
    public int Id { get; set; }

    public int UserId { get; set; }

    /// <summary>
    /// The unique reset token (hashed for security)
    /// </summary>
    public string Token { get; set; } = null!;

    /// <summary>
    /// When the token expires (typically 1 hour from creation)
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// When the token was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Whether the token has been used
    /// </summary>
    public bool IsUsed { get; set; } = false;

    // Navigation property
    public virtual User User { get; set; } = null!;
}
