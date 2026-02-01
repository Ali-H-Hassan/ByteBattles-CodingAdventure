using ByteBattles.Core.Entities;

namespace ByteBattles.Core.Interfaces;

/// <summary>
/// Repository interface for PasswordResetToken entity operations.
/// </summary>
public interface IPasswordResetTokenRepository
{
    Task<PasswordResetToken?> GetByTokenAsync(string token);
    Task<PasswordResetToken?> GetActiveTokenByUserIdAsync(int userId);
    Task<PasswordResetToken> CreateAsync(PasswordResetToken token);
    Task UpdateAsync(PasswordResetToken token);
    Task DeleteExpiredTokensAsync();
    Task InvalidateUserTokensAsync(int userId);
}
