using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Game;
using ByteBattles.Core.Interfaces;
using ByteBattles.Infrastructure.MongoDB;

namespace ByteBattles.Application.Services;

/// <summary>
/// Game service implementation.
/// Handles course retrieval and score submission.
/// </summary>
public class GameService : IGameService
{
    private readonly ICourseRepository _courseRepository;
    private readonly IUserRepository _userRepository;
    private readonly IGameDataRepository _gameDataRepository;

    public GameService(
        ICourseRepository courseRepository, 
        IUserRepository userRepository,
        IGameDataRepository gameDataRepository)
    {
        _courseRepository = courseRepository;
        _userRepository = userRepository;
        _gameDataRepository = gameDataRepository;
    }

    public async Task<IEnumerable<CourseResponseDto>> GetCoursesAsync()
    {
        var courses = await _courseRepository.GetActiveAsync();
        return courses.Select(c => new CourseResponseDto
        {
            Id = c.Id,
            Title = c.Title,
            Description = c.Description,
            Difficulty = c.Difficulty,
            ImageUrl = c.ImageUrl,
            IsActive = c.IsActive,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        });
    }

    public async Task<ScoreResponseDto> SubmitScoreAsync(SubmitScoreDto dto)
    {
        var user = await _userRepository.GetByIdAsync(dto.UserId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var isNewHighScore = dto.Score > user.HighScore;
        
        if (isNewHighScore)
        {
            await _userRepository.UpdateHighScoreAsync(dto.UserId, dto.Score);
        }

        return new ScoreResponseDto
        {
            HighScore = isNewHighScore ? dto.Score : user.HighScore,
            IsNewHighScore = isNewHighScore
        };
    }

    public async Task<GameSceneConfig> GetGameConfigAsync(int courseId)
    {
        var config = await _gameDataRepository.GetGameConfigAsync(courseId);
        return config ?? throw new InvalidOperationException($"Game config not found for course {courseId}");
    }
}

