namespace ByteBattles.Core.DTOs.Test;

/// <summary>
/// DTO for submitting test answers.
/// </summary>
public class SubmitTestDto
{
    /// <summary>
    /// MCQ answers: Dictionary of questionId -> selected optionId
    /// </summary>
    public Dictionary<int, int>? McqAnswers { get; set; }
    
    /// <summary>
    /// Programming question solution code
    /// </summary>
    public string? ProgrammingAnswer { get; set; }
}

