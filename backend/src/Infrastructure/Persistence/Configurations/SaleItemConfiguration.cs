using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class SaleItemConfiguration : IEntityTypeConfiguration<SaleItem>
{
    public void Configure(EntityTypeBuilder<SaleItem> builder)
    {
        builder.HasKey(si => si.Id);
        builder.Property(si => si.Quantity).IsRequired().HasDefaultValue(1);
        builder.Property(si => si.UnitPrice).IsRequired().HasPrecision(18, 2);
        builder.Property(si => si.TotalPrice).IsRequired().HasPrecision(18, 2); 
        builder.HasOne(si => si.Sale)
            .WithMany(s => s.SaleItems)
            .HasForeignKey(si => si.SaleId);    
        builder.HasOne(si => si.Product)
            .WithMany(p => p.SaleItems)
            .HasForeignKey(si => si.ProductId);
    }
}