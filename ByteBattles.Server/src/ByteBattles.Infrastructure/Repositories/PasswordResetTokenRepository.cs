using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using ByteBattles.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ByteBattles.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for PasswordResetToken entity operations.
/// </summary>
public class PasswordResetTokenRepository : IPasswordResetTokenRepository
{
    private readonly ByteBattlesDbContext _context;

    public PasswordResetTokenRepository(ByteBattlesDbContext context)
    {
        _context = context;
    }

    public async Task<PasswordResetToken?> GetByTokenAsync(string token)
    {
        return await _context.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == token && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow);
    }

    public async Task<PasswordResetToken?> GetActiveTokenByUserIdAsync(int userId)
    {
        return await _context.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.UserId == userId && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow);
    }

    public async Task<PasswordResetToken> CreateAsync(PasswordResetToken token)
    {
        _context.PasswordResetTokens.Add(token);
        await _context.SaveChangesAsync();
        return token;
    }

    public async Task UpdateAsync(PasswordResetToken token)
    {
        var entry = _context.Entry(token);
        if (entry.State == EntityState.Detached)
        {
            _context.PasswordResetTokens.Update(token);
        }
        await _context.SaveChangesAsync();
    }

    public async Task DeleteExpiredTokensAsync()
    {
        var expiredTokens = await _context.PasswordResetTokens
            .Where(t => t.ExpiresAt < DateTime.UtcNow || t.IsUsed)
            .ToListAsync();

        _context.PasswordResetTokens.RemoveRange(expiredTokens);
        await _context.SaveChangesAsync();
    }

    public async Task InvalidateUserTokensAsync(int userId)
    {
        var tokens = await _context.PasswordResetTokens
            .Where(t => t.UserId == userId && !t.IsUsed)
            .ToListAsync();

        foreach (var token in tokens)
        {
            token.IsUsed = true;
        }

        await _context.SaveChangesAsync();
    }
}
