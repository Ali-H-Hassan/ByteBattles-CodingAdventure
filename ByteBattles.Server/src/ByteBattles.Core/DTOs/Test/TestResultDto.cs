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
}

