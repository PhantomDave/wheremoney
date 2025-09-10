FROM python:3.12-slim
LABEL authors="dave"

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        gcc \
        libpq-dev \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

ENV POETRY_HOME="/opt/poetry"
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN curl -sSL https://install.python-poetry.org | python3 - && poetry --version

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY pyproject.toml poetry.lock* /app/
RUN poetry config virtualenvs.create false \
    && poetry config virtualenvs.in-project false \
    && poetry install --no-interaction --no-ansi --no-root

# Copy application code
COPY . /app

# Create non-root user with a home directory and ensure ownership
RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup --home /home/appuser appuser \
    && mkdir -p /home/appuser \
    && chown -R appuser:appgroup /app /home/appuser

ENV HOME=/home/appuser

# Entrypoint will wait for DB, run migrations and launch the app
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh \
    && chown appuser:appgroup /app/entrypoint.sh

USER appuser

ENV FLASK_APP=app.py

EXPOSE 5000

ENTRYPOINT ["/app/entrypoint.sh"]
