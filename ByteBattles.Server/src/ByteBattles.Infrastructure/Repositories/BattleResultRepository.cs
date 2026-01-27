using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using ByteBattles.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ByteBattles.Infrastructure.Repositories;

public class BattleResultRepository : IBattleResultRepository
{
    private readonly ByteBattlesDbContext _context;

    public BattleResultRepository(ByteBattlesDbContext context)
    {
        _context = context;
    }

    public async Task<BattleResult> CreateAsync(BattleResult battleResult)
    {
        _context.BattleResults.Add(battleResult);
        await _context.SaveChangesAsync();
        return battleResult;
    }

    public async Task<IEnumerable<BattleResult>> GetByUserIdAsync(int userId)
    {
        return await _context.BattleResults
            .Where(br => br.UserId == userId)
            .OrderByDescending(br => br.CompletedAt)
            .ToListAsync();
    }

    public async Task<BattleResult?> GetByIdAsync(int id)
    {
        return await _context.BattleResults
            .Include(br => br.User)
            .FirstOrDefaultAsync(br => br.Id == id);
    }
}

