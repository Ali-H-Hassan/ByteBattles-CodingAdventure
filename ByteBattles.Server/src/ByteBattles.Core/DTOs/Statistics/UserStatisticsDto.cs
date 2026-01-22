namespace ByteBattles.Core.DTOs.Statistics;

/// <summary>
/// DTO for user statistics.
/// </summary>
public class UserStatisticsDto
{
    public int TotalTestsTaken { get; set; }
    
    public int PassedTests { get; set; }
    
    public int FailedTests { get; set; }
    
    public decimal AverageScore { get; set; }
}

