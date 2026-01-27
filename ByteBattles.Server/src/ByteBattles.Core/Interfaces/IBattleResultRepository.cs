using ByteBattles.Core.Entities;

namespace ByteBattles.Core.Interfaces;

public interface IBattleResultRepository
{
    Task<BattleResult> CreateAsync(BattleResult battleResult);
    Task<IEnumerable<BattleResult>> GetByUserIdAsync(int userId);
    Task<BattleResult?> GetByIdAsync(int id);
}

