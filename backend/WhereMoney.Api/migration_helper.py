#!/usr/bin/env python3
"""
Migration Helper Script for Flask-SQLAlchemy with Flask-Migrate

This script provides utilities for managing database migrations in your Flask application.
"""

import os
import sys
from flask import Flask
from flask_migrate import Migrate, upgrade, migrate, current, stamp
from models.dbConnector import db
from models.user import User


def create_app():
    """Create Flask app for migration operations"""
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    migrate = Migrate(app, db)
    
    return app


def init_migrations():
    """Initialize migration repository"""
    os.system("flask db init")
    print("✅ Migration repository initialized")


def create_migration(message="Auto migration"):
    """Create a new migration"""
    os.system(f'flask db migrate -m "{message}"')
    print(f"✅ Migration created: {message}")


def apply_migrations():
    """Apply all pending migrations"""
    os.system("flask db upgrade")
    print("✅ All migrations applied")


def rollback_migration():
    """Rollback the last migration"""
    os.system("flask db downgrade")
    print("✅ Last migration rolled back")


def show_migration_history():
    """Show migration history"""
    os.system("flask db history")


def show_current_revision():
    """Show current database revision"""
    os.system("flask db current")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("""
Usage: python migration_helper.py <command> [args]

Commands:
  init                    - Initialize migration repository
  create <message>        - Create new migration with message
  apply                   - Apply all pending migrations
  rollback               - Rollback last migration
  history                - Show migration history
  current                - Show current revision
        """)
        sys.exit(1)
    
    command = sys.argv[1]
    
    # Set Flask app environment
    os.environ['FLASK_APP'] = 'app.py'
    
    if command == "init":
        init_migrations()
    elif command == "create":
        message = sys.argv[2] if len(sys.argv) > 2 else "Auto migration"
        create_migration(message)
    elif command == "apply":
        apply_migrations()
    elif command == "rollback":
        rollback_migration()
    elif command == "history":
        show_migration_history()
    elif command == "current":
        show_current_revision()
    else:
        print(f"Unknown command: {command}")
