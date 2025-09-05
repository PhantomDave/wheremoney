FROM node:24-alpine
LABEL authors="dave"

RUN npm install -g @angular/cli && \
    apk add --no-cache bash curl jq

COPY . /app
WORKDIR /app

RUN npm ci

EXPOSE 4200

ENTRYPOINT ["ng", "serve", "--host", "0.0.0.0"]
