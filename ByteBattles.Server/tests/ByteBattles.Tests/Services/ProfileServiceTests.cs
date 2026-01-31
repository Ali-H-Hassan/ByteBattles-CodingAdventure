using ByteBattles.Application.Services;
using ByteBattles.Core.DTOs.Profile;
using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using Moq;

namespace ByteBattles.Tests.Services;

/// <summary>
/// Unit tests for the ProfileService.
/// Tests profile retrieval, updates, and leaderboard functionality.
/// </summary>
public class ProfileServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly ProfileService _profileService;

    public ProfileServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _profileService = new ProfileService(_userRepositoryMock.Object);
    }

    #region GetProfileAsync Tests

    [Fact]
    public async Task GetProfileAsync_WithExistingUser_ReturnsUserDto()
    {
        // Arrange
        var user = CreateSampleUser();
        _userRepositoryMock.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        var result = await _profileService.GetProfileAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("testuser", result.Username);
        Assert.Equal("testuser@example.com", result.Email);
        Assert.Equal("Test User", result.Name);
    }

    [Fact]
    public async Task GetProfileAsync_WithNonExistingUser_ReturnsNull()
    {
        // Arrange
        _userRepositoryMock.Setup(r => r.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _profileService.GetProfileAsync(999);

        // Assert
        Assert.Null(result);
    }

    #endregion

    #region UpdateProfileAsync Tests

    [Fact]
    public async Task UpdateProfileAsync_WithValidData_UpdatesAndReturnsUser()
    {
        // Arrange
        var user = CreateSampleUser();
        var updateDto = new UpdateProfileDto
        {
            Name = "Updated Name",
            ContactNumber = "+1234567890"
        };

        _userRepositoryMock.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(user);
        _userRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _profileService.UpdateProfileAsync(1, updateDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Updated Name", result.Name);
        Assert.Equal("+1234567890", result.ContactNumber);
        _userRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public async Task UpdateProfileAsync_WithNonExistingUser_ReturnsNull()
    {
        // Arrange
        var updateDto = new UpdateProfileDto { Name = "New Name" };
        _userRepositoryMock.Setup(r => r.GetByIdAsync(999))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _profileService.UpdateProfileAsync(999, updateDto);

        // Assert
        Assert.Null(result);
        _userRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task UpdateProfileAsync_WithNoChanges_DoesNotCallUpdate()
    {
        // Arrange
        var user = CreateSampleUser();
        var updateDto = new UpdateProfileDto(); // No fields set

        _userRepositoryMock.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(user);

        // Act
        var result = await _profileService.UpdateProfileAsync(1, updateDto);

        // Assert
        Assert.NotNull(result);
        _userRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task UpdateProfileAsync_WithPassword_HashesPassword()
    {
        // Arrange
        var user = CreateSampleUser();
        var originalHash = user.PasswordHash;
        var updateDto = new UpdateProfileDto
        {
            Password = "newpassword123"
        };

        _userRepositoryMock.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(user);
        _userRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _profileService.UpdateProfileAsync(1, updateDto);

        // Assert
        Assert.NotNull(result);
        _userRepositoryMock.Verify(r => r.UpdateAsync(It.Is<User>(u =>
            u.PasswordHash != originalHash)), Times.Once);
    }

    [Fact]
    public async Task UpdateProfileAsync_CompanyUser_UpdatesCompanyFields()
    {
        // Arrange
        var companyUser = CreateSampleUser();
        companyUser.UserType = "company";

        var updateDto = new UpdateProfileDto
        {
            CompanyName = "New Company Name",
            CompanyAddress = "123 Business St"
        };

        _userRepositoryMock.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(companyUser);
        _userRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _profileService.UpdateProfileAsync(1, updateDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Company Name", result.CompanyName);
        Assert.Equal("123 Business St", result.CompanyAddress);
    }

    [Fact]
    public async Task UpdateProfileAsync_IndividualUser_IgnoresCompanyFields()
    {
        // Arrange
        var user = CreateSampleUser();
        user.UserType = "individual";

        var updateDto = new UpdateProfileDto
        {
            Name = "New Name",
            CompanyName = "Should Be Ignored"
        };

        _userRepositoryMock.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(user);
        _userRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _profileService.UpdateProfileAsync(1, updateDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Name", result.Name);
        // Company name should not be updated for individual users
        Assert.Null(result.CompanyName);
    }

    #endregion

    #region GetLeaderboardAsync Tests

    [Fact]
    public async Task GetLeaderboardAsync_ReturnsTopUsers()
    {
        // Arrange
        var users = new List<User>
        {
            CreateSampleUser(1, "user1", 1000),
            CreateSampleUser(2, "user2", 800),
            CreateSampleUser(3, "user3", 600)
        };

        _userRepositoryMock.Setup(r => r.GetLeaderboardAsync(10))
            .ReturnsAsync(users);

        // Act
        var result = await _profileService.GetLeaderboardAsync(10);

        // Assert
        Assert.Equal(3, result.Count());
        Assert.Equal("user1", result.First().Username);
    }

    [Fact]
    public async Task GetLeaderboardAsync_WithEmptyResults_ReturnsEmptyList()
    {
        // Arrange
        _userRepositoryMock.Setup(r => r.GetLeaderboardAsync(10))
            .ReturnsAsync(new List<User>());

        // Act
        var result = await _profileService.GetLeaderboardAsync(10);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetLeaderboardAsync_UsesCorrectTakeParameter()
    {
        // Arrange
        _userRepositoryMock.Setup(r => r.GetLeaderboardAsync(5))
            .ReturnsAsync(new List<User>());

        // Act
        await _profileService.GetLeaderboardAsync(5);

        // Assert
        _userRepositoryMock.Verify(r => r.GetLeaderboardAsync(5), Times.Once);
    }

    #endregion

    #region Helper Methods

    private static User CreateSampleUser(int id = 1, string username = "testuser", int xp = 100)
    {
        var user = new User
        {
            Id = id,
            Username = username,
            Email = $"{username}@example.com",
            Name = "Test User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            UserType = "individual",
            ExperiencePoints = xp,
            CreatedAt = DateTime.UtcNow
        };
        user.UserRoles.Add(new UserRole { Role = "learner" });
        return user;
    }

    #endregion
}
