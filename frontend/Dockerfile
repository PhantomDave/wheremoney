FROM node:24-alpine
LABEL authors="dave"

COPY . /app
WORKDIR /app

RUN npm install -g @angular/cli && \
    npm ci && \
    apk add --no-cache bash curl jq


EXPOSE 4200

ENTRYPOINT ["ng", "serve", "--host", "0.0.0.0"]
