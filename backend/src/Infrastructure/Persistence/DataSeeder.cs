using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Persistence;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context, CancellationToken cancellationToken = default)
    {
        await context.Database.EnsureCreatedAsync(cancellationToken);
        
        if (!await context.Users.AnyAsync(cancellationToken))
        {
            CreateUserWithPassword("admin", "admin123", "Admin", out var user, out _);
            context.Users.Add(user);
        }
        if(!await context.Products.AnyAsync(cancellationToken))
        {
            context.Products.Add(new Product
            {
                Name = "Product 1",
                Description = "Description 1",
                Price = 100,
                Stock = 100,
            });
            context.Products.Add(new Product
            {
                Name = "Product 2",
                Description = "Description 2",
                Price = 200,    
                Stock = 200,
            });
            context.Products.Add(new Product
            {
                Name = "Product 3",
                Description = "Description 3",
                Price = 300,
                Stock = 300,
            });
        }

    }
    private static void CreateUserWithPassword(string username, string password, string role, out User user, out string plainPassword)
    {
        using var hmac = new HMACSHA512();
        var salt = hmac.Key;
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        plainPassword = password;
        user = new User
        {
            Username = username,
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = role
        };
    }
}