using Application.Contracts;
using Domain.Entities;
using AutoMapper;

namespace Application.Services;

public class SaleService
{
    private readonly ISaleRepository _saleRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public SaleService(ISaleRepository saleRepository, IProductRepository productRepository, IMapper mapper)
    {
        _saleRepository = saleRepository;
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<SaleResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var sale = await _saleRepository.GetByIdAsync(id, cancellationToken);
        return _mapper.Map<SaleResponse>(sale);
    }

    public async Task<IEnumerable<SaleResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var sales = await _saleRepository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<SaleResponse>>(sales);
    }

    public async Task<SaleResponse> CreateAsync(CreateSaleRequest request, CancellationToken cancellationToken = default)
    {
        var sale = new Sale
        {
            SaleDate = request.SaleDate,
            SaleItems = new List<SaleItem>()
        };

        decimal total = 0;

        foreach (var itemRequest in request.SaleItems)
        {
            var product = await _productRepository.GetByIdAsync(itemRequest.ProductId, cancellationToken);

            if (product.Stock < itemRequest.Quantity)
            {
                throw new InvalidOperationException($"Stock insuficiente para el producto {product.Name}. Stock disponible: {product.Stock}, solicitado: {itemRequest.Quantity}");
            }

            var unitPrice = product.Price;
            var totalPrice = unitPrice * itemRequest.Quantity;

            sale.SaleItems.Add(new SaleItem
            {
                ProductId = itemRequest.ProductId,
                Quantity = itemRequest.Quantity,
                UnitPrice = unitPrice,
                TotalPrice = totalPrice
            });

            // Actualizar stock del producto
            product.Stock -= itemRequest.Quantity;
            await _productRepository.UpdateAsync(product, cancellationToken);

            total += totalPrice;
        }

        sale.Total = total;
        await _saleRepository.AddAsync(sale, cancellationToken);

        // Recargar la venta con los productos incluidos
        var createdSale = await _saleRepository.GetByIdAsync(sale.Id, cancellationToken);
        return _mapper.Map<SaleResponse>(createdSale);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var sale = await _saleRepository.GetByIdAsync(id, cancellationToken);

        // Restaurar stock de productos
        foreach (var item in sale.SaleItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId, cancellationToken);
            product.Stock += item.Quantity;
            await _productRepository.UpdateAsync(product, cancellationToken);
        }

        await _saleRepository.DeleteAsync(id, cancellationToken);
    }

    public async Task<SalesReportResponse> GetSalesReportAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        var sales = await _saleRepository.GetByDateRangeAsync(startDate, endDate, cancellationToken);
        var salesList = sales.ToList();

        var totalSales = salesList.Count;
        var totalRevenue = salesList.Sum(s => s.Total);

        return new SalesReportResponse(
            StartDate: startDate,
            EndDate: endDate,
            TotalSales: totalSales,
            TotalRevenue: totalRevenue,
            Sales: _mapper.Map<IEnumerable<SaleResponse>>(salesList)
        );
    }
}

