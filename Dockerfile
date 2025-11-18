# Dockerfile (Frontend - Raíz)
FROM node:18-alpine

WORKDIR /app

# Instalamos OpenSSL (Necesario para Prisma en Linux)
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# --- NUEVO: Copiamos el esquema desde la carpeta server ---
# Esto es vital: el frontend necesita ver el archivo schema.prisma para saber cómo conectarse
COPY server/prisma ./prisma/

# --- NUEVO: Generamos el cliente de Prisma para el Frontend ---
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]