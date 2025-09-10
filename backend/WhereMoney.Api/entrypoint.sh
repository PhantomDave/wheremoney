#!/usr/bin/env bash
set -euo pipefail

# Require DATABASE_URL to be set via environment
if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set. Please set DATABASE_URL in environment or .env file."
  exit 1
fi

# Parse host and port from DATABASE_URL for pg_isready
# Expected format: postgresql://user:pass@host:port/dbname
DB_HOST=$(echo "$DATABASE_URL" | sed -E 's#.*@([^:/]+).*#\1#')
DB_PORT=$(echo "$DATABASE_URL" | sed -E 's#.*@[^:]+:([0-9]+).*#\1#' || echo 5432)

# wait for Postgres
echo "Waiting for database at ${DB_HOST}:${DB_PORT}..."
RETRIES=0
until pg_isready -h "$DB_HOST" -p "$DB_PORT" >/dev/null 2>&1; do
  RETRIES=$((RETRIES+1))
  if [ "$RETRIES" -ge 60 ]; then
    echo "Timed out waiting for Postgres at ${DB_HOST}:${DB_PORT}"
    exit 1
  fi
  sleep 1
done

echo "Database is ready, applying migrations..."
python -m flask db upgrade

echo "Starting Flask app"
exec python app.py
