namespace Domain.Entities;

public class Sale
{
    public int Id { get; set; }
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
    public decimal Total { get; set; } = 0;
    public ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
}