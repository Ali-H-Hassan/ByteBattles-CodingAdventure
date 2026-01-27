using ByteBattles.Core.DTOs.Battle;

namespace ByteBattles.Application.Interfaces;

/// <summary>
/// Interface for Google Gemini AI service operations.
/// </summary>
public interface IGeminiService
{
    /// <summary>
    /// Analyzes code and provides feedback.
    /// </summary>
    Task<string> AnalyzeCodeAsync(string code);
    
    /// <summary>
    /// Checks if code correctly solves the problem.
    /// </summary>
    Task<bool> IsCodeCorrectAsync(string code, string problemDescription);
    
    /// <summary>
    /// Generates a solution for a coding challenge.
    /// </summary>
    Task<string> GenerateSolutionAsync(string problemDescription, string language);
    
    /// <summary>
    /// Generates a random coding challenge.
    /// </summary>
    Task<GeneratedChallengeDto> GenerateChallengeAsync();
}

