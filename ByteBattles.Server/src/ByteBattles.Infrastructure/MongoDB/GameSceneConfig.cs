using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ByteBattles.Infrastructure.MongoDB;

/// <summary>
/// MongoDB document for game scene configurations.
/// Stores flexible game data that doesn't fit well in SQL Server.
/// </summary>
public class GameSceneConfig
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    /// <summary>
    /// Reference to the SQL Server Course ID
    /// </summary>
    public int CourseId { get; set; }
    
    /// <summary>
    /// Background color for the game scene
    /// </summary>
    public string BackgroundColor { get; set; } = "#1a1a2e";
    
    /// <summary>
    /// Title text displayed in the game
    /// </summary>
    public string TitleText { get; set; } = string.Empty;
    
    /// <summary>
    /// Draggable tags in the game
    /// </summary>
    public List<GameTag> Tags { get; set; } = new();
    
    /// <summary>
    /// Drop zone categories
    /// </summary>
    public Dictionary<string, DropZone> Categories { get; set; } = new();
}

/// <summary>
/// Represents a draggable tag in the game
/// </summary>
public class GameTag
{
    public string Text { get; set; } = string.Empty;
    public int X { get; set; }
    public int Y { get; set; }
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Represents a drop zone in the game
/// </summary>
public class DropZone
{
    public int X { get; set; }
    public int Y { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
}

