import os
from pathlib import Path

# Try to load .env if python-dotenv is available
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
except Exception:
    # python-dotenv not installed or failed to load; fall back to environment variables
    pass


class Config:
    """Base configuration - reads from environment variables with sensible defaults."""

    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')

    # Database URL: use DATABASE_URL if provided, otherwise a local sqlite file
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f"sqlite:///{Path(__file__).parent / 'data.db'}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask-Migrate / Alembic
    MIGRATIONS_DIR = os.getenv('MIGRATIONS_DIR', 'migrations')

    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')

    # Debug
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('1', 'true', 'yes')

    @staticmethod
    def init_app(app):
        """Placeholder for any app-specific initialization."""
        # e.g. configure logging handlers here
        return None


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig,
}

