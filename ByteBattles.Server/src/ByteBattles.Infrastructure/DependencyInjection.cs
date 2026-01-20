using ByteBattles.Core.Interfaces;
using ByteBattles.Infrastructure.Data;
using ByteBattles.Infrastructure.MongoDB;
using ByteBattles.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ByteBattles.Infrastructure;

/// <summary>
/// Extension methods for registering Infrastructure services.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Adds Infrastructure services to the dependency injection container.
    /// </summary>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Register DbContext with SQL Server
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        services.AddDbContext<ByteBattlesDbContext>(options =>
        {
            options.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null);
            });
        });

        // Register SQL Server Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITestRepository, TestRepository>();
        services.AddScoped<IChallengeRepository, ChallengeRepository>();
        services.AddScoped<ICourseRepository, CourseRepository>();
        
        // Register MongoDB Repositories (optional - for game data)
        services.AddSingleton<IGameDataRepository, GameDataRepository>();

        return services;
    }
}

