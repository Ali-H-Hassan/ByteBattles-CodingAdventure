using ByteBattles.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ByteBattles.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the TestResult entity.
/// </summary>
public class TestResultConfiguration : IEntityTypeConfiguration<TestResult>
{
    public void Configure(EntityTypeBuilder<TestResult> builder)
    {
        builder.ToTable("TestResults");

        builder.HasKey(tr => tr.Id);

        builder.Property(tr => tr.Id)
            .UseIdentityColumn();

        builder.Property(tr => tr.Score)
            .HasPrecision(5, 2);

        builder.Property(tr => tr.McqAnswers)
            .HasMaxLength(2000);

        builder.Property(tr => tr.ProgrammingAnswer)
            .HasMaxLength(10000);

        builder.Property(tr => tr.CompletedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Relationships
        builder.HasOne(tr => tr.Test)
            .WithMany()
            .HasForeignKey(tr => tr.TestId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(tr => tr.User)
            .WithMany()
            .HasForeignKey(tr => tr.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Unique constraint: a user can only take a test once
        builder.HasIndex(tr => new { tr.TestId, tr.UserId })
            .IsUnique();
    }
}

