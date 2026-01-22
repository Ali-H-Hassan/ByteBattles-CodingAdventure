using ByteBattles.Application.Interfaces;
using ByteBattles.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ByteBattles.Application;

/// <summary>
/// Extension methods for registering Application services.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adds Application services to the dependency injection container.
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register Application Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITestService, TestService>();
        services.AddScoped<ITestResultService, TestResultService>();
        services.AddScoped<IGameService, GameService>();
        services.AddScoped<IProfileService, ProfileService>();
        
        // AI Battle Services
        services.AddScoped<IGeminiService, GeminiService>();
        services.AddScoped<IBattleService, BattleService>();
        
        // Register HttpClient for Gemini API
        services.AddHttpClient();

        return services;
    }
}

