using ByteBattles.Core.DTOs.Battle;

namespace ByteBattles.Application.Interfaces;

/// <summary>
/// Interface for AI battle service operations.
/// </summary>
public interface IBattleService
{
    /// <summary>
    /// Runs a coding battle between user and AI.
    /// </summary>
    Task<BattleResponseDto> RunBattleAsync(BattleRequestDto request);
}

