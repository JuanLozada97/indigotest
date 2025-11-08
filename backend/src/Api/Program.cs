using Infrastructure.Persistence;
using Application.Contracts;
using Application.Services;
using AutoMapper;
using Api.Mapping;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// ConnectionString + DbContext (SQLite)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                      ?? "Data Source=../data/app.db";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(connectionString);
});

// Repositories
builder.Services.AddScoped<Application.Contracts.IProductRepository, Infrastructure.Persistence.Repositories.ProductRepository>();

// Services
builder.Services.AddScoped<Application.Services.ProductService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DataSeeder.SeedAsync(ctx).GetAwaiter().GetResult();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();
app.Run();
