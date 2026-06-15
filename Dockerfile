FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Instala um servidor estático simples para servir o SPA
RUN npm install -g serve

# Copia apenas o build estático do estágio anterior
COPY --from=build /app/dist /app/dist

EXPOSE 9518

# Serve a pasta dist na porta 9518, tratando roteamento de SPA (-s)
CMD ["serve", "-s", "dist", "-l", "9518"]
