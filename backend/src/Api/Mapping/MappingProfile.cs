using Application.Contracts;
using AutoMapper;
using Domain.Entities;

namespace Api.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Product mappings
        CreateMap<Product, ProductResponse>();
        CreateMap<CreateProductRequest, Product>();
        CreateMap<UpdateProductRequest, Product>();

        // Sale mappings
        CreateMap<Sale, SaleResponse>();
        CreateMap<SaleItem, SaleItemResponse>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
    }
}