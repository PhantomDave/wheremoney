FROM node:24-alpine AS base
LABEL authors="dave"

RUN apk add --no-cache bash curl jq

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

COPY . .

FROM base AS dev
EXPOSE 4200
CMD ["./node_modules/.bin/ng", "serve", "--host", "0.0.0.0"]

# Production multi-stage (optional):
# FROM base AS build
# RUN npm run build -- --configuration=development
# FROM nginx:alpine AS prod
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
