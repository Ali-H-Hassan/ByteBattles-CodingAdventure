using ByteBattles.Core.DTOs.Auth;

namespace ByteBattles.Application.Interfaces;

/// <summary>
/// Interface for authentication service operations.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Registers a new user in the system.
    /// </summary>
    Task<AuthResult> RegisterAsync(RegisterDto dto);
    
    /// <summary>
    /// Authenticates a user with email and password.
    /// </summary>
    Task<AuthResult> LoginAsync(LoginDto dto);
    
    /// <summary>
    /// Authenticates or registers a user via Google OAuth.
    /// </summary>
    Task<AuthResult> GoogleAuthAsync(string googleId, string email, string name);
    
    /// <summary>
    /// Generates a JWT token for a user.
    /// </summary>
    string GenerateToken(int userId, string email, string userType, IEnumerable<string> roles);
    
    /// <summary>
    /// Validates a JWT token and returns the user ID if valid.
    /// </summary>
    int? ValidateToken(string token);

    /// <summary>
    /// Initiates the forgot password process by generating a reset token.
    /// </summary>
    Task<PasswordResetResult> ForgotPasswordAsync(ForgotPasswordDto dto);

    /// <summary>
    /// Resets the user's password using a valid reset token.
    /// </summary>
    Task<PasswordResetResult> ResetPasswordAsync(ResetPasswordDto dto);
}

/// <summary>
/// Result of an authentication operation.
/// </summary>
public class AuthResult
{
    public bool IsSuccess { get; private set; }
    public string? Error { get; private set; }
    public UserDto? User { get; private set; }
    public string? Token { get; private set; }

    public static AuthResult Success(UserDto user, string token)
        => new() { IsSuccess = true, User = user, Token = token };

    public static AuthResult Fail(string error)
        => new() { IsSuccess = false, Error = error };
}

/// <summary>
/// Result of a password reset operation.
/// </summary>
public class PasswordResetResult
{
    public bool IsSuccess { get; private set; }
    public string? Message { get; private set; }
    public string? Error { get; private set; }
    public string? ResetToken { get; private set; }

    public static PasswordResetResult Success(string message, string? resetToken = null)
        => new() { IsSuccess = true, Message = message, ResetToken = resetToken };

    public static PasswordResetResult Fail(string error)
        => new() { IsSuccess = false, Error = error };
}

