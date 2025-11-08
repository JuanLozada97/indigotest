# Frontend - IndigoTest

Aplicación web desarrollada con React 19, TypeScript y Vite para la gestión de productos y ventas.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Tablero Kanban](#-tablero-kanban)

## 🎯 Descripción

Frontend moderno y responsive desarrollado con React que permite:

- Gestión completa de productos (CRUD)
- Creación y gestión de ventas
- Control de inventario en tiempo real
- Generación de reportes de ventas
- Autenticación y autorización de usuarios

## 🛠 Tecnologías

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite 7** - Build tool y dev server
- **React Router 7** - Navegación
- **Tailwind CSS 4** - Framework de estilos
- **ESLint** - Linter

## 📦 Requisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Backend ejecutándose en `http://localhost:5000`

## 🚀 Instalación

1. **Navegar al directorio del frontend**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

   O con yarn:
   ```bash
   yarn install
   ```

3. **Verificar la instalación**
   ```bash
   node --version
   npm --version
   ```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto frontend (opcional):

```env
VITE_API_URL=http://localhost:5000
```

El cliente API está configurado por defecto para conectarse a `http://localhost:5000`. Si necesitas cambiar la URL del backend, edita `src/api/client.ts`.

## ▶️ Ejecución

### Desarrollo

1. **Asegúrate de que el backend esté ejecutándose**
   ```bash
   # En otra terminal, desde backend/src/Api
   dotnet run
   ```

2. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   
   La aplicación estará disponible en: `http://localhost:5173`

   El servidor de desarrollo incluye:
   - Hot Module Replacement (HMR)
   - Recarga automática en cambios
   - Source maps para debugging

### Producción

1. **Build de producción**
   ```bash
   npm run build
   ```

   Esto generará los archivos optimizados en la carpeta `dist/`.

2. **Preview del build**
   ```bash
   npm run preview
   ```

   Esto iniciará un servidor local para probar el build de producción.

3. **Desplegar**

   Los archivos en `dist/` pueden ser desplegados en cualquier servidor estático:
   - Netlify
   - Vercel
   - GitHub Pages
   - Azure Static Web Apps
   - Cualquier servidor web (Nginx, Apache, etc.)

## 📁 Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── api/            # Cliente API
│   │   ├── client.ts   # Configuración base del cliente
│   │   ├── products.ts # Endpoints de productos
│   │   ├── sales.ts    # Endpoints de ventas
│   │   └── blobStorage.ts # Upload de imágenes
│   ├── auth/           # Autenticación
│   │   └── AuthContext.tsx # Contexto de autenticación
│   ├── components/     # Componentes reutilizables
│   │   └── ProtectedRoute.tsx # Ruta protegida
│   ├── pages/          # Páginas de la aplicación
│   │   ├── LoginPage.tsx
│   │   ├── ProductsPage.tsx
│   │   └── SalesPage.tsx
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── index.html          # HTML principal
├── package.json        # Dependencias y scripts
├── tsconfig.json       # Configuración TypeScript
├── vite.config.ts      # Configuración Vite
└── tailwind.config.js  # Configuración Tailwind
```

## 📜 Scripts Disponibles

### `npm run dev`
Inicia el servidor de desarrollo con Vite.

### `npm run build`
Crea un build de producción optimizado en la carpeta `dist/`.

### `npm run preview`
Inicia un servidor local para previsualizar el build de producción.

### `npm run lint`
Ejecuta ESLint para verificar el código.

## 🎨 Características de la UI

### Diseño
- Interfaz moderna con tema oscuro
- Diseño responsive (mobile-first)
- Animaciones y transiciones suaves
- Feedback visual para acciones del usuario

### Componentes Principales

#### LoginPage
- Formulario de autenticación
- Validación de credenciales
- Manejo de errores

#### ProductsPage
- Listado de productos con paginación
- Formulario de creación/edición
- Upload de imágenes
- Validaciones de formulario

#### SalesPage
- Formulario de creación de ventas
- Selección múltiple de productos
- Validación de stock
- Historial de ventas
- Generación de reportes

## 🔐 Autenticación

La aplicación utiliza JWT para autenticación:

1. El usuario inicia sesión en `/login`
2. El token se almacena en el contexto de autenticación
3. Las rutas protegidas verifican el token antes de permitir el acceso
4. El token se incluye automáticamente en todas las peticiones API

### Credenciales de Prueba

- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

## 🐛 Troubleshooting

### Error: "Cannot connect to API"

1. Verifica que el backend esté ejecutándose
2. Verifica la URL en `src/api/client.ts`
3. Verifica la configuración de CORS en el backend

### Error: "Module not found"

Ejecuta:
```bash
npm install
```

### Error de TypeScript

Verifica que todos los tipos estén correctamente importados:
```bash
npm run build
```

## 📊 Tablero Kanban

Sigue el progreso del proyecto:

🔗 **[Ver Tablero Kanban](https://github.com/users/JuanLozada97/projects/5)**

## 📝 Notas Adicionales

- El puerto por defecto es 5173, pero Vite lo cambiará automáticamente si está ocupado
- Los cambios en el código se reflejan automáticamente gracias a HMR
- El build de producción está optimizado para tamaño y rendimiento

---

**Desarrollado con React 19 y Vite**
