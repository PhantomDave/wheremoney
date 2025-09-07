#!/usr/bin/env python3
"""
Direct migration script that bypasses Flask CLI issues
"""

import os
import sys
from flask_migrate import init, migrate, upgrade, downgrade, history, current

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the app directly
from app import app

def run_migration_command(command, message=None):
    """Run migration commands within the app context"""
    with app.app_context():
        if command == "init":
            init()
            print("✅ Migration repository initialized")
        elif command == "migrate":
            if message:
                migrate(message=message)
            else:
                migrate()
            print(f"✅ Migration created: {message or 'Auto migration'}")
        elif command == "upgrade":
            upgrade()
            print("✅ All migrations applied")
        elif command == "downgrade":
            downgrade()
            print("✅ Last migration rolled back")
        elif command == "history":
            history()
        elif command == "current":
            current()
        else:
            print(f"Unknown command: {command}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("""
Usage: python migrate.py <command> [message]

Commands:
  init                    - Initialize migration repository
  migrate [message]       - Create new migration
  upgrade                 - Apply all pending migrations
  downgrade              - Rollback last migration
  history                - Show migration history
  current                - Show current revision

Examples:
  python migrate.py migrate "add column model"
  python migrate.py upgrade
        """)
        sys.exit(1)

    command = sys.argv[1]
    message = sys.argv[2] if len(sys.argv) > 2 else None

    run_migration_command(command, message)
