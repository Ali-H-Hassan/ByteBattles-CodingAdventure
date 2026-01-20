using ByteBattles.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ByteBattles.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the Test entity.
/// </summary>
public class TestConfiguration : IEntityTypeConfiguration<Test>
{
    public void Configure(EntityTypeBuilder<Test> builder)
    {
        builder.ToTable("Tests");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .UseIdentityColumn();

        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Relationships
        builder.HasMany(t => t.McqQuestions)
            .WithOne(mq => mq.Test)
            .HasForeignKey(mq => mq.TestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.ProgrammingQuestion)
            .WithOne(pq => pq.Test)
            .HasForeignKey<ProgrammingQuestion>(pq => pq.TestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

/// <summary>
/// Entity Framework configuration for the McqQuestion entity.
/// </summary>
public class McqQuestionConfiguration : IEntityTypeConfiguration<McqQuestion>
{
    public void Configure(EntityTypeBuilder<McqQuestion> builder)
    {
        builder.ToTable("McqQuestions");

        builder.HasKey(mq => mq.Id);

        builder.Property(mq => mq.Id)
            .UseIdentityColumn();

        builder.Property(mq => mq.QuestionText)
            .IsRequired();

        // Relationships
        builder.HasMany(mq => mq.Options)
            .WithOne(mo => mo.McqQuestion)
            .HasForeignKey(mo => mo.McqQuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

/// <summary>
/// Entity Framework configuration for the McqOption entity.
/// </summary>
public class McqOptionConfiguration : IEntityTypeConfiguration<McqOption>
{
    public void Configure(EntityTypeBuilder<McqOption> builder)
    {
        builder.ToTable("McqOptions");

        builder.HasKey(mo => mo.Id);

        builder.Property(mo => mo.Id)
            .UseIdentityColumn();

        builder.Property(mo => mo.Text)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(mo => mo.IsCorrect)
            .HasDefaultValue(false);
    }
}

/// <summary>
/// Entity Framework configuration for the ProgrammingQuestion entity.
/// </summary>
public class ProgrammingQuestionConfiguration : IEntityTypeConfiguration<ProgrammingQuestion>
{
    public void Configure(EntityTypeBuilder<ProgrammingQuestion> builder)
    {
        builder.ToTable("ProgrammingQuestions");

        builder.HasKey(pq => pq.Id);

        builder.Property(pq => pq.Id)
            .UseIdentityColumn();

        builder.Property(pq => pq.QuestionText)
            .IsRequired();

        // Relationships
        builder.HasMany(pq => pq.TestCases)
            .WithOne(tc => tc.ProgrammingQuestion)
            .HasForeignKey(tc => tc.ProgrammingQuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

/// <summary>
/// Entity Framework configuration for the ProgrammingTestCase entity.
/// </summary>
public class ProgrammingTestCaseConfiguration : IEntityTypeConfiguration<ProgrammingTestCase>
{
    public void Configure(EntityTypeBuilder<ProgrammingTestCase> builder)
    {
        builder.ToTable("ProgrammingTestCases");

        builder.HasKey(ptc => ptc.Id);

        builder.Property(ptc => ptc.Id)
            .UseIdentityColumn();

        builder.Property(ptc => ptc.Input)
            .IsRequired();

        builder.Property(ptc => ptc.ExpectedOutput)
            .IsRequired();
    }
}

