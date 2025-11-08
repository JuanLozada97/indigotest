# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos de solución y proyectos
COPY ["src/Api/Api.csproj", "src/Api/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]

# Restaurar dependencias
RUN dotnet restore "src/Api/Api.csproj"

# Copiar el resto del código
COPY . .

# Build de la aplicación
WORKDIR "/src/src/Api"
RUN dotnet build "Api.csproj" -c Release -o /app/build

# Etapa 2: Publish
FROM build AS publish
RUN dotnet publish "Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Instalar curl para healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Crear directorio para la base de datos
RUN mkdir -p /app/data

# Copiar archivos publicados
COPY --from=publish /app/publish .

# Exponer puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development

# Punto de entrada
ENTRYPOINT ["dotnet", "Api.dll"]

