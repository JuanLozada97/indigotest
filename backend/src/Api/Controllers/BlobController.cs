using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        // Validar que sea una imagen
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new { message = "Solo se permiten archivos de imagen (jpg, jpeg, png, gif, webp)" });
        }

        // Validar tamaño (máximo 5MB)
        const long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.Length > maxSize)
        {
            return BadRequest(new { message = "El archivo es demasiado grande. Máximo 5MB" });
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
            using var fileStream = file.OpenReadStream();
            using var content = new StreamContent(fileStream);
            
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
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

