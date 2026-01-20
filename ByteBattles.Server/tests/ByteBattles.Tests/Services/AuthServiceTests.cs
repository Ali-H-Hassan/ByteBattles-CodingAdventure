using ByteBattles.Application.Services;
using ByteBattles.Core.DTOs.Auth;
using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Moq;

namespace ByteBattles.Tests.Services;

/// <summary>
/// Unit tests for the AuthService.
/// </summary>
public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _configurationMock = new Mock<IConfiguration>();

        // Setup configuration
        _configurationMock.Setup(c => c["Jwt:Secret"]).Returns("super-secret-key-for-testing-at-least-32-characters-long");
        _configurationMock.Setup(c => c["Jwt:Issuer"]).Returns("ByteBattles");
        _configurationMock.Setup(c => c["Jwt:Audience"]).Returns("ByteBattlesUsers");
        _configurationMock.Setup(c => c["Jwt:ExpirationInHours"]).Returns("24");

        _authService = new AuthService(_userRepositoryMock.Object, _configurationMock.Object);
    }

    [Fact]
    public async Task RegisterAsync_WithNewUser_ReturnsSuccess()
    {
        // Arrange
        var dto = new RegisterDto
        {
            Username = "testuser",
            Email = "test@example.com",
            Password = "password123"
        };

        _userRepositoryMock.Setup(r => r.GetByEmailAsync(dto.Email))
            .ReturnsAsync((User?)null);
        _userRepositoryMock.Setup(r => r.GetByUsernameAsync(dto.Username))
            .ReturnsAsync((User?)null);
        _userRepositoryMock.Setup(r => r.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync((User u) => { u.Id = 1; return u; });

        // Act
        var result = await _authService.RegisterAsync(dto);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.User);
        Assert.NotNull(result.Token);
        Assert.Equal("testuser", result.User.Username);
        Assert.Equal("test@example.com", result.User.Email);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ReturnsFail()
    {
        // Arrange
        var dto = new RegisterDto
        {
            Username = "testuser",
            Email = "existing@example.com",
            Password = "password123"
        };

        _userRepositoryMock.Setup(r => r.GetByEmailAsync(dto.Email))
            .ReturnsAsync(new User { Id = 1, Email = dto.Email, Username = "existinguser" });

        // Act
        var result = await _authService.RegisterAsync(dto);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("already registered", result.Error);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingUsername_ReturnsFail()
    {
        // Arrange
        var dto = new RegisterDto
        {
            Username = "existinguser",
            Email = "test@example.com",
            Password = "password123"
        };

        _userRepositoryMock.Setup(r => r.GetByEmailAsync(dto.Email))
            .ReturnsAsync((User?)null);
        _userRepositoryMock.Setup(r => r.GetByUsernameAsync(dto.Username))
            .ReturnsAsync(new User { Id = 1, Email = "other@example.com", Username = dto.Username });

        // Act
        var result = await _authService.RegisterAsync(dto);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("already taken", result.Error);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsSuccess()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "test@example.com",
            Password = "password123"
        };

        var user = new User
        {
            Id = 1,
            Email = dto.Email,
            Username = "testuser",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            UserType = "individual"
        };
        user.UserRoles.Add(new UserRole { Role = "learner" });

        _userRepositoryMock.Setup(r => r.GetByEmailAsync(dto.Email))
            .ReturnsAsync(user);
        _userRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _authService.LoginAsync(dto);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.User);
        Assert.NotNull(result.Token);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidEmail_ReturnsFail()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "nonexistent@example.com",
            Password = "password123"
        };

        _userRepositoryMock.Setup(r => r.GetByEmailAsync(dto.Email))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _authService.LoginAsync(dto);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("Invalid email or password", result.Error);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ReturnsFail()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "test@example.com",
            Password = "wrongpassword"
        };

        var user = new User
        {
            Id = 1,
            Email = dto.Email,
            Username = "testuser",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("correctpassword"),
            UserType = "individual"
        };

        _userRepositoryMock.Setup(r => r.GetByEmailAsync(dto.Email))
            .ReturnsAsync(user);

        // Act
        var result = await _authService.LoginAsync(dto);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("Invalid email or password", result.Error);
    }

    [Fact]
    public void GenerateToken_ReturnsValidJwtToken()
    {
        // Arrange
        var userId = 1;
        var email = "test@example.com";
        var userType = "individual";
        var roles = new[] { "learner" };

        // Act
        var token = _authService.GenerateToken(userId, email, userType, roles);

        // Assert
        Assert.NotNull(token);
        Assert.NotEmpty(token);
        Assert.Contains(".", token); // JWT tokens contain dots
    }

    [Fact]
    public void ValidateToken_WithValidToken_ReturnsUserId()
    {
        // Arrange
        var userId = 123;
        var token = _authService.GenerateToken(userId, "test@example.com", "individual", new[] { "learner" });

        // Act
        var result = _authService.ValidateToken(token);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result);
    }

    [Fact]
    public void ValidateToken_WithInvalidToken_ReturnsNull()
    {
        // Arrange
        var invalidToken = "invalid.token.here";

        // Act
        var result = _authService.ValidateToken(invalidToken);

        // Assert
        Assert.Null(result);
    }
}

