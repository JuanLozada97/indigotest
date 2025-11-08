using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class SaleConfiguration : IEntityTypeConfiguration<Sale>
{
    public void Configure(EntityTypeBuilder<Sale> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.SaleDate).IsRequired(); 
        builder.Property(s => s.Total).IsRequired().HasPrecision(18, 2);
        builder.HasMany(s => s.SaleItems)
            .WithOne(si => si.Sale)
            .HasForeignKey(si => si.SaleId);
    }
}