using ByteBattles.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ByteBattles.Infrastructure.Data.Configurations;

public class BattleResultConfiguration : IEntityTypeConfiguration<BattleResult>
{
    public void Configure(EntityTypeBuilder<BattleResult> builder)
    {
        builder.ToTable("BattleResults");

        builder.HasKey(br => br.Id);

        builder.Property(br => br.Id)
            .UseIdentityColumn();

        builder.Property(br => br.ChallengeTitle)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(br => br.ChallengeDescription)
            .IsRequired();

        builder.Property(br => br.UserCode)
            .IsRequired();

        builder.Property(br => br.AiSolutionCode)
            .IsRequired();

        builder.Property(br => br.Winner)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(br => br.CompletedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Relationships
        builder.HasOne(br => br.User)
            .WithMany()
            .HasForeignKey(br => br.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

