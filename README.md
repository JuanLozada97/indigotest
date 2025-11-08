# IndigoTest - Sistema de Gestión de Productos y Ventas

Sistema completo de gestión de inventario y ventas desarrollado con .NET 8 (Backend) y React + TypeScript (Frontend).

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [🐳 Docker](#-docker)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación API](#-documentación-api)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Tablero Kanban](#-tablero-kanban)
- [Contribución](#-contribución)

## 🎯 Descripción

IndigoTest es una aplicación web full-stack que permite gestionar productos y realizar ventas con control automático de inventario. El sistema incluye autenticación JWT, gestión de productos con imágenes, procesamiento de ventas y generación de reportes.

## ✨ Características

### Módulo de Productos
- ✅ CRUD completo de productos
- ✅ Gestión de imágenes (Azure Blob Storage)
- ✅ Control de stock
- ✅ Validaciones de negocio

### Módulo de Ventas
- ✅ Creación de ventas con múltiples productos
- ✅ Actualización automática de stock
- ✅ Validación de stock disponible
- ✅ Historial de ventas
- ✅ Reportes por rango de fechas
- ✅ Restauración de stock al eliminar ventas

### Autenticación y Seguridad
- ✅ Autenticación JWT
- ✅ Rutas protegidas
- ✅ Roles de usuario

## 🛠 Tecnologías

### Backend
- **.NET 8** - Framework principal
- **Entity Framework Core** - ORM
- **SQLite** - Base de datos
- **AutoMapper** - Mapeo de objetos
- **JWT Bearer** - Autenticación
- **Swagger/OpenAPI** - Documentación API
- **Azure Blob Storage** - Almacenamiento de imágenes

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **Axios/Fetch** - Cliente HTTP

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Opcional
- [Visual Studio 2022](https://visualstudio.microsoft.com/) o [VS Code](https://code.visualstudio.com/)
- Cuenta de Azure Storage (para almacenamiento de imágenes)

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd indigotest
   ```

2. **Configurar el Backend**
   ```bash
   cd backend/src/Api
   ```
   
   Ver instrucciones detalladas en [backend/README.md](./backend/README.md)

3. **Configurar el Frontend**
   ```bash
   cd frontend
   ```
   
   Ver instrucciones detalladas en [frontend/README.md](./frontend/README.md)

## ▶️ Ejecución

### Desarrollo

1. **Iniciar el Backend**
   ```bash
   cd backend/src/Api
   dotnet run
   ```
   
   El backend estará disponible en: `http://localhost:5202`
   
   Swagger UI: `http://localhost:5202/swagger`

2. **Iniciar el Frontend** (en otra terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   
   El frontend estará disponible en: `http://localhost:5173`

### Producción

Ver las instrucciones específicas en los README de cada módulo:
- [Backend README](./backend/README.md#producción)
- [Frontend README](./frontend/README.md#producción)

## 🐳 Docker

### Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- Docker Compose v2 (incluido en Docker Desktop)

### Ejecutar con Docker

La forma más fácil de ejecutar el proyecto es usando Docker Compose:

1. **Clonar el repositorio** (si aún no lo has hecho)
   ```bash
   git clone <url-del-repositorio>
   cd indigotest
   ```

2. **Crear archivo .env** (opcional, para personalizar configuración)
   ```bash
   # Copia el contenido de .env.example y personaliza según necesites
   # JWT_KEY=tu-clave-secreta-de-al-menos-32-caracteres
   # VITE_API_BASE_URL=http://localhost:5202
   ```

3. **Construir y ejecutar los servicios**
   ```bash
   docker-compose up --build
   ```

4. **Acceder a la aplicación**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5202
   - **Swagger UI**: http://localhost:5202/swagger

### Comandos útiles de Docker

```bash
# Ejecutar en segundo plano
docker-compose up -d

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (incluye la base de datos)
docker-compose down -v

# Reconstruir un servicio específico
docker-compose build backend
docker-compose up -d backend

# Ver estado de los servicios
docker-compose ps

# Reiniciar un servicio
docker-compose restart backend

# Ejecutar comandos dentro de un contenedor
docker-compose exec backend dotnet ef migrations add NombreMigracion
docker-compose exec frontend sh
```

### Estructura Docker

```
indigotest/
├── docker-compose.yml          # Orquestación de servicios
├── backend/
│   ├── Dockerfile              # Imagen del backend
│   └── .dockerignore           # Archivos a ignorar en build
├── frontend/
│   ├── Dockerfile              # Imagen del frontend
│   ├── nginx.conf              # Configuración de Nginx
│   └── .dockerignore           # Archivos a ignorar en build
└── .env                        # Variables de entorno (crear manualmente)
```

### Variables de Entorno

Puedes personalizar la configuración creando un archivo `.env` en la raíz del proyecto:

```env
# JWT Configuration
JWT_KEY=tu-clave-secreta-de-al-menos-32-caracteres

# API Base URL (para el frontend en build time)
VITE_API_BASE_URL=http://localhost:5202
```

### Notas importantes

- **Base de datos**: La base de datos SQLite se persiste en `./backend/src/data/app.db` mediante un volumen de Docker
- **Puertos**: 
  - Backend: `5202` (mapeado al puerto `8080` interno)
  - Frontend: `5173` (mapeado al puerto `80` interno de Nginx)
- **Health checks**: Los servicios incluyen health checks para asegurar que estén listos antes de iniciar dependencias
- **Red**: Los servicios se comunican a través de una red Docker interna llamada `indigotest-network`

## 📁 Estructura del Proyecto

```
indigotest/
├── docker-compose.yml        # Configuración Docker Compose
├── backend/
│   ├── Dockerfile            # Imagen Docker del backend
│   ├── .dockerignore         # Archivos ignorados en Docker
│   └── src/
│       ├── Api/              # API REST (Controllers, Program.cs)
│       ├── Application/      # Lógica de negocio (Services, DTOs)
│       ├── Domain/           # Entidades del dominio
│       ├── Infrastructure/   # Persistencia (DbContext, Repositories)
│       └── data/             # Base de datos SQLite
├── frontend/
│   ├── Dockerfile            # Imagen Docker del frontend
│   ├── nginx.conf            # Configuración Nginx
│   ├── .dockerignore         # Archivos ignorados en Docker
│   └── src/
│       ├── api/              # Cliente API
│       ├── auth/             # Contexto de autenticación
│       ├── components/       # Componentes reutilizables
│       └── pages/            # Páginas de la aplicación
└── README.md                 # Este archivo
```

## 📚 Documentación API

Cuando el backend esté ejecutándose, puedes acceder a la documentación interactiva de la API en:

**Swagger UI**: `http://localhost:5202/swagger`

La API incluye los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/{id}` - Obtener producto por ID
- `POST /api/products` - Crear producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

### Ventas
- `GET /api/sales` - Listar ventas
- `GET /api/sales/{id}` - Obtener venta por ID
- `POST /api/sales` - Crear venta
- `DELETE /api/sales/{id}` - Eliminar venta
- `GET /api/sales/report` - Generar reporte de ventas

## 📸 Capturas de Pantalla

> **Nota**: Agrega aquí capturas de pantalla de la aplicación en funcionamiento.

### Página de Login
![Login](./docs/screenshots/login.png)

### Página de Productos
![Productos](./docs/screenshots/products.png)

### Pagina de Ventas y Reporte de Ventas
![Reporte](./docs/screenshots/report.png)

## 📊 Tablero Kanban

Sigue el progreso del proyecto en nuestro tablero Kanban:

🔗 **[Ver Tablero Kanban](https://github.com/users/JuanLozada97/projects/5)**

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y de uso interno.

---

**Desarrollado con ❤️ usando .NET y React**

