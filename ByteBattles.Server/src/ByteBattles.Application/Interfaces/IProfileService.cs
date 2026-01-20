using ByteBattles.Core.DTOs.Auth;
using ByteBattles.Core.DTOs.Profile;

namespace ByteBattles.Application.Interfaces;

/// <summary>
/// Interface for profile service operations.
/// </summary>
public interface IProfileService
{
    Task<UserDto?> GetProfileAsync(int userId);
    Task<UserDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto);
    Task<IEnumerable<UserDto>> GetLeaderboardAsync(int take = 10);
}

