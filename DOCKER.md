# Guía de Docker - IndigoTest

Esta guía explica cómo usar Docker y Docker Compose para ejecutar el proyecto IndigoTest.

## 📋 Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- Docker Compose v2 (incluido en Docker Desktop)

## 🚀 Inicio Rápido

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd indigotest
   ```

2. **Crear archivo .env** (opcional)
   ```bash
   # Crea un archivo .env en la raíz con:
   JWT_KEY=tu-clave-secreta-de-al-menos-32-caracteres
   VITE_API_BASE_URL=http://localhost:5202
   ```

3. **Construir y ejecutar**
   ```bash
   docker-compose up --build
   ```

4. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5202
   - Swagger: http://localhost:5202/swagger

## 📁 Archivos Docker

### Backend
- `backend/Dockerfile` - Imagen multi-etapa para .NET 8
- `backend/.dockerignore` - Archivos excluidos del build

### Frontend
- `frontend/Dockerfile` - Imagen multi-etapa con Node.js y Nginx
- `frontend/nginx.conf` - Configuración de Nginx para SPA
- `frontend/.dockerignore` - Archivos excluidos del build

### Orquestación
- `docker-compose.yml` - Configuración de servicios y red

## 🔧 Comandos Útiles

### Gestión de Servicios

```bash
# Iniciar servicios en segundo plano
docker-compose up -d

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (incluye base de datos)
docker-compose down -v

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Reconstrucción

```bash
# Reconstruir todos los servicios
docker-compose build

# Reconstruir un servicio específico
docker-compose build backend
docker-compose build frontend

# Reconstruir y reiniciar
docker-compose up --build -d
```

### Gestión de Contenedores

```bash
# Ver estado de servicios
docker-compose ps

# Reiniciar un servicio
docker-compose restart backend

# Ejecutar comandos dentro de un contenedor
docker-compose exec backend sh
docker-compose exec frontend sh

# Ver uso de recursos
docker stats
```

### Base de Datos

```bash
# Ejecutar migraciones
docker-compose exec backend dotnet ef migrations add NombreMigracion \
  --project /app/src/Infrastructure \
  --startup-project /app/src/Api

# Aplicar migraciones
docker-compose exec backend dotnet ef database update \
  --project /app/src/Infrastructure \
  --startup-project /app/src/Api
```

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto para personalizar la configuración:

```env
# JWT Configuration
JWT_KEY=tu-clave-secreta-de-al-menos-32-caracteres

# API Base URL (para el frontend en build time)
VITE_API_BASE_URL=http://localhost:5202
```

## 📊 Puertos

- **Backend**: `5202` → `8080` (interno)
- **Frontend**: `5173` → `80` (interno)

## 🗄️ Persistencia de Datos

La base de datos SQLite se persiste mediante un volumen Docker:
- Host: `./backend/src/data/app.db`
- Contenedor: `/app/data/app.db`

## 🐛 Troubleshooting

### Error: "Port already in use"

Si los puertos están ocupados, puedes cambiarlos en `docker-compose.yml`:

```yaml
ports:
  - "5203:8080"  # Cambiar puerto del backend
  - "5174:80"    # Cambiar puerto del frontend
```

### Error: "Cannot connect to API"

1. Verifica que el backend esté ejecutándose: `docker-compose ps`
2. Verifica los logs: `docker-compose logs backend`
3. Verifica la configuración de CORS en `Program.cs`

### Error: "Database locked"

Si la base de datos está bloqueada:
```bash
docker-compose down
docker-compose up -d
```

### Limpiar todo y empezar de nuevo

```bash
# Detener y eliminar contenedores, redes y volúmenes
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Limpiar sistema Docker (cuidado: elimina todo)
docker system prune -a
```

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │
│   (Nginx)       │
│   Port: 5173    │
└────────┬────────┘
         │
         │ HTTP
         │
┌────────▼────────┐
│    Backend      │
│   (.NET 8)      │
│   Port: 5202    │
└────────┬────────┘
         │
         │ SQLite
         │
┌────────▼────────┐
│   Database      │
│   (Volume)      │
└─────────────────┘
```

## 📝 Notas

- Los health checks aseguran que los servicios estén listos antes de iniciar dependencias
- La red Docker `indigotest-network` permite comunicación interna entre servicios
- El frontend se construye con la URL del API en tiempo de build
- La base de datos se crea automáticamente en la primera ejecución

