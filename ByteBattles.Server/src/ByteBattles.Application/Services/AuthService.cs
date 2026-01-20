using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ByteBattles.Application.Interfaces;
using ByteBattles.Core.DTOs.Auth;
using ByteBattles.Core.Entities;
using ByteBattles.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ByteBattles.Application.Services;

/// <summary>
/// Authentication service implementation.
/// Handles user registration, login, and JWT token generation.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly string _jwtSecret;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;
    private readonly int _jwtExpirationHours;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        
        _jwtSecret = _configuration["Jwt:Secret"] 
            ?? throw new InvalidOperationException("JWT Secret not configured");
        _jwtIssuer = _configuration["Jwt:Issuer"] ?? "ByteBattles";
        _jwtAudience = _configuration["Jwt:Audience"] ?? "ByteBattlesUsers";
        _jwtExpirationHours = int.Parse(_configuration["Jwt:ExpirationInHours"] ?? "24");
    }

    public async Task<AuthResult> RegisterAsync(RegisterDto dto)
    {
        // Check if email already exists
        var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            return AuthResult.Fail("User already registered with this email.");
        }

        // Check if username already exists
        var existingUsername = await _userRepository.GetByUsernameAsync(dto.Username);
        if (existingUsername != null)
        {
            return AuthResult.Fail("Username is already taken.");
        }

        // Create new user
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            UserType = dto.UserType,
            CompanyName = dto.CompanyName,
            CompanyAddress = dto.CompanyAddress,
            CompanyContactNumber = dto.CompanyContactNumber,
            CreatedAt = DateTime.UtcNow
        };

        // Add default role based on user type
        var defaultRole = dto.UserType == "company" ? "company" : "learner";
        user.UserRoles.Add(new UserRole { Role = defaultRole });

        // Save user
        await _userRepository.CreateAsync(user);

        // Generate token
        var roles = user.UserRoles.Select(ur => ur.Role);
        var token = GenerateToken(user.Id, user.Email, user.UserType, roles);

        // Map to DTO
        var userDto = MapToUserDto(user);

        return AuthResult.Success(userDto, token);
    }

    public async Task<AuthResult> LoginAsync(LoginDto dto)
    {
        // Find user by email
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null)
        {
            return AuthResult.Fail("Invalid email or password.");
        }

        // Verify password
        if (string.IsNullOrEmpty(user.PasswordHash) || 
            !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return AuthResult.Fail("Invalid email or password.");
        }

        // Update last login
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        // Generate token
        var roles = user.UserRoles.Select(ur => ur.Role);
        var token = GenerateToken(user.Id, user.Email, user.UserType, roles);

        // Map to DTO
        var userDto = MapToUserDto(user);

        return AuthResult.Success(userDto, token);
    }

    public async Task<AuthResult> GoogleAuthAsync(string googleId, string email, string name)
    {
        // Check if user exists by Google ID
        var user = await _userRepository.GetByGoogleIdAsync(googleId);
        
        if (user == null)
        {
            // Check if email is already registered (non-Google account)
            var existingUser = await _userRepository.GetByEmailAsync(email);
            if (existingUser != null)
            {
                // Link Google account to existing user
                existingUser.GoogleId = googleId;
                await _userRepository.UpdateAsync(existingUser);
                user = existingUser;
            }
            else
            {
                // Create new user
                user = new User
                {
                    GoogleId = googleId,
                    Email = email,
                    Username = GenerateUniqueUsername(email),
                    Name = name,
                    UserType = "individual",
                    CreatedAt = DateTime.UtcNow
                };
                
                user.UserRoles.Add(new UserRole { Role = "learner" });
                await _userRepository.CreateAsync(user);
            }
        }

        // Update last login
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        // Generate token
        var roles = user.UserRoles.Select(ur => ur.Role);
        var token = GenerateToken(user.Id, user.Email, user.UserType, roles);

        // Map to DTO
        var userDto = MapToUserDto(user);

        return AuthResult.Success(userDto, token);
    }

    public string GenerateToken(int userId, string email, string userType, IEnumerable<string> roles)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Email, email),
            new("userType", userType),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Add role claims
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var token = new JwtSecurityToken(
            issuer: _jwtIssuer,
            audience: _jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_jwtExpirationHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public int? ValidateToken(string token)
    {
        if (string.IsNullOrEmpty(token))
            return null;

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSecret);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _jwtIssuer,
                ValidAudience = _jwtAudience,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userId = int.Parse(jwtToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);

            return userId;
        }
        catch
        {
            return null;
        }
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

    private string GenerateUniqueUsername(string email)
    {
        // Extract username from email and add random suffix
        var baseUsername = email.Split('@')[0];
        var random = new Random();
        return $"{baseUsername}{random.Next(1000, 9999)}";
    }
}

