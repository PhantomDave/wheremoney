# WhereMoney Banking Application

WhereMoney is a full-stack banking application built with Flask REST API backend, Angular frontend, and PostgreSQL database. The application provides user authentication, data management, and financial tracking capabilities.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Environment Setup
- Requires Docker and Docker Compose v2 for containerized development
- Requires Node.js v20+ and npm for frontend development  
- Requires Python 3.12+ and Poetry for backend development
- PostgreSQL database for data persistence

### Quick Start - Full Stack Development
**NEVER CANCEL any of these long-running commands. Build times are normal and expected.**

1. **Start Database (Required First)**:
   ```bash
   docker compose up db -d
   ```
   - Takes ~12 seconds including image pull on first run
   - Creates PostgreSQL container on port 5432
   - Always start this before backend development

2. **Backend Development Setup**:
   ```bash
   cd backend/WhereMoney.Api
   pip3 install poetry  # If poetry not available
   cp .env.example .env
   # Edit .env: set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
   poetry install        # Takes ~9 seconds. NEVER CANCEL.
   poetry run python app.py  # Starts Flask on port 5000
   ```

3. **Frontend Development Setup**:
   ```bash
   cd frontend
   npm install          # Takes ~39 seconds. NEVER CANCEL.
   npm start           # Takes ~10 seconds to build. Serves on port 4200
   ```

### Production Builds
- **Backend**: Use `poetry run python app.py` for production
- **Frontend**: Use `npm run build --configuration development` (production config fails due to external font restrictions)
  - Development build takes ~10 seconds. NEVER CANCEL.
  - Production build fails: external font access blocked (fonts.googleapis.com)

### Database Management
- **Local Access**: PostgreSQL runs on localhost:5432 (postgres/postgres)
- **Web Interface**: pgAdmin available via `docker compose up pgadmin -d` on port 5050 (admin@admin.com/admin)
- **Migrations**: Run `FLASK_APP=app.py poetry run python -m flask db upgrade` (if migration commands exist)

## Known Issues and Workarounds

### Docker Build Failures
**Issue**: Docker builds fail due to external network restrictions:
```
ERROR: curl: (6) Could not resolve host: install.python-poetry.org
```

**Workaround**: Use local development instead of containerized builds:
- Install Poetry locally: `pip3 install poetry`
- Run backend with local Poetry environment
- Only use Docker for database and pgAdmin containers

### Frontend Build Issues
**Issue**: Production builds fail accessing external resources:
```
ERROR: getaddrinfo ENOTFOUND fonts.googleapis.com
```

**Workaround**: Always use development configuration:
```bash
npm run build --configuration development
```

### Test Suite Issues  
**Issue**: Unit tests fail with TypeScript resolver errors:
```
ERROR: Type 'MaybeAsync<RedirectCommand | Table | null>' is not assignable
```

**Status**: Tests need fixing but don't prevent development. Skip `npm test` for now.

## Validation

### Always Manual Validate After Changes
1. **Backend API Testing**:
   ```bash
   curl http://localhost:5000/docs  # Should return Swagger HTML
   curl http://localhost:5000/      # Should return JSON auth message
   ```

2. **Frontend UI Testing**:
   ```bash
   curl http://localhost:4200/      # Should return Angular app HTML
   ```
   - Open browser to http://localhost:4200 and verify UI loads
   - Test login flow if implementing authentication changes

3. **Database Connectivity**:
   ```bash
   docker compose ps  # Verify postgres_db is running
   ```

### End-to-End Scenarios
- **User Registration/Login Flow**: Create user, authenticate, access protected resources
- **Data Management**: Create tables, add columns, import/export data
- **API Integration**: Test all REST endpoints via Swagger UI at http://localhost:5000/docs

## Build Time Expectations

**CRITICAL**: Set appropriate timeouts for all build commands. NEVER CANCEL builds.

- **Database startup**: 12 seconds (first run with image pull)
- **Backend dependencies** (`poetry install`): 9 seconds - Set timeout: 180 seconds
- **Frontend dependencies** (`npm install`): 39 seconds - Set timeout: 300 seconds  
- **Frontend build** (`npm run build`): 10 seconds - Set timeout: 120 seconds
- **Frontend dev server startup** (`npm start`): 10 seconds - Set timeout: 120 seconds

## Common Commands

### Development Workflow
```bash
# Start fresh development environment
docker compose up db -d
cd backend/WhereMoney.Api && poetry run python app.py &
cd frontend && npm start &

# Stop all services
pkill -f "python app.py"
pkill -f "ng serve"  
docker compose down
```

### Testing and Linting
```bash
# Frontend linting (if available)
cd frontend && npm run lint

# Backend linting (check pyproject.toml for available commands)
cd backend/WhereMoney.Api && poetry run flake8  # If configured

# Skip unit tests due to current TypeScript errors
```

### Build Verification
```bash
# Test backend build and startup
cd backend/WhereMoney.Api && poetry install && poetry run python app.py

# Test frontend build
cd frontend && npm install && npm run build --configuration development
```

## Project Structure

### Backend (Flask REST API)
- **Location**: `backend/WhereMoney.Api/`
- **Main files**: `app.py` (entry point), `models/` (database), `controllers/` (API routes)
- **Config**: `pyproject.toml` (dependencies), `.env` (environment), `config.py`
- **Key endpoints**: `/docs` (Swagger), `/auth` (authentication), `/users` (user management)

### Frontend (Angular Application)  
- **Location**: `frontend/`
- **Main files**: `src/main.ts` (entry point), `src/app/` (components)
- **Config**: `package.json` (dependencies), `angular.json` (build), `tsconfig.json`
- **Key features**: Material Design, TypeScript, JWT authentication, data grids

### Database (PostgreSQL)
- **Access**: localhost:5432, postgres/postgres
- **Management**: pgAdmin on localhost:5050
- **Models**: User, Table, Column (see `backend/WhereMoney.Api/models/`)

### Docker Configuration
- **Database**: PostgreSQL latest with persistent volume
- **pgAdmin**: Web interface for database management
- **Backend/Frontend**: Build configs available but use local development due to network restrictions

## Troubleshooting

### "Address already in use" Errors
```bash
# Kill running processes
pkill -f "python app.py"
pkill -f "ng serve"
# Or check specific ports
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:4200 | xargs kill -9  # Frontend
```

### Database Connection Issues
```bash
# Restart database container
docker compose restart db
# Check database logs  
docker compose logs db
```

### Poetry Installation Issues
```bash
# Install Poetry via pip if curl fails
pip3 install poetry
```

### Build Cache Issues
```bash
# Clear npm cache
cd frontend && npm cache clean --force
# Clear Angular cache
cd frontend && rm -rf .angular
```

Remember: Always test your changes with the full stack running (database + backend + frontend) to ensure proper integration.