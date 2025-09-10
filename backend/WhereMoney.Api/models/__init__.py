"""Models package initializer.

Importing the model modules here ensures they are evaluated and their
Table objects are registered on SQLAlchemy's metadata. This lets
Alembic/Flask-Migrate autogenerate detect schema changes without
needing model imports scattered across the codebase.
"""

from .dbConnector import db

# Import all model modules so their classes register against `db.metadata`.
# Keep these as module imports (not `from .module import Name`) to avoid
# potential NameErrors if class names differ or are refactored.
from . import user
from . import table
from . import column
from . import widget

__all__ = ["db", "user", "table", "column", "widget"]
