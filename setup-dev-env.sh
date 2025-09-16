#!/bin/bash
set -e

echo "Setting up WhereMoney development environment..."

# Install Poetry
echo "Installing Poetry..."
curl -sSL https://install.python-poetry.org | python3 - || pip3 install poetry

# Ensure Poetry is in PATH
export PATH="$HOME/.local/bin:$PATH"

# Setup backend dependencies
echo "Installing backend dependencies..."
cd backend/WhereMoney.Api
poetry install --no-interaction

# Setup frontend dependencies
echo "Installing frontend dependencies..."
cd ../../frontend
npm install

echo "Development environment setup complete!"
echo ""
echo "Quick start:"
echo "1. Start database: docker compose up db -d"
echo "2. Start backend: cd backend/WhereMoney.Api && poetry run python app.py"
echo "3. Start frontend: cd frontend && npm start"