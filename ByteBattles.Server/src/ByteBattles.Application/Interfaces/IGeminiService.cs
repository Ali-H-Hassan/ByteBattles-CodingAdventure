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
    /// Generates a solution for a coding challenge.
    /// </summary>
    Task<string> GenerateSolutionAsync(string problemDescription, string language);
}

