using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Auth;
using ByteBattles.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ByteBattles.API.Controllers;

/// <summary>
/// Controller for user management operations.
/// </summary>
[ApiController]
[Route("users")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IAuthService _authService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        IUserRepository userRepository, 
        IAuthService authService,
        ILogger<UsersController> logger)
    {
        _userRepository = userRepository;
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user (alias for /api/auth/register).
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            var result = await _authService.RegisterAsync(dto);
            
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }

            return CreatedAtAction(nameof(GetUserById), new { id = result.User!.Id }, 
                new { user = result.User, token = result.Token });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, "Error during registration: " + ex.Message);
        }
    }

    /// <summary>
    /// Login (alias for /api/auth/login).
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto);
            
            if (!result.IsSuccess)
            {
                return BadRequest(result.Error);
            }

            return Ok(new { user = result.User });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, "Error during login: " + ex.Message);
        }
    }

    /// <summary>
    /// Get all users (Admin only).
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _userRepository.GetAllAsync();
            return Ok(users.Select(MapToUserDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching all users");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get user by ID.
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(int id)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Cannot find user" });
            }

            return Ok(MapToUserDto(user));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user {Id}", id);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update user (Admin only).
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (!string.IsNullOrEmpty(dto.Username)) user.Username = dto.Username;
            if (!string.IsNullOrEmpty(dto.Email)) user.Email = dto.Email;
            if (!string.IsNullOrEmpty(dto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            await _userRepository.UpdateAsync(user);
            return Ok(MapToUserDto(user));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {Id}", id);
            return StatusCode(400, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete user (Admin only).
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            if (!await _userRepository.ExistsAsync(id))
            {
                return NotFound(new { message = "User not found" });
            }

            await _userRepository.DeleteAsync(id);
            return Ok(new { message = "Deleted User" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {Id}", id);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Create a company user (Admin only).
    /// </summary>
    [HttpPost("admin/create-company")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateCompanyUser([FromBody] RegisterDto dto)
    {
        try
        {
            // Force company type
            dto.UserType = "company";
            var result = await _authService.RegisterAsync(dto);
            
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Error });
            }

            return CreatedAtAction(nameof(GetUserById), new { id = result.User!.Id },
                new { companyUser = result.User, token = result.Token });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating company user");
            return StatusCode(500, new { message = "Error creating company user", error = ex.Message });
        }
    }

    private static UserDto MapToUserDto(ByteBattles.Core.Entities.User user)
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

/// <summary>
/// DTO for updating user.
/// </summary>
public class UpdateUserDto
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
}

