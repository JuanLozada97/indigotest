using Application.Contracts;
using Domain.Entities;
using AutoMapper;

namespace Application.Services;

public class ProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    public ProductService(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }
    public async Task<ProductResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        return _mapper.Map<ProductResponse>(product);
    }
    public async Task<IEnumerable<ProductResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }
    public async Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken = default)
    {
        var product = _mapper.Map<Product>(request);
        await _productRepository.AddAsync(product, cancellationToken);
        return _mapper.Map<ProductResponse>(product);
    }
    public async Task<ProductResponse> UpdateAsync(int id, UpdateProductRequest request, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        _mapper.Map(request, product);
        await _productRepository.UpdateAsync(product, cancellationToken);
        return _mapper.Map<ProductResponse>(product);
    }
    public async Task<ProductResponse> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        await _productRepository.DeleteAsync(id, cancellationToken);
        return _mapper.Map<ProductResponse>(product);
    }

}