using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Auth;
using ByteBattles.Core.DTOs.Profile;
using ByteBattles.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ByteBattles.API.Controllers;

/// <summary>
/// Controller for profile operations.
/// Handles user profile management and leaderboard.
/// </summary>
[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(IProfileService profileService, IUserRepository userRepository, ILogger<ProfileController> logger)
    {
        _profileService = profileService;
        _userRepository = userRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get current user's profile.
    /// </summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var profile = await _profileService.GetProfileAsync(userId);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching profile");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get profile by user ID.
    /// </summary>
    [HttpGet("{userId}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfileById(int userId)
    {
        try
        {
            var profile = await _profileService.GetProfileAsync(userId);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching profile {UserId}", userId);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update current user's profile.
    /// </summary>
    [HttpPut]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var profile = await _profileService.UpdateProfileAsync(userId, dto);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update current user's profile with file upload support.
    /// </summary>
    [HttpPost("update")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProfileWithFile([FromForm] UpdateProfileDto? dto, [FromForm(Name = "profilePicture")] IFormFile? profilePicture)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            // Initialize DTO
            dto ??= new UpdateProfileDto();

            // Manually read ALL form data to ensure proper binding
            // ASP.NET Core model binding for FormData can be unreliable, so we read directly
            if (Request.HasFormContentType && Request.Form != null)
            {
                var form = Request.Form;
                
                // Helper function to safely get form value (handles empty strings)
                // IFormCollection is case-insensitive by default
                string? GetFormValue(string key)
                {
                    if (form.ContainsKey(key))
                    {
                        var value = form[key].ToString();
                        // Return the value even if it's empty (to allow clearing fields)
                        return value;
                    }
                    return null;
                }
                
                // Read form fields directly (case-insensitive)
                // Set DTO properties if the key exists in form data (even if value is empty string)
                var nameValue = GetFormValue("name");
                if (nameValue != null) dto.Name = nameValue;
                
                var usernameValue = GetFormValue("username");
                if (usernameValue != null) dto.Username = usernameValue;
                
                var emailValue = GetFormValue("email");
                if (emailValue != null) dto.Email = emailValue;
                
                var addressValue = GetFormValue("address");
                if (addressValue != null) dto.Address = addressValue;
                
                var countryValue = GetFormValue("country");
                if (countryValue != null) dto.Country = countryValue;
                
                var cityValue = GetFormValue("city");
                if (cityValue != null) dto.City = cityValue;
                
                var contactNumberValue = GetFormValue("contactNumber");
                if (contactNumberValue != null) dto.ContactNumber = contactNumberValue;
                
                var passwordValue = GetFormValue("password");
                if (passwordValue != null) dto.Password = passwordValue;
                
                // Get profile picture from form if not already set
                // Try multiple ways to get the file
                if (profilePicture == null && form.Files != null && form.Files.Count > 0)
                {
                    // First try to get by exact name
                    var file = form.Files.GetFile("profilePicture");
                    if (file == null || file.Length == 0)
                    {
                        // Try case-insensitive search
                        foreach (var formFile in form.Files)
                        {
                            if (string.Equals(formFile.Name, "profilePicture", StringComparison.OrdinalIgnoreCase))
                            {
                                file = formFile;
                                break;
                            }
                        }
                    }
                    
                    // If still not found, try to get the first file (fallback)
                    if ((file == null || file.Length == 0) && form.Files.Count > 0)
                    {
                        file = form.Files[0];
                    }
                    
                    if (file != null && file.Length > 0)
                    {
                        profilePicture = file;
                        _logger.LogInformation("Profile picture file found: {FileName}, Size: {FileSize} bytes", file.FileName, file.Length);
                    }
                }
            }

            // Debug: Log received DTO and file info
            _logger.LogInformation("Received UpdateProfileDto - Name: {Name}, Username: {Username}, Email: {Email}, Address: {Address}, Country: {Country}, City: {City}, ContactNumber: {ContactNumber}",
                dto.Name ?? "null", dto.Username ?? "null", dto.Email ?? "null", dto.Address ?? "null", dto.Country ?? "null", dto.City ?? "null", dto.ContactNumber ?? "null");
            
            if (profilePicture != null)
            {
                _logger.LogInformation("Profile picture file received: {FileName}, Size: {FileSize} bytes, ContentType: {ContentType}",
                    profilePicture.FileName, profilePicture.Length, profilePicture.ContentType);
            }
            else
            {
                _logger.LogInformation("No profile picture file received");
            }

            // Handle file upload if provided
            if (profilePicture != null && profilePicture.Length > 0)
            {
                try
                {
                    // Validate file type
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                    var fileExtension = Path.GetExtension(profilePicture.FileName)?.ToLowerInvariant();
                    
                    if (string.IsNullOrEmpty(fileExtension) || !allowedExtensions.Contains(fileExtension))
                    {
                        _logger.LogWarning("Invalid file type for profile picture: {FileName}", profilePicture.FileName);
                        return BadRequest(new { message = "Invalid file type. Only image files (jpg, jpeg, png, gif, webp) are allowed." });
                    }

                    // Validate file size (5MB limit)
                    const long maxFileSize = 5 * 1024 * 1024; // 5MB
                    if (profilePicture.Length > maxFileSize)
                    {
                        _logger.LogWarning("File too large for profile picture: {FileName}, Size: {FileSize} bytes", profilePicture.FileName, profilePicture.Length);
                        return BadRequest(new { message = "File size exceeds the maximum limit of 5MB." });
                    }

                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                        _logger.LogInformation("Created uploads directory: {UploadsFolder}", uploadsFolder);
                    }

                    var fileName = $"{userId}_{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(uploadsFolder, fileName);
                    
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await profilePicture.CopyToAsync(stream);
                    }

                    dto.ProfilePictureUrl = $"/uploads/{fileName}";
                    _logger.LogInformation("Profile picture saved successfully: {FilePath}, URL: {ProfilePictureUrl}", filePath, dto.ProfilePictureUrl);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error saving profile picture file");
                    return StatusCode(500, new { message = "Error saving profile picture. Please try again." });
                }
            }

            // Update profile using service (this handles all fields including username/email/password)
            var profile = await _profileService.UpdateProfileAsync(userId, dto);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            _logger.LogInformation("Profile updated successfully for user {UserId}", userId);
            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get leaderboard (top users by score).
    /// </summary>
    [HttpGet("leaderboard")]
    [ProducesResponseType(typeof(IEnumerable<UserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLeaderboard([FromQuery] int take = 10)
    {
        try
        {
            var leaderboard = await _profileService.GetLeaderboardAsync(take);
            return Ok(leaderboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching leaderboard");
            return StatusCode(500, new { message = ex.Message });
        }
    }
}

