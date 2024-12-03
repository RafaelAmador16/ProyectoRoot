# Etapa de construcción
FROM node:18-alpine AS build

WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de la aplicación React
RUN npm install

# Copiar todo el código fuente
COPY . .

# Construir la aplicación React para producción
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Instalar 'serve' para servir archivos estáticos
RUN npm install -g serve

WORKDIR /app

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/build ./build

# Exponer el puerto para el frontend
EXPOSE 5173

# Servir los archivos estáticos con 'serve'
CMD ["serve", "-s", "build", "-l", "5173"]
