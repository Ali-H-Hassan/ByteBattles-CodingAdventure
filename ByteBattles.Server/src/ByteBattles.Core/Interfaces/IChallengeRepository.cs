using ByteBattles.Core.Entities;

namespace ByteBattles.Core.Interfaces;

/// <summary>
/// Repository interface for Challenge entity operations.
/// </summary>
public interface IChallengeRepository
{
    Task<Challenge?> GetByIdAsync(int id);
    Task<IEnumerable<Challenge>> GetAllAsync();
    Task<Challenge?> GetRandomAsync();
    Task<Challenge> CreateAsync(Challenge challenge);
    Task UpdateAsync(Challenge challenge);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}

