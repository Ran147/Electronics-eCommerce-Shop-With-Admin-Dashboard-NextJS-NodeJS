# server/Dockerfile
# Usamos la versión que sugeriste, que es más ligera y moderna
FROM node:20-alpine

# EN ALPINE ES OBLIGATORIO INSTALAR OPENSSL MANUALMENTE
# (Sin esto, Prisma falla en Alpine)
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

# --- LIMPIEZA DE SEGURIDAD ---
# Mantenemos la limpieza por si acaso, pero volvemos a una instalación normal
RUN rm -rf node_modules package-lock.json

# Instalamos dependencias.
# Al usar Alpine, Prisma intentará bajar el motor 'linux-musl'.
# Si ese archivo no está roto en el servidor, esto funcionará perfecto.
RUN npm install
ENV PRISMA_CLIENT_ENGINE_TYPE=library

# Generamos el cliente
RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]