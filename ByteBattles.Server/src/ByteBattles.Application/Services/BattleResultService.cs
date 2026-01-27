using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Battle;
using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;

namespace ByteBattles.Application.Services;

public class BattleResultService : IBattleResultService
{
    private readonly IBattleResultRepository _battleResultRepository;

    public BattleResultService(IBattleResultRepository battleResultRepository)
    {
        _battleResultRepository = battleResultRepository;
    }

    public async Task<BattleResultDto> SaveBattleResultAsync(int userId, BattleResponseDto battleResponse, string challengeTitle, string challengeDescription, string userCode, string aiSolutionCode)
    {
        var battleResult = new BattleResult
        {
            UserId = userId,
            ChallengeTitle = challengeTitle,
            ChallengeDescription = challengeDescription,
            UserCode = userCode,
            AiSolutionCode = aiSolutionCode,
            Winner = battleResponse.Winner,
            UserExecutionTime = battleResponse.UserResults.ExecutionTime,
            AiExecutionTime = battleResponse.AiResults.ExecutionTime,
            UserPassed = battleResponse.UserResults.Passed,
            AiPassed = battleResponse.AiResults.Passed,
            UserOutput = battleResponse.UserResults.Output,
            AiOutput = battleResponse.AiResults.Output,
            AiFeedback = battleResponse.AiFeedback,
            CompletedAt = DateTime.UtcNow
        };

        var saved = await _battleResultRepository.CreateAsync(battleResult);
        return MapToDto(saved);
    }

    public async Task<IEnumerable<BattleResultDto>> GetUserBattleResultsAsync(int userId)
    {
        var results = await _battleResultRepository.GetByUserIdAsync(userId);
        return results.Select(MapToDto);
    }

    private static BattleResultDto MapToDto(BattleResult result)
    {
        return new BattleResultDto
        {
            Id = result.Id,
            ChallengeTitle = result.ChallengeTitle,
            ChallengeDescription = result.ChallengeDescription,
            Winner = result.Winner,
            UserExecutionTime = result.UserExecutionTime,
            AiExecutionTime = result.AiExecutionTime,
            UserPassed = result.UserPassed,
            AiPassed = result.AiPassed,
            AiFeedback = result.AiFeedback,
            CompletedAt = result.CompletedAt
        };
    }
}

