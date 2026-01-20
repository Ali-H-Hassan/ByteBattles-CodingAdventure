using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Auth;
using ByteBattles.Core.DTOs.Profile;
using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;

namespace ByteBattles.Application.Services;

/// <summary>
/// Profile service implementation.
/// Handles user profile operations.
/// </summary>
public class ProfileService : IProfileService
{
    private readonly IUserRepository _userRepository;

    public ProfileService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto?> GetProfileAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        return user == null ? null : MapToUserDto(user);
    }

    public async Task<UserDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return null;

        // Update only provided fields
        if (dto.Name != null) user.Name = dto.Name;
        if (dto.ContactNumber != null) user.ContactNumber = dto.ContactNumber;
        if (dto.Address != null) user.Address = dto.Address;
        if (dto.Country != null) user.Country = dto.Country;
        if (dto.City != null) user.City = dto.City;
        if (dto.ProfilePictureUrl != null) user.ProfilePictureUrl = dto.ProfilePictureUrl;
        if (dto.LearningPath != null) user.LearningPath = dto.LearningPath;

        // Company-specific fields
        if (user.UserType == "company")
        {
            if (dto.CompanyName != null) user.CompanyName = dto.CompanyName;
            if (dto.CompanyAddress != null) user.CompanyAddress = dto.CompanyAddress;
            if (dto.CompanyContactNumber != null) user.CompanyContactNumber = dto.CompanyContactNumber;
        }

        await _userRepository.UpdateAsync(user);
        return MapToUserDto(user);
    }

    public async Task<IEnumerable<UserDto>> GetLeaderboardAsync(int take = 10)
    {
        var users = await _userRepository.GetLeaderboardAsync(take);
        return users.Select(MapToUserDto);
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Name = user.Name,
            ContactNumber = user.ContactNumber,
            Address = user.Address,
            Country = user.Country,
            City = user.City,
            ProfilePictureUrl = user.ProfilePictureUrl,
            UserType = user.UserType,
            CompanyName = user.CompanyName,
            CompanyAddress = user.CompanyAddress,
            CompanyContactNumber = user.CompanyContactNumber,
            ExperiencePoints = user.ExperiencePoints,
            HighScore = user.HighScore,
            Rank = user.Rank,
            LearningPath = user.LearningPath,
            Roles = user.UserRoles.Select(ur => ur.Role).ToList(),
            CreatedAt = user.CreatedAt,
            LastLogin = user.LastLogin
        };
    }
}

