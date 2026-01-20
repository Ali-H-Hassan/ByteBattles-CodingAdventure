using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Game;
using ByteBattles.Core.Interfaces;

namespace ByteBattles.Application.Services;

/// <summary>
/// Game service implementation.
/// Handles course retrieval and score submission.
/// </summary>
public class GameService : IGameService
{
    private readonly ICourseRepository _courseRepository;
    private readonly IUserRepository _userRepository;

    public GameService(ICourseRepository courseRepository, IUserRepository userRepository)
    {
        _courseRepository = courseRepository;
        _userRepository = userRepository;
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
}

