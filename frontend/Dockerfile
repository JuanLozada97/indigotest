# Etapa 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Build de producción
# Nota: VITE_API_BASE_URL se puede pasar como build arg
ARG VITE_API_BASE_URL=http://localhost:5202
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Eliminar archivos por defecto de Nginx
RUN rm -rf ./*

# Copiar archivos build
COPY --from=build /app/dist .

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

