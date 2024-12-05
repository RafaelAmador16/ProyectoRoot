# Etapa 1: Construcción del proyecto Symfony
FROM php:8.2-fpm-alpine AS builder

# Instalar las dependencias del sistema necesarias para Symfony y extensiones de PHP
RUN apk add --no-cache \
    acl \
    bash \
    git \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    oniguruma-dev \
    libxml2-dev \
    freetype-dev \
    icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        gd \
        pdo_mysql \
        opcache \
        intl \
        mbstring \
        xml

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Crear el directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY composer.json composer.lock ./

# Instalar dependencias de PHP
RUN composer install --no-dev --optimize-autoloader --no-scripts --prefer-dist

# Copiar el resto del proyecto
COPY . .

# Generar las claves para API Platform (si se usa JWT)
RUN mkdir -p config/jwt \
    && openssl genpkey -algorithm RSA -out config/jwt/private.pem -pkeyopt rsa_keygen_bits:4096 \
    && openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout \
    && chmod 600 config/jwt/private.pem config/jwt/public.pem

# Aplicar permisos y optimizaciones de Symfony
RUN set -eux; \
    composer dump-autoload --optimize; \
    composer dump-env prod; \
    php bin/console cache:clear --env=prod; \
    php bin/console cache:warmup --env=prod; \
    chmod -R 777 var/cache var/log

# Etapa 2: Configuración del entorno de producción (sin Nginx)
FROM php:8.2-fpm-alpine

# Instalar dependencias adicionales si es necesario
RUN apk add --no-cache bash curl

# Copiar el proyecto Symfony desde la etapa de construcción
COPY --from=builder /app /var/www/html

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Cambiar el propietario a www-data (usuario predeterminado de Symfony)
RUN chown -R www-data:www-data /var/www/html

# Exponer el puerto para el servidor PHP (por defecto en Symfony se usa el puerto 8000)
EXPOSE 8000

# Comando para iniciar el servidor web de Symfony
CMD ["php", "bin/console", "server:start", "0.0.0.0:8000"]
