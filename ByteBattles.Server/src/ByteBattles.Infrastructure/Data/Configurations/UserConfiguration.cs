using ByteBattles.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ByteBattles.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the User entity.
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .UseIdentityColumn();

        builder.Property(u => u.GoogleId)
            .HasMaxLength(255);

        builder.HasIndex(u => u.GoogleId)
            .IsUnique()
            .HasFilter("[GoogleId] IS NOT NULL");

        builder.Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(u => u.Username)
            .IsUnique();

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.PasswordHash)
            .HasMaxLength(255);

        builder.Property(u => u.Name)
            .HasMaxLength(200);

        builder.Property(u => u.ContactNumber)
            .HasMaxLength(50);

        builder.Property(u => u.Address)
            .HasMaxLength(500);

        builder.Property(u => u.Country)
            .HasMaxLength(100);

        builder.Property(u => u.City)
            .HasMaxLength(100);

        builder.Property(u => u.ProfilePictureUrl)
            .HasMaxLength(500);

        builder.Property(u => u.UserType)
            .IsRequired()
            .HasMaxLength(20)
            .HasDefaultValue("individual");

        builder.Property(u => u.CompanyName)
            .HasMaxLength(200);

        builder.Property(u => u.CompanyAddress)
            .HasMaxLength(500);

        builder.Property(u => u.CompanyContactNumber)
            .HasMaxLength(50);

        builder.Property(u => u.ExperiencePoints)
            .HasDefaultValue(0);

        builder.Property(u => u.HighScore)
            .HasDefaultValue(0);

        builder.Property(u => u.Rank)
            .HasDefaultValue(1);

        builder.Property(u => u.LearningPath)
            .HasMaxLength(20);

        builder.Property(u => u.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Relationships
        builder.HasMany(u => u.UserRoles)
            .WithOne(ur => ur.User)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.CourseProgress)
            .WithOne(cp => cp.User)
            .HasForeignKey(cp => cp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.CompletedChallenges)
            .WithOne(cc => cc.User)
            .HasForeignKey(cc => cc.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.CreatedTests)
            .WithOne(t => t.CreatedBy)
            .HasForeignKey(t => t.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

