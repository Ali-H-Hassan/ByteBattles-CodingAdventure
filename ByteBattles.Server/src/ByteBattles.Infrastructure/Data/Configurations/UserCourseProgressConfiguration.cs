using ByteBattles.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ByteBattles.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the UserCourseProgress entity.
/// </summary>
public class UserCourseProgressConfiguration : IEntityTypeConfiguration<UserCourseProgress>
{
    public void Configure(EntityTypeBuilder<UserCourseProgress> builder)
    {
        builder.ToTable("UserCourseProgress");

        builder.HasKey(ucp => ucp.Id);

        builder.Property(ucp => ucp.Id)
            .UseIdentityColumn();

        builder.Property(ucp => ucp.Progress)
            .HasPrecision(5, 2)
            .HasDefaultValue(0);

        // Unique constraint for user-course combination
        builder.HasIndex(ucp => new { ucp.UserId, ucp.CourseId })
            .IsUnique();
    }
}

