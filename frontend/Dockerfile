# Usa la imagen base de Node.js
FROM node:18-alpine as builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración del proyecto
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente de la aplicación
COPY . .

# Compila la aplicación de React para producción
RUN npm run build

# Inicia el servidor de desarrollo de React
CMD ["npm", "run", "dev"]
