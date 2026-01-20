namespace ByteBattles.Infrastructure.MongoDB;

/// <summary>
/// Repository interface for MongoDB game data operations.
/// </summary>
public interface IGameDataRepository
{
    Task<GameSceneConfig?> GetGameConfigAsync(int courseId);
    Task<IEnumerable<GameSceneConfig>> GetAllGameConfigsAsync();
    Task<GameSceneConfig> CreateGameConfigAsync(GameSceneConfig config);
    Task UpdateGameConfigAsync(int courseId, GameSceneConfig config);
    Task DeleteGameConfigAsync(int courseId);
}

