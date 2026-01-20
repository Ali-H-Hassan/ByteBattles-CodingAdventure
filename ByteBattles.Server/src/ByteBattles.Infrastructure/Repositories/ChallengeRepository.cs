using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using ByteBattles.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ByteBattles.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Challenge entity operations.
/// </summary>
public class ChallengeRepository : IChallengeRepository
{
    private readonly ByteBattlesDbContext _context;

    public ChallengeRepository(ByteBattlesDbContext context)
    {
        _context = context;
    }

    public async Task<Challenge?> GetByIdAsync(int id)
    {
        return await _context.Challenges
            .Include(c => c.TemplateCodes)
            .Include(c => c.TestCases)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Challenge>> GetAllAsync()
    {
        return await _context.Challenges
            .Include(c => c.TemplateCodes)
            .Include(c => c.TestCases)
            .ToListAsync();
    }

    public async Task<Challenge?> GetRandomAsync()
    {
        var count = await _context.Challenges.CountAsync();
        if (count == 0) return null;

        var random = new Random();
        var skip = random.Next(0, count);

        return await _context.Challenges
            .Include(c => c.TemplateCodes)
            .Include(c => c.TestCases)
            .Skip(skip)
            .FirstOrDefaultAsync();
    }

    public async Task<Challenge> CreateAsync(Challenge challenge)
    {
        _context.Challenges.Add(challenge);
        await _context.SaveChangesAsync();
        return challenge;
    }

    public async Task UpdateAsync(Challenge challenge)
    {
        _context.Challenges.Update(challenge);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var challenge = await _context.Challenges.FindAsync(id);
        if (challenge != null)
        {
            _context.Challenges.Remove(challenge);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Challenges.AnyAsync(c => c.Id == id);
    }
}

