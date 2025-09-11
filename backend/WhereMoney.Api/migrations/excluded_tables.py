"""
Configuration for conservative Flask-Migrate behavior.

This configuration ensures that Flask-Migrate only manages tables that are
explicitly defined in SQLAlchemy models, preventing accidental deletion
of manually created tables.
"""

# This file is kept for compatibility but the logic is now handled
# directly in env.py using SQLAlchemy metadata comparison
