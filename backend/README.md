# Backend - IndigoTest API

API REST desarrollada con .NET 8 para la gestión de productos y ventas.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Base de Datos](#-base-de-datos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Autenticación](#-autenticación)
- [Tablero Kanban](#-tablero-kanban)

## 🎯 Descripción

Backend desarrollado siguiendo arquitectura en capas (Clean Architecture) con separación de responsabilidades:

- **Api**: Controllers y configuración de la aplicación
- **Application**: Lógica de negocio y DTOs
- **Domain**: Entidades del dominio
- **Infrastructure**: Persistencia y acceso a datos

## 🛠 Tecnologías

- **.NET 8** - Framework principal
- **Entity Framework Core 8** - ORM
- **SQLite** - Base de datos
- **AutoMapper** - Mapeo de objetos
- **JWT Bearer** - Autenticación
- **Swagger/OpenAPI** - Documentación API
- **Azure Blob Storage** - Almacenamiento de imágenes

## 📦 Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) o [VS Code](https://code.visualstudio.com/) (opcional)
- Cuenta de Azure Storage (opcional, para almacenamiento de imágenes)

## 🚀 Instalación

1. **Navegar al directorio del proyecto**
   ```bash
   cd backend/src/Api
   ```

2. **Restaurar dependencias**
   ```bash
   dotnet restore
   ```

3. **Verificar la instalación**
   ```bash
   dotnet --version
   ```
   Debe mostrar la versión 8.x.x

## ⚙️ Configuración

### 1. Configurar Connection String

Edita el archivo `appsettings.json` o `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=../data/app.db"
  }
}
```

### 2. Configurar JWT

Edita `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "tu-clave-secreta-super-segura-de-al-menos-32-caracteres",
    "Issuer": "IndigoTest",
    "Audience": "IndigoTestUsers"
  }
}
```

**⚠️ Importante**: En producción, usa una clave segura y guárdala en variables de entorno.

### 3. Configurar Azure Blob Storage (Opcional)

Si deseas usar Azure Blob Storage para imágenes:

```json
{
  "AzureStorage": {
    "ConnectionString": "tu-connection-string-de-azure",
    "ContainerName": "product-images"
  }
}
```

## ▶️ Ejecución

### Desarrollo

1. **Navegar al directorio del proyecto**
   ```bash
   cd backend/src/Api
   ```

2. **Ejecutar la aplicación**
   ```bash
   dotnet run
   ```

3. **Acceder a la API**
   - API: `http://localhost:5000` o `https://localhost:5001`
   - Swagger UI: `http://localhost:5000/swagger`

### Con Visual Studio

1. Abre `IndigoTestSolution.sln` en Visual Studio
2. Establece `Api` como proyecto de inicio
3. Presiona `F5` o haz clic en "Run"

### Con VS Code

1. Abre la carpeta `backend` en VS Code
2. Instala la extensión "C# Dev Kit" si no la tienes
3. Presiona `F5` para ejecutar

## 🗄️ Base de Datos

### Migraciones

La base de datos se crea automáticamente al ejecutar la aplicación por primera vez. Si necesitas crear migraciones manualmente:

```bash
cd backend/src/Infrastructure
dotnet ef migrations add NombreMigracion --project ../Infrastructure --startup-project ../Api
```

### Aplicar Migraciones

```bash
dotnet ef database update --project ../Infrastructure --startup-project ../Api
```

### Datos de Prueba

La aplicación incluye un `DataSeeder` que crea usuarios de prueba al iniciar:

- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

## 📁 Estructura del Proyecto

```
backend/src/
├── Api/
│   ├── Controllers/          # Controladores REST
│   │   ├── AuthController.cs
│   │   ├── ProductController.cs
│   │   └── SaleController.cs
│   ├── Mapping/              # Perfiles de AutoMapper
│   │   └── MappingProfile.cs
│   ├── Program.cs            # Configuración de la aplicación
│   └── appsettings.json      # Configuración
├── Application/
│   ├── Contracts/            # Interfaces de repositorios
│   │   ├── IProductRepository.cs
│   │   └── ISaleRepository.cs
│   ├── DTOs/                 # Data Transfer Objects
│   │   ├── AuthDtos.cs
│   │   ├── ProductDtos.cs
│   │   └── SaleDtos.cs
│   └── Services/             # Servicios de negocio
│       ├── ProductService.cs
│       └── SaleService.cs
├── Domain/
│   └── Entities/             # Entidades del dominio
│       ├── Product.cs
│       ├── Sale.cs
│       ├── SaleItem.cs
│       └── User.cs
└── Infrastructure/
    └── Persistence/
        ├── AppDbContext.cs   # Contexto de EF Core
        ├── Configurations/   # Configuraciones de entidades
        ├── Migrations/       # Migraciones de base de datos
        ├── Repositories/     # Implementación de repositorios
        │   ├── ProductRepository.cs
        │   └── SaleRepository.cs
        └── DataSeeder.cs     # Seeder de datos iniciales
```

## 🔌 API Endpoints

### Autenticación

#### `POST /api/auth/login`
Iniciar sesión y obtener token JWT.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "Admin"
  }
}
```

### Productos

- `GET /api/products` - Listar todos los productos
- `GET /api/products/{id}` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

### Ventas

- `GET /api/sales` - Listar todas las ventas
- `GET /api/sales/{id}` - Obtener venta por ID
- `POST /api/sales` - Crear nueva venta
- `DELETE /api/sales/{id}` - Eliminar venta
- `GET /api/sales/report?startDate={date}&endDate={date}` - Generar reporte

## 🔐 Autenticación

La API utiliza autenticación JWT. Para acceder a endpoints protegidos:

1. Obtén un token mediante `POST /api/auth/login`
2. Incluye el token en el header `Authorization`:
   ```
   Authorization: Bearer {tu-token}
   ```

### Ejemplo con cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Usar el token
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer {tu-token}"
```

## 🏗️ Producción

### Build

```bash
dotnet publish -c Release -o ./publish
```

### Variables de Entorno

En producción, configura las siguientes variables de entorno:

- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__DefaultConnection`
- `Jwt__Key`
- `Jwt__Issuer`
- `Jwt__Audience`
- `AzureStorage__ConnectionString` (si aplica)

### Docker (Opcional)

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Api/Api.csproj", "Api/"]
RUN dotnet restore "Api/Api.csproj"
COPY . .
WORKDIR "/src/Api"
RUN dotnet build "Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]
```

## 📊 Tablero Kanban

Sigue el progreso del proyecto:

🔗 **[Ver Tablero Kanban](https://github.com/users/JuanLozada97/projects/5)**

## 🐛 Troubleshooting

### Error: "No se puede encontrar la base de datos"

Asegúrate de que la ruta en `ConnectionStrings` sea correcta. La base de datos se crea automáticamente en la primera ejecución.

### Error: "JWT Key no configurada"

Verifica que `Jwt:Key` esté configurado en `appsettings.json` y tenga al menos 32 caracteres.

### Error de CORS

Verifica que el frontend esté configurado en `Program.cs` en la sección de CORS.

## 📝 Notas Adicionales

- La base de datos SQLite se crea automáticamente en `backend/src/data/app.db`
- Los usuarios de prueba se crean automáticamente al iniciar la aplicación
- Swagger está disponible solo en modo Development

---

**Desarrollado con .NET 8**

