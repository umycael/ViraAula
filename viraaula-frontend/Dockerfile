FROM node:22-slim
WORKDIR /app

# Instala as dependencias (só refaz se o package.json mudar)
COPY package*.json ./
RUN npm ci

COPY . .

# URL do backend, gravada no build (valor padrão para uso local)
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]