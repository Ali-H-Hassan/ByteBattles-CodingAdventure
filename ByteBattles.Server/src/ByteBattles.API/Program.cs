using System.Text;
using ByteBattles.Application;
using ByteBattles.Infrastructure;
using ByteBattles.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ===========================================
// Configure Services
// ===========================================

// Add controllers with camelCase JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ByteBattles API",
        Version = "v1",
        Description = "API for ByteBattles - Coding Adventure Platform",
        Contact = new OpenApiContact
        {
            Name = "ByteBattles Team",
            Email = "support@bytebattles.com"
        }
    });
    
    // Add JWT authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] 
    ?? throw new InvalidOperationException("JWT Secret is not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ClockSkew = TimeSpan.Zero
    };
});

// Configure Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
    options.AddPolicy("CompanyOnly", policy => policy.RequireRole("company"));
    options.AddPolicy("LearnerOnly", policy => policy.RequireRole("learner"));
});

// Configure CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ===========================================
// Register Infrastructure Services (DbContext, Repositories)
// ===========================================
builder.Services.AddInfrastructure(builder.Configuration);

// ===========================================
// Register Application Services (Auth, Test, Game, Profile)
// ===========================================
builder.Services.AddApplication();

var app = builder.Build();

// ===========================================
// Configure HTTP Request Pipeline
// ===========================================

// Global exception handler for better error messages
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        
        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;
        
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(exception, "Unhandled exception: {Message}", exception?.Message);
        
        var response = new { message = $"An error occurred: {exception?.Message}" };
        await context.Response.WriteAsJsonAsync(response);
    });
});

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ByteBattles API v1");
        options.RoutePrefix = string.Empty; // Set Swagger UI at the root
    });
}

  // Enable HTTPS redirection in production
  if (!app.Environment.IsDevelopment())
  {
      app.UseHttpsRedirection();
  }

  // Enable static files for uploads
  app.UseStaticFiles();

  // Enable CORS
  app.UseCors("AllowReactApp");

// Enable Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Welcome endpoint
app.MapGet("/api", () => new 
{ 
    message = "Welcome to ByteBattles API",
    version = "1.0.0",
    documentation = "/swagger"
});

// Ensure database is created before seeding
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ByteBattlesDbContext>();
    try
    {
        // Ensure database is created (this creates all tables based on the model)
        await context.Database.EnsureCreatedAsync();
        app.Logger.LogInformation("Database ensured/created");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Error ensuring database is created");
    }
}

// Seed database in development (only if no users exist)
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ByteBattlesDbContext>();
        try
        {
            // Only seed if database is empty
            if (!context.Users.Any())
            {
                await DataSeeder.SeedAsync(context);
                app.Logger.LogInformation("Database seeded successfully");
            }
            else
            {
                app.Logger.LogInformation("Database already contains data. Use POST /api/admin/seed-database to reseed.");
            }
        }
        catch (Exception ex)
        {
            app.Logger.LogError(ex, "An error occurred while seeding the database");
        }
    }
}

app.Run();

// Make Program class accessible for integration tests
public partial class Program { }
