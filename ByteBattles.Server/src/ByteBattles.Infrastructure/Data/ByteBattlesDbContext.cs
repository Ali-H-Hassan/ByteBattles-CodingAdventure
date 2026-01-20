using ByteBattles.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ByteBattles.Infrastructure.Data;

/// <summary>
/// Entity Framework Core database context for ByteBattles.
/// </summary>
public class ByteBattlesDbContext : DbContext
{
    public ByteBattlesDbContext(DbContextOptions<ByteBattlesDbContext> options)
        : base(options)
    {
    }

    // User-related entities
    public DbSet<User> Users => Set<User>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<UserCourseProgress> UserCourseProgress => Set<UserCourseProgress>();
    public DbSet<UserCompletedChallenge> UserCompletedChallenges => Set<UserCompletedChallenge>();

    // Course-related entities
    public DbSet<Course> Courses => Set<Course>();

    // Challenge-related entities
    public DbSet<Challenge> Challenges => Set<Challenge>();
    public DbSet<ChallengeTemplateCode> ChallengeTemplateCodes => Set<ChallengeTemplateCode>();
    public DbSet<ChallengeTestCase> ChallengeTestCases => Set<ChallengeTestCase>();

    // Test-related entities
    public DbSet<Test> Tests => Set<Test>();
    public DbSet<McqQuestion> McqQuestions => Set<McqQuestion>();
    public DbSet<McqOption> McqOptions => Set<McqOption>();
    public DbSet<ProgrammingQuestion> ProgrammingQuestions => Set<ProgrammingQuestion>();
    public DbSet<ProgrammingTestCase> ProgrammingTestCases => Set<ProgrammingTestCase>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all configurations from the assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ByteBattlesDbContext).Assembly);
    }
}

