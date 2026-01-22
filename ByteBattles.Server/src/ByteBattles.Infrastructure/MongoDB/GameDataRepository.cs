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
    /// Course IDs: 1=HTML Basics, 2=CSS Fundamentals, 3=NodeJs Basics, 4=Python Fundamentals
    /// </summary>
    private static GameSceneConfig GetDefaultGameConfig(int courseId)
    {
        return courseId switch
        {
            // HTML Basics - Drag and drop HTML tags
            1 => new GameSceneConfig
            {
                CourseId = courseId,
                BackgroundColor = "#1a1a2e",
                TitleText = "HTML Tag Challenge",
                Tags = new List<GameTag>
                {
                    new() { Text = "<div>", X = 100, Y = 500, Category = "Container" },
                    new() { Text = "<span>", X = 200, Y = 500, Category = "Container" },
                    new() { Text = "<p>", X = 300, Y = 500, Category = "Text" },
                    new() { Text = "<h1>", X = 400, Y = 500, Category = "Text" },
                    new() { Text = "<img>", X = 500, Y = 500, Category = "Media" },
                    new() { Text = "<a>", X = 600, Y = 500, Category = "Link" }
                },
                Categories = new Dictionary<string, DropZone>
                {
                    { "Container", new DropZone { X = 200, Y = 200, Width = 200, Height = 150 } },
                    { "Text", new DropZone { X = 400, Y = 200, Width = 200, Height = 150 } },
                    { "Media", new DropZone { X = 200, Y = 400, Width = 200, Height = 150 } },
                    { "Link", new DropZone { X = 400, Y = 400, Width = 200, Height = 150 } }
                }
            },
            // CSS Fundamentals - Match CSS properties to HTML elements
            2 => new GameSceneConfig
            {
                CourseId = courseId,
                BackgroundColor = "#0d1b2a",
                TitleText = "CSS Property Matching",
                CssProperties = new List<CssProperty>
                {
                    new CssProperty { Key = "color", Value = "red", X = 100, Y = 150 },
                    new CssProperty { Key = "font-size", Value = "20px", X = 250, Y = 150 },
                    new CssProperty { Key = "background-color", Value = "blue", X = 400, Y = 150 },
                    new CssProperty { Key = "margin", Value = "10px", X = 550, Y = 150 },
                    new CssProperty { Key = "padding", Value = "5px", X = 100, Y = 300 },
                    new CssProperty { Key = "border", Value = "1px solid black", X = 250, Y = 300 }
                },
                HtmlTargets = new List<HtmlTarget>
                {
                    new HtmlTarget { Key = "color", X = 150, Y = 450 },
                    new HtmlTarget { Key = "font-size", X = 300, Y = 450 },
                    new HtmlTarget { Key = "background-color", X = 450, Y = 450 },
                    new HtmlTarget { Key = "margin", X = 150, Y = 550 },
                    new HtmlTarget { Key = "padding", X = 300, Y = 550 },
                    new HtmlTarget { Key = "border", X = 450, Y = 550 }
                }
            },
            // NodeJs Basics - Maze game (doesn't need gameSceneConfig)
            3 => new GameSceneConfig
            {
                CourseId = courseId,
                BackgroundColor = "#16213e",
                TitleText = "Node.js Maze Adventure"
            },
            // Python Fundamentals - Maze game (doesn't need gameSceneConfig)
            4 => new GameSceneConfig
            {
                CourseId = courseId,
                BackgroundColor = "#16213e",
                TitleText = "Python Maze Adventure"
            },
            _ => new GameSceneConfig
            {
                CourseId = courseId,
                BackgroundColor = "#1a1a2e",
                TitleText = "Drag and Drop Challenge",
                Tags = new List<GameTag>
                {
                    new() { Text = "HTML", X = 100, Y = 500, Category = "Frontend" },
                    new() { Text = "CSS", X = 200, Y = 500, Category = "Frontend" },
                    new() { Text = "JavaScript", X = 300, Y = 500, Category = "Frontend" }
                },
                Categories = new Dictionary<string, DropZone>
                {
                    { "Frontend", new DropZone { X = 200, Y = 200, Width = 200, Height = 150 } },
                    { "Backend", new DropZone { X = 500, Y = 200, Width = 200, Height = 150 } }
                }
            }
        };
    }
}

