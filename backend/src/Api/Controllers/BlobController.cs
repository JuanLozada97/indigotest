using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Api.Services;

namespace Api.Controllers;

[ApiController]
[Route("api/blob")]
[Authorize]
public class BlobController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<BlobController> _logger;

    public BlobController(IConfiguration configuration, ILogger<BlobController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No se proporcionó ningún archivo" });
        }

        // Validar tamaño (máximo 5MB) - hacerlo primero para evitar procesar archivos grandes
        const long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.Length > maxSize)
        {
            return BadRequest(new { message = "El archivo es demasiado grande. Máximo 5MB" });
        }

        // Validar extensión básica
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new { message = "Solo se permiten archivos de imagen (jpg, jpeg, png, gif, webp)" });
        }

        // Validar MIME type real usando magic numbers (file signatures)
        string? detectedMimeType;
        using (var fileStream = file.OpenReadStream())
        {
            var (isValid, mimeType, errorMessage) = FileTypeValidator.ValidateImageFile(fileStream, file.FileName);
            
            if (!isValid)
            {
                _logger.LogWarning("Intento de subir archivo inválido: {FileName}, Error: {Error}", file.FileName, errorMessage);
                return BadRequest(new { message = errorMessage ?? "El archivo no es una imagen válida" });
            }

            detectedMimeType = mimeType;
        }

        // Verificar que el Content-Type declarado coincida con el detectado (opcional pero recomendado)
        if (!string.IsNullOrEmpty(file.ContentType) && 
            !string.IsNullOrEmpty(detectedMimeType) && 
            file.ContentType != detectedMimeType)
        {
            _logger.LogWarning(
                "Content-Type declarado ({DeclaredType}) no coincide con el tipo detectado ({DetectedType}) para archivo {FileName}",
                file.ContentType, detectedMimeType, file.FileName);
            // No rechazamos, pero registramos la advertencia
        }

        try
        {
            var blobBaseUrl = _configuration["BlobStorage:BaseUrl"];
            var blobSasToken = _configuration["BlobStorage:SasToken"];
            var containerName = _configuration["BlobStorage:ContainerName"] ?? "testindigo";

            if (string.IsNullOrEmpty(blobBaseUrl) || string.IsNullOrEmpty(blobSasToken))
            {
                _logger.LogError("Blob Storage no está configurado correctamente");
                return StatusCode(500, new { message = "Configuración de Blob Storage no encontrada" });
            }

            // Extraer la connection string o usar SAS token directamente
            var folder = "JuanLozada";
            var safeName = file.FileName.Replace(" ", "_");
            var blobName = $"{folder}/{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}_{safeName}";

            // Construir la URL completa con SAS token
            var uploadUrl = $"{blobBaseUrl.TrimEnd('/')}/{containerName}/{Uri.EscapeDataString(blobName)}?{blobSasToken}";

            // Subir el archivo usando HttpClient
            using var httpClient = new HttpClient();
            // Abrir el stream nuevamente para la subida
            using var uploadStream = file.OpenReadStream();
            using var content = new StreamContent(uploadStream);
            
            // Usar el MIME type detectado en lugar del declarado por el cliente
            var contentType = detectedMimeType ?? file.ContentType ?? "application/octet-stream";
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(contentType);
            content.Headers.Add("x-ms-blob-type", "BlockBlob");

            var response = await httpClient.PutAsync(uploadUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorText = await response.Content.ReadAsStringAsync();
                _logger.LogError("Error subiendo a Blob Storage: {StatusCode} {Error}", response.StatusCode, errorText);
                return StatusCode(500, new { message = $"Error subiendo imagen: {response.StatusCode}" });
            }

            // Retornar la URL pública
            var publicUrl = $"{blobBaseUrl.TrimEnd('/')}/{containerName}/{Uri.EscapeDataString(blobName)}?{blobSasToken}";
            return Ok(new { url = publicUrl });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error inesperado al subir imagen");
            return StatusCode(500, new { message = "Error inesperado al subir la imagen" });
        }
    }
}

