using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public record LoginRequest(
    [Required(ErrorMessage = "El nombre de usuario es requerido")]
    [MinLength(1, ErrorMessage = "El nombre de usuario no puede estar vacío")]
    string Username,
    
    [Required(ErrorMessage = "La contraseña es requerida")]
    [MinLength(1, ErrorMessage = "La contraseña no puede estar vacía")]
    string Password
);

public record LoginResponse(string? Token, string? Username, string? Role);