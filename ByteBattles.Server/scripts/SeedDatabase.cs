using ByteBattles.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.Development.json", optional: true)
    .AddJsonFile("appsettings.json", optional: true)
    .AddEnvironmentVariables()
    .Build();

var services = new ServiceCollection();
services.AddLogging(builder => builder.AddConsole());

var connectionString = configuration.GetConnectionString("DefaultConnection") ?? "Data Source=ByteBattles.db";
services.AddDbContext<ByteBattlesDbContext>(options =>
    options.UseSqlite(connectionString));

var serviceProvider = services.BuildServiceProvider();
var context = serviceProvider.GetRequiredService<ByteBattlesDbContext>();
var logger = serviceProvider.GetRequiredService<ILogger<Program>>();

try
{
    logger.LogInformation("Starting database seeding...");
    await DataSeeder.SeedAsync(context);
    logger.LogInformation("Database seeded successfully!");
    
    // Verify
    var userCount = await context.Users.CountAsync();
    logger.LogInformation($"Database now contains {userCount} users");
    
    var users = await context.Users.Select(u => new { u.Email, u.Username }).ToListAsync();
    foreach (var user in users)
    {
        logger.LogInformation($"  - {user.Email} ({user.Username})");
    }
}
catch (Exception ex)
{
    logger.LogError(ex, "Error seeding database");
    Environment.Exit(1);
}

