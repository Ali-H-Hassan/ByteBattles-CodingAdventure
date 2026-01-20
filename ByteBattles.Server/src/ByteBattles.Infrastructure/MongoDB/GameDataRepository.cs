using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace ByteBattles.Infrastructure.MongoDB;

/// <summary>
/// MongoDB repository implementation for game data.
/// </summary>
public class GameDataRepository : IGameDataRepository
{
    private readonly IMongoCollection<GameSceneConfig>? _gameConfigs;
    private readonly ILogger<GameDataRepository> _logger;
    private readonly bool _isConfigured;

    public GameDataRepository(IConfiguration configuration, ILogger<GameDataRepository> logger)
    {
        _logger = logger;
        
        var connectionString = configuration.GetConnectionString("MongoDB");
        if (string.IsNullOrEmpty(connectionString))
        {
            _logger.LogWarning("MongoDB connection string not configured. Game data repository will use fallback.");
            _isConfigured = false;
            return;
        }

        try
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase("bytebattle_games");
            _gameConfigs = database.GetCollection<GameSceneConfig>("gameConfigs");
            _isConfigured = true;
            _logger.LogInformation("MongoDB game data repository initialized");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize MongoDB connection");
            _isConfigured = false;
        }
    }

    public async Task<GameSceneConfig?> GetGameConfigAsync(int courseId)
    {
        if (!_isConfigured || _gameConfigs == null)
        {
            return GetDefaultGameConfig(courseId);
        }

        var config = await _gameConfigs.Find(g => g.CourseId == courseId).FirstOrDefaultAsync();
        return config ?? GetDefaultGameConfig(courseId);
    }

    public async Task<IEnumerable<GameSceneConfig>> GetAllGameConfigsAsync()
    {
        if (!_isConfigured || _gameConfigs == null)
        {
            return new List<GameSceneConfig>();
        }

        return await _gameConfigs.Find(_ => true).ToListAsync();
    }

    public async Task<GameSceneConfig> CreateGameConfigAsync(GameSceneConfig config)
    {
        if (!_isConfigured || _gameConfigs == null)
        {
            throw new InvalidOperationException("MongoDB is not configured");
        }

        await _gameConfigs.InsertOneAsync(config);
        return config;
    }

    public async Task UpdateGameConfigAsync(int courseId, GameSceneConfig config)
    {
        if (!_isConfigured || _gameConfigs == null)
        {
            throw new InvalidOperationException("MongoDB is not configured");
        }

        config.CourseId = courseId;
        await _gameConfigs.ReplaceOneAsync(g => g.CourseId == courseId, config, new ReplaceOptions { IsUpsert = true });
    }

    public async Task DeleteGameConfigAsync(int courseId)
    {
        if (!_isConfigured || _gameConfigs == null)
        {
            throw new InvalidOperationException("MongoDB is not configured");
        }

        await _gameConfigs.DeleteOneAsync(g => g.CourseId == courseId);
    }

    /// <summary>
    /// Returns a default game configuration when MongoDB is not available
    /// </summary>
    private static GameSceneConfig GetDefaultGameConfig(int courseId)
    {
        return new GameSceneConfig
        {
            CourseId = courseId,
            BackgroundColor = "#1a1a2e",
            TitleText = "Drag and Drop Challenge",
            Tags = new List<GameTag>
            {
                new() { Text = "HTML", X = 100, Y = 500, Category = "Frontend" },
                new() { Text = "CSS", X = 200, Y = 500, Category = "Frontend" },
                new() { Text = "JavaScript", X = 300, Y = 500, Category = "Frontend" },
                new() { Text = "Node.js", X = 400, Y = 500, Category = "Backend" },
                new() { Text = "SQL", X = 500, Y = 500, Category = "Backend" }
            },
            Categories = new Dictionary<string, DropZone>
            {
                { "Frontend", new DropZone { X = 200, Y = 200, Width = 200, Height = 150 } },
                { "Backend", new DropZone { X = 500, Y = 200, Width = 200, Height = 150 } }
            }
        };
    }
}

