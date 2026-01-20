using ByteBattles.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ByteBattles.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the UserRole entity.
/// </summary>
public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("UserRoles");

        // Composite primary key
        builder.HasKey(ur => new { ur.UserId, ur.Role });

        builder.Property(ur => ur.Role)
            .IsRequired()
            .HasMaxLength(20);

        // Check constraint for valid roles
        builder.ToTable(t => t.HasCheckConstraint(
            "CK_UserRoles_Role",
            "[Role] IN ('learner', 'admin', 'company')"));
    }
}

