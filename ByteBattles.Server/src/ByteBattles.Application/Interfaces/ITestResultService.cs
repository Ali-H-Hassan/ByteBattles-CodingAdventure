using ByteBattles.Core.DTOs.Statistics;
using ByteBattles.Core.DTOs.Test;

namespace ByteBattles.Application.Interfaces;

/// <summary>
/// Service interface for test result operations.
/// </summary>
public interface ITestResultService
{
    Task<TestResultDto> SubmitTestAsync(int testId, int userId, SubmitTestDto dto);
    
    Task<IEnumerable<TestResultDto>> GetUserResultsAsync(int userId);
    
    Task<TestResultDto?> GetResultByTestIdAndUserIdAsync(int testId, int userId);
    
    Task<bool> HasUserTakenTestAsync(int testId, int userId);
    
    Task<UserStatisticsDto> GetUserStatisticsAsync(int userId);
    
    Task<IEnumerable<LeaderboardEntryDto>> GetTopTestTakersAsync(int topCount = 3);
    
    Task<IEnumerable<LeaderboardEntryDto>> GetTopTestTakersByCompanyAsync(int companyId, int topCount = 3);
}

