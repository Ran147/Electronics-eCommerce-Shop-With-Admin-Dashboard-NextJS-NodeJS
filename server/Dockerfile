# server/Dockerfile
FROM node:20-alpine

# EN ALPINE ES OBLIGATORIO INSTALAR OPENSSL MANUALMENTE
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

# --- LIMPIEZA DE SEGURIDAD ---
RUN rm -rf node_modules package-lock.json

# Instalamos dependencias
RUN npm install

# ⚠️ IMPORTANTE: Agregamos estas variables ANTES de generate
ENV PRISMA_CLIENT_ENGINE_TYPE=library
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Copiamos el schema de prisma antes de generar
COPY prisma ./prisma/

# Generamos el cliente
RUN npx prisma generate

# Ahora copiamos el resto del código
COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node utills/insertDemoData.js && npm start"]