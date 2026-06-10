FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && \
    mkdir -p dist/client/20261prj5/schoolmanagement && \
    cp -rp dist/client/assets dist/client/20261prj5/schoolmanagement/assets

FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

EXPOSE 9518

CMD ["node_modules/.bin/srvx", "--prod", "--static", "/app/dist/client", "dist/server/server.js"]