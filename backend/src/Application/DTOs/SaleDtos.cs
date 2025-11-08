namespace Application.Contracts;

public record SaleItemResponse(int Id, int ProductId, string ProductName, int Quantity, decimal UnitPrice, decimal TotalPrice);
public record SaleResponse(int Id, DateTime SaleDate, decimal Total, IEnumerable<SaleItemResponse> SaleItems);

public record SaleItemRequest(int ProductId, int Quantity);

public record CreateSaleRequest(DateTime SaleDate, IEnumerable<SaleItemRequest> SaleItems);

public record SalesReportResponse(
    DateTime StartDate,
    DateTime EndDate,
    int TotalSales,
    decimal TotalRevenue,
    IEnumerable<SaleResponse> Sales
);

