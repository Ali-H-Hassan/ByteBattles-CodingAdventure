using ByteBattles.Core.DTOs.Game;
using ByteBattles.Infrastructure.MongoDB;

namespace ByteBattles.Application.Interfaces;

/// <summary>
/// Interface for game service operations.
/// </summary>
public interface IGameService
{
    Task<IEnumerable<CourseResponseDto>> GetCoursesAsync();
    Task<ScoreResponseDto> SubmitScoreAsync(SubmitScoreDto dto);
    Task<GameSceneConfig> GetGameConfigAsync(int courseId);
}

