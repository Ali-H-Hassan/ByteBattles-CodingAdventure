using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Battle;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ByteBattles.Application.Services;

/// <summary>
/// Google Gemini AI service implementation.
/// Provides AI-powered code analysis and generation.
/// </summary>
public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly ILogger<GeminiService> _logger;
    private const string GeminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public GeminiService(IConfiguration configuration, ILogger<GeminiService> logger, IHttpClientFactory httpClientFactory)
    {
        _apiKey = configuration["Gemini:ApiKey"] ?? "";
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient();
    }

    public async Task<string> AnalyzeCodeAsync(string code)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            _logger.LogWarning("Gemini API key not configured. Returning default feedback.");
            return "Code analysis is not available. Please configure the Gemini API key.";
        }

        var prompt = $@"Analyze this JavaScript code and provide brief feedback (max 150 words). Use plain text only, no markdown formatting, no bold text, no code blocks.

Focus on:
- Is the code correct?
- Any performance issues?
- Best practices followed?
- Potential bugs or edge cases?

Code:
{code}

Provide concise, readable feedback in plain text format:";

        var feedback = await GenerateTextAsync(prompt);
        
        // Clean up markdown formatting if present
        feedback = feedback.Replace("**", "").Replace("*", "").Replace("`", "").Trim();
        
        return feedback;
    }

    public async Task<bool> IsCodeCorrectAsync(string code, string problemDescription)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            return false;
        }

        var prompt = $@"Does this JavaScript code correctly solve the problem? Answer only 'YES' or 'NO'.

Problem: {problemDescription}

Code:
{code}

Answer:";

        try
        {
            var response = await GenerateTextAsync(prompt);
            var normalizedResponse = response.Trim().ToUpper();
            return normalizedResponse.Contains("YES") || normalizedResponse.Contains("CORRECT");
        }
        catch
        {
            return false;
        }
    }

    public async Task<string> GenerateSolutionAsync(string problemDescription, string language)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            _logger.LogWarning("Gemini API key not configured. Returning placeholder.");
            return "/* AI solution generation is not available */";
        }

        var prompt = $@"Write a {language} solution for this coding problem:

{problemDescription}

Provide only the code without explanation.";

        return await GenerateTextAsync(prompt);
    }

    public async Task<GeneratedChallengeDto> GenerateChallengeAsync()
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            _logger.LogWarning("Gemini API key not configured. Returning default challenge.");
            return new GeneratedChallengeDto
            {
                Title = "Reverse a String",
                Description = "Write a function that reverses a string.",
                Difficulty = "Easy",
                TemplateCode = "function reverseString(str) {\n  // Your code here\n}",
                TestCases = new List<ChallengeTestCaseDto>
                {
                    new() { Input = "\"hello\"", ExpectedOutput = "\"olleh\"" },
                    new() { Input = "\"world\"", ExpectedOutput = "\"dlrow\"" }
                }
            };
        }

        var prompt = "Generate a random coding challenge in JSON format with the following structure:\n" +
            "{\n" +
            "  \"title\": \"Challenge Title\",\n" +
            "  \"description\": \"Detailed problem description with examples\",\n" +
            "  \"difficulty\": \"Easy\" or \"Medium\" or \"Hard\",\n" +
            "  \"templateCode\": \"JavaScript function template with placeholder comment\",\n" +
            "  \"testCases\": [\n" +
            "    { \"input\": \"input1\", \"expectedOutput\": \"output1\" },\n" +
            "    { \"input\": \"input2\", \"expectedOutput\": \"output2\" }\n" +
            "  ]\n" +
            "}\n\n" +
            "Make it interesting and varied. Return ONLY valid JSON, no markdown, no code blocks.";

        try
        {
            var jsonResponse = await GenerateTextAsync(prompt);
            
            // Clean up the response (remove markdown code blocks if present)
            jsonResponse = jsonResponse.Trim();
            if (jsonResponse.StartsWith("```json"))
            {
                jsonResponse = jsonResponse.Substring(7);
            }
            if (jsonResponse.StartsWith("```"))
            {
                jsonResponse = jsonResponse.Substring(3);
            }
            if (jsonResponse.EndsWith("```"))
            {
                jsonResponse = jsonResponse.Substring(0, jsonResponse.Length - 3);
            }
            jsonResponse = jsonResponse.Trim();

            using var doc = JsonDocument.Parse(jsonResponse);
            var root = doc.RootElement;

            var challenge = new GeneratedChallengeDto
            {
                Title = root.GetProperty("title").GetString() ?? "Coding Challenge",
                Description = root.GetProperty("description").GetString() ?? "",
                Difficulty = root.GetProperty("difficulty").GetString() ?? "Medium",
                TemplateCode = root.TryGetProperty("templateCode", out var template) 
                    ? template.GetString() 
                    : null
            };

            if (root.TryGetProperty("testCases", out var testCases))
            {
                foreach (var testCase in testCases.EnumerateArray())
                {
                    challenge.TestCases.Add(new ChallengeTestCaseDto
                    {
                        Input = testCase.GetProperty("input").GetString() ?? "",
                        ExpectedOutput = testCase.GetProperty("expectedOutput").GetString() ?? ""
                    });
                }
            }

            return challenge;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing generated challenge");
            // Return a fallback challenge
            return new GeneratedChallengeDto
            {
                Title = "Find Maximum Number",
                Description = "Write a function that finds the maximum number in an array.",
                Difficulty = "Easy",
                TemplateCode = "function findMax(arr) {\n  // Your code here\n}",
                TestCases = new List<ChallengeTestCaseDto>
                {
                    new() { Input = "[1, 5, 3, 9, 2]", ExpectedOutput = "9" },
                    new() { Input = "[-1, -5, -3]", ExpectedOutput = "-1" }
                }
            };
        }
    }

    private async Task<string> GenerateTextAsync(string prompt)
    {
        try
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var url = $"{GeminiApiUrl}?key={_apiKey}";
            var response = await _httpClient.PostAsJsonAsync(url, requestBody);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API error: {StatusCode} - {Content}", response.StatusCode, errorContent);
                return "Unable to generate AI response at this time.";
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonResponse);
            
            var text = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return text ?? "No response generated.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Gemini API");
            return "An error occurred while generating AI response.";
        }
    }
}