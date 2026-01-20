using ByteBattles.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ByteBattles.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the Challenge entity.
/// </summary>
public class ChallengeConfiguration : IEntityTypeConfiguration<Challenge>
{
    public void Configure(EntityTypeBuilder<Challenge> builder)
    {
        builder.ToTable("Challenges");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .UseIdentityColumn();

        builder.Property(c => c.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Description)
            .IsRequired();

        builder.Property(c => c.Difficulty)
            .HasMaxLength(20);

        builder.Property(c => c.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Relationships
        builder.HasMany(c => c.TemplateCodes)
            .WithOne(tc => tc.Challenge)
            .HasForeignKey(tc => tc.ChallengeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.TestCases)
            .WithOne(tc => tc.Challenge)
            .HasForeignKey(tc => tc.ChallengeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(c => c.CompletedByUsers)
            .WithOne(uc => uc.Challenge)
            .HasForeignKey(uc => uc.ChallengeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

/// <summary>
/// Entity Framework configuration for the ChallengeTemplateCode entity.
/// </summary>
public class ChallengeTemplateCodeConfiguration : IEntityTypeConfiguration<ChallengeTemplateCode>
{
    public void Configure(EntityTypeBuilder<ChallengeTemplateCode> builder)
    {
        builder.ToTable("ChallengeTemplateCodes");

        builder.HasKey(ctc => ctc.Id);

        builder.Property(ctc => ctc.Id)
            .UseIdentityColumn();

        builder.Property(ctc => ctc.Language)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(ctc => ctc.Code)
            .IsRequired();

        // Unique constraint for challenge-language combination
        builder.HasIndex(ctc => new { ctc.ChallengeId, ctc.Language })
            .IsUnique();
    }
}

/// <summary>
/// Entity Framework configuration for the ChallengeTestCase entity.
/// </summary>
public class ChallengeTestCaseConfiguration : IEntityTypeConfiguration<ChallengeTestCase>
{
    public void Configure(EntityTypeBuilder<ChallengeTestCase> builder)
    {
        builder.ToTable("ChallengeTestCases");

        builder.HasKey(ctc => ctc.Id);

        builder.Property(ctc => ctc.Id)
            .UseIdentityColumn();

        builder.Property(ctc => ctc.Input)
            .IsRequired();

        builder.Property(ctc => ctc.ExpectedOutput)
            .IsRequired();
    }
}

/// <summary>
/// Entity Framework configuration for the UserCompletedChallenge entity.
/// </summary>
public class UserCompletedChallengeConfiguration : IEntityTypeConfiguration<UserCompletedChallenge>
{
    public void Configure(EntityTypeBuilder<UserCompletedChallenge> builder)
    {
        builder.ToTable("UserCompletedChallenges");

        // Composite primary key
        builder.HasKey(ucc => new { ucc.UserId, ucc.ChallengeId });

        builder.Property(ucc => ucc.CompletedAt)
            .HasDefaultValueSql("GETUTCDATE()");
    }
}

