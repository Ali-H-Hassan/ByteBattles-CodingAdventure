using ByteBattles.Core.DTOs.Battle;

namespace ByteBattles.Application.Interfaces;

public interface IBattleResultService
{
    Task<BattleResultDto> SaveBattleResultAsync(int userId, BattleResponseDto battleResponse, string challengeTitle, string challengeDescription, string userCode, string aiSolutionCode);
    Task<IEnumerable<BattleResultDto>> GetUserBattleResultsAsync(int userId);
}

