namespace ByteBattles.Core.DTOs.Statistics;

public class LeaderboardEntryDto
{
    public int UserId { get; set; }
    public string Username { get; set; } = null!;
    public string? ProfilePictureUrl { get; set; }
    public double AverageScore { get; set; }
    public int TotalTestsTaken { get; set; }
}

