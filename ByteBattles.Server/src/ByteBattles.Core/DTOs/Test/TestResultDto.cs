namespace ByteBattles.Core.DTOs.Test;

/// <summary>
/// DTO for test result response.
/// </summary>
public class TestResultDto
{
    public int Id { get; set; }

    public int TestId { get; set; }

    public string TestTitle { get; set; } = null!;

    public string? CompanyName { get; set; }

    public decimal Score { get; set; }

    public int McqCorrectCount { get; set; }

    public int McqTotalCount { get; set; }

    public bool ProgrammingCorrect { get; set; }

    public DateTime CompletedAt { get; set; }

    // User information (for company view)
    public int? UserId { get; set; }

    public string? Username { get; set; }

    public string? DisplayName { get; set; }

    public string? UserEmail { get; set; }
    
    public string? UserProfilePictureUrl { get; set; }
    
    // Answer details (for company view)
    public string? McqAnswers { get; set; }
    
    public string? ProgrammingAnswer { get; set; }
    
    // User type for filtering
    public string? UserType { get; set; }
}

