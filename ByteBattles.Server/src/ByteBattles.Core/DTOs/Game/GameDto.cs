using System.ComponentModel.DataAnnotations;

namespace ByteBattles.Core.DTOs.Game;

/// <summary>
/// Data transfer object for submitting game score.
/// </summary>
public class SubmitScoreDto
{
    [Required]
    public int UserId { get; set; }
    
    [Required]
    [Range(0, int.MaxValue)]
    public int Score { get; set; }
}

/// <summary>
/// Data transfer object for score submission response.
/// </summary>
public class ScoreResponseDto
{
    public int HighScore { get; set; }
    public bool IsNewHighScore { get; set; }
}

/// <summary>
/// Data transfer object for course response.
/// </summary>
public class CourseResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Difficulty { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

