# Dockerfile (Frontend)
FROM node:18-alpine

WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el código
COPY . .

# Exponemos el puerto de Next.js
EXPOSE 3000

# Iniciamos la página en modo desarrollo
CMD ["npm", "run", "dev"]