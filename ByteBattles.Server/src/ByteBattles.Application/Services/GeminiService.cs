using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using ByteBattles.Application.Interfaces;
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
    private const string GeminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

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

        var prompt = $@"Analyze this JavaScript code and provide constructive feedback on:
1. Code correctness
2. Performance optimizations
3. Best practices
4. Potential bugs

Code:
```javascript
{code}
```

Provide a concise analysis (max 200 words).";

        return await GenerateTextAsync(prompt);
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

