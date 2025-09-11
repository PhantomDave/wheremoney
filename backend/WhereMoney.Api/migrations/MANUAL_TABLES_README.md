# Flask-Migrate Conservative Configuration

This guide explains how Flask-Migrate is configured to **never delete tables** unless they are explicitly defined in your SQLAlchemy models.

## Overview

The configuration provides automatic protection by:
- **Only managing tables defined in SQLAlchemy models** - Flask-Migrate will only create, modify, or drop tables that have corresponding Python model classes
- **Ignoring all manual tables** - Any table created with raw SQL (`CREATE TABLE IF NOT EXISTS`, etc.) will be completely ignored
- **Preventing accidental data loss** - No manual configuration needed; protection is automatic

## How It Works

### Automatic Protection
The system compares the database schema against your SQLAlchemy model definitions:

- ✅ **Tables WITH SQLAlchemy models**: Fully managed by Flask-Migrate
- 🛡️ **Tables WITHOUT SQLAlchemy models**: Completely ignored and protected

### Your Current Models
Based on your project structure, these tables are managed by Flask-Migrate:
- `users` (from `models/user.py`)
- `tables` (from `models/table.py`) 
- `columns` (from `models/column.py`)
- `widgets` (from `models/widget.py`)

## Creating Manual Tables

You can now safely create any tables without fear of them being dropped:

```sql
-- ✅ Safe: This table will NEVER be touched by Flask-Migrate
CREATE TABLE IF NOT EXISTS analytics_data (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255),
    user_id INTEGER,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Safe: Temporary tables are protected
CREATE TABLE IF NOT EXISTS temp_import_staging (
    id SERIAL PRIMARY KEY,
    raw_data TEXT,
    processed BOOLEAN DEFAULT FALSE
);

-- ✅ Safe: Legacy tables are protected  
CREATE TABLE IF NOT EXISTS legacy_financial_records (
    id INTEGER PRIMARY KEY,
    account_data TEXT,
    migrated_at TIMESTAMP
);
```

## Usage Examples

### Adding a New Managed Table
If you want Flask-Migrate to manage a table, create a SQLAlchemy model:

```python
# models/analytics.py
from models.dbConnector import db

class Analytics(db.Model):
    __tablename__ = 'analytics_data'
    
    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, nullable=True)
    data = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
```

Then import it in `models/__init__.py`:
```python
from . import analytics  # Add this line
```

### Keeping a Table Manual
Simply don't create a SQLAlchemy model for it. Flask-Migrate will ignore it completely.

## Migration Workflow

### Normal Operations
```bash
cd backend/WhereMoney.Api

# Generate migration for SQLAlchemy model changes
poetry run flask db migrate -m "update user model"

# Review the migration - it will ONLY include your modeled tables
poetry run flask db upgrade --dry-run

# Apply migration safely
poetry run flask db upgrade
```

### Verification
Check what tables are managed vs. protected:

```bash
# See what's in your SQLAlchemy models
poetry run python -c "
from app import app
with app.app_context():
    from models.dbConnector import db
    print('Managed tables:', list(db.metadata.tables.keys()))
"
```

## Benefits

### ✅ What This Prevents
- ❌ Accidental deletion of analytics tables
- ❌ Loss of temporary processing data  
- ❌ Dropping legacy integration tables
- ❌ Removing manually created indexes/views
- ❌ Conflicts with external tools creating tables

### ✅ What Still Works
- ✅ Full migration control for your app models
- ✅ Schema changes to `users`, `tables`, `columns`, `widgets`
- ✅ Adding new SQLAlchemy models
- ✅ Normal Flask-Migrate workflows

## Examples by Use Case

### Data Analytics Pipeline
```sql
-- All these are protected automatically
CREATE TABLE IF NOT EXISTS daily_user_metrics (...);
CREATE TABLE IF NOT EXISTS revenue_aggregates (...);
CREATE TABLE IF NOT EXISTS conversion_funnels (...);
```

### ETL/Import Processing  
```sql
-- Staging and processing tables are safe
CREATE TABLE IF NOT EXISTS import_staging_users (...);
CREATE TABLE IF NOT EXISTS data_quality_checks (...);
CREATE TABLE IF NOT EXISTS processing_errors (...);
```

### Integration with External Systems
```sql
-- Tables created by other services are protected
CREATE TABLE IF NOT EXISTS external_api_cache (...);
CREATE TABLE IF NOT EXISTS third_party_webhooks (...);
CREATE TABLE IF NOT EXISTS legacy_system_sync (...);
```

## Troubleshooting

### "My manual table was included in migration"
**Cause**: You may have created a SQLAlchemy model for it
**Solution**: Remove the model class and regenerate the migration

### "I want to start managing a manual table"
**Solution**: Create a SQLAlchemy model that matches the existing schema

### "Migration is trying to create a table that exists"
**Cause**: The table exists manually but now you've added a model
**Solution**: Either drop the manual table first, or mark the migration as applied: `poetry run flask db stamp head`

## Summary

With this configuration:
- 🛡️ **Zero configuration needed** - protection is automatic
- 🛡️ **Manual tables are completely safe** - never touched by migrations  
- 🛡️ **SQLAlchemy models work normally** - full migration control where needed
- 🛡️ **No risk of data loss** - conservative by default

You can create any manual tables with confidence that Flask-Migrate will never interfere with them.
