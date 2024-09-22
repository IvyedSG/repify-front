# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración (package.json y package-lock.json o yarn.lock)
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS runner

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para la ejecución desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Expone el puerto en el que corre Next.js (normalmente 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]
