using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        builder.HasIndex(u => u.Username).IsUnique();
        builder.Property(u => u.Username).IsRequired().HasMaxLength(100);
        builder.Property(u => u.Role).IsRequired().HasMaxLength(50);
    }
}