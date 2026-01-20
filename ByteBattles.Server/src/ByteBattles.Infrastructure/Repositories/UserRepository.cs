using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using ByteBattles.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ByteBattles.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for User entity operations.
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly ByteBattlesDbContext _context;

    public UserRepository(ByteBattlesDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.GoogleId == googleId);
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .ToListAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Users.AnyAsync(u => u.Id == id);
    }

    public async Task UpdateHighScoreAsync(int userId, int score)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user != null && score > user.HighScore)
        {
            user.HighScore = score;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<User>> GetLeaderboardAsync(int take = 10)
    {
        return await _context.Users
            .OrderByDescending(u => u.HighScore)
            .ThenByDescending(u => u.ExperiencePoints)
            .Take(take)
            .ToListAsync();
    }
}

