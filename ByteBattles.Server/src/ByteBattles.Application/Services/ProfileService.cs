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

        // Track what fields are being updated
        var updatedFields = new List<string>();

        // Update only provided fields (including empty strings to allow clearing)
        // Check if property was explicitly set (not null) - empty string means clear the field
        if (dto.Name != null)
        {
            user.Name = dto.Name;
            updatedFields.Add("Name");
        }
        if (dto.Username != null)
        {
            user.Username = dto.Username;
            updatedFields.Add("Username");
        }
        if (dto.Email != null)
        {
            user.Email = dto.Email;
            updatedFields.Add("Email");
        }
        if (dto.Password != null && !string.IsNullOrEmpty(dto.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            updatedFields.Add("Password");
        }
        if (dto.ContactNumber != null)
        {
            user.ContactNumber = dto.ContactNumber;
            updatedFields.Add("ContactNumber");
        }
        if (dto.Address != null)
        {
            user.Address = dto.Address;
            updatedFields.Add("Address");
        }
        if (dto.Country != null)
        {
            user.Country = dto.Country;
            updatedFields.Add("Country");
        }
        if (dto.City != null)
        {
            user.City = dto.City;
            updatedFields.Add("City");
        }
        if (dto.ProfilePictureUrl != null)
        {
            user.ProfilePictureUrl = dto.ProfilePictureUrl;
            updatedFields.Add("ProfilePictureUrl");
        }
        if (dto.LearningPath != null)
        {
            user.LearningPath = dto.LearningPath;
            updatedFields.Add("LearningPath");
        }

        // Company-specific fields
        if (user.UserType == "company")
        {
            if (dto.CompanyName != null)
            {
                user.CompanyName = dto.CompanyName;
                updatedFields.Add("CompanyName");
            }
            if (dto.CompanyAddress != null)
            {
                user.CompanyAddress = dto.CompanyAddress;
                updatedFields.Add("CompanyAddress");
            }
            if (dto.CompanyContactNumber != null)
            {
                user.CompanyContactNumber = dto.CompanyContactNumber;
                updatedFields.Add("CompanyContactNumber");
            }
        }

        // Only save if there are changes
        if (updatedFields.Count > 0)
        {
            // Save all changes in one transaction
            await _userRepository.UpdateAsync(user);
        }

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

