namespace Api.Services;

public static class FileTypeValidator
{
    private static readonly HashSet<string> AllowedMimeTypes = new()
    {
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp"
    };

    /// <summary>
    /// Valida que el archivo sea realmente una imagen verificando su firma (magic numbers)
    /// </summary>
    /// <param name="fileStream">Stream del archivo a validar</param>
    /// <param name="fileName">Nombre del archivo (para validación adicional de extensión)</param>
    /// <returns>Tupla con (esVálido, mimeType, mensajeError)</returns>
    public static (bool IsValid, string? MimeType, string? ErrorMessage) ValidateImageFile(Stream fileStream, string fileName)
    {
        if (fileStream == null || fileStream.Length == 0)
        {
            return (false, null, "El archivo está vacío");
        }

        // Leer los primeros bytes del archivo (hasta 12 bytes para cubrir todas las firmas)
        var buffer = new byte[12];
        var originalPosition = fileStream.Position;
        fileStream.Position = 0;
        
        var bytesRead = fileStream.Read(buffer, 0, buffer.Length);
        fileStream.Position = originalPosition; // Restaurar posición original

        if (bytesRead < 4)
        {
            return (false, null, "El archivo es demasiado pequeño para ser una imagen válida");
        }

        // Verificar magic numbers
        string? detectedMimeType = null;

        // Verificar JPEG
        if (bytesRead >= 3 && buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF)
        {
            detectedMimeType = "image/jpeg";
        }
        // Verificar PNG
        else if (bytesRead >= 8 && 
                 buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47 &&
                 buffer[4] == 0x0D && buffer[5] == 0x0A && buffer[6] == 0x1A && buffer[7] == 0x0A)
        {
            detectedMimeType = "image/png";
        }
        // Verificar GIF
        else if (bytesRead >= 4 && 
                 buffer[0] == 0x47 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x38)
        {
            detectedMimeType = "image/gif";
        }
        // Verificar WebP (RIFF...WEBP)
        else if (bytesRead >= 12 &&
                 buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46 &&
                 buffer[8] == 0x57 && buffer[9] == 0x45 && buffer[10] == 0x42 && buffer[11] == 0x50)
        {
            detectedMimeType = "image/webp";
        }

        if (detectedMimeType == null)
        {
            return (false, null, "El archivo no es una imagen válida. Solo se permiten archivos JPEG, PNG, GIF o WebP");
        }

        if (!AllowedMimeTypes.Contains(detectedMimeType))
        {
            return (false, detectedMimeType, $"Tipo de imagen no permitido: {detectedMimeType}");
        }

        // Validación adicional: verificar que la extensión coincida con el tipo detectado
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var extensionMimeMap = new Dictionary<string, string>
        {
            { ".jpg", "image/jpeg" },
            { ".jpeg", "image/jpeg" },
            { ".png", "image/png" },
            { ".gif", "image/gif" },
            { ".webp", "image/webp" }
        };

        if (extensionMimeMap.TryGetValue(extension, out var expectedMimeType))
        {
            if (detectedMimeType != expectedMimeType)
            {
                return (false, detectedMimeType, 
                    $"La extensión del archivo ({extension}) no coincide con el tipo real del archivo ({detectedMimeType}). " +
                    "Posible archivo malicioso.");
            }
        }

        return (true, detectedMimeType, null);
    }
}

