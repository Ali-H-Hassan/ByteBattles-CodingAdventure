using ByteBattles.Core.Entities;

namespace ByteBattles.Core.Interfaces;

/// <summary>
/// Repository interface for User entity operations.
/// </summary>
public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByGoogleIdAsync(string googleId);
    Task<IEnumerable<User>> GetAllAsync();
    Task<User> CreateAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task UpdateHighScoreAsync(int userId, int score);
    Task<IEnumerable<User>> GetLeaderboardAsync(int take = 10);
}

