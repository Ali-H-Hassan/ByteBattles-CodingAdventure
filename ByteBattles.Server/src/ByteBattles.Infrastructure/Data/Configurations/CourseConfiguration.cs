using ByteBattles.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ByteBattles.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the Course entity.
/// </summary>
public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.ToTable("Courses");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .UseIdentityColumn();

        builder.Property(c => c.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Description)
            .IsRequired();

        builder.Property(c => c.Difficulty)
            .IsRequired()
            .HasMaxLength(20);

        // Check constraint for valid difficulty levels
        builder.ToTable(t => t.HasCheckConstraint(
            "CK_Courses_Difficulty",
            "[Difficulty] IN ('Beginner', 'Intermediate', 'Advanced')"));

        builder.Property(c => c.ImageUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(c => c.IsActive)
            .HasDefaultValue(true);

        builder.Property(c => c.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(c => c.UpdatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Relationships
        builder.HasMany(c => c.UserProgress)
            .WithOne(up => up.Course)
            .HasForeignKey(up => up.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

