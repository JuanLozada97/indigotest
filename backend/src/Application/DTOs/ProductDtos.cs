namespace Application.Contracts;

public record ProductResponse(int Id, string Name, string Description, string? ImageUrl, int Stock, decimal Price);
public record CreateProductRequest(string Name, string Description, string? ImageUrl, int Stock, decimal Price);
public record UpdateProductRequest(string Name, string Description, string? ImageUrl, int Stock, decimal Price);