FROM node:24-alpine
LABEL authors="dave"

RUN apk add --no-cache bash curl jq

WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
