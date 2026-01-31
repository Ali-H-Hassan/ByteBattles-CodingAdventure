using System.Text.Json.Serialization;
using ByteBattles.Core.JsonConverters;

namespace ByteBattles.Core.DTOs.Test;

/// <summary>
/// DTO for submitting test answers.
/// </summary>
public class SubmitTestDto
{
    /// <summary>
    /// MCQ answers: Dictionary of questionId -> selected optionId
    /// </summary>
    [JsonPropertyName("mcqAnswers")]
    [JsonConverter(typeof(IntDictionaryConverter))]
    public Dictionary<int, int>? McqAnswers { get; set; }
    
    /// <summary>
    /// Programming question solution code
    /// </summary>
    [JsonPropertyName("programmingAnswer")]
    public string? ProgrammingAnswer { get; set; }
}

