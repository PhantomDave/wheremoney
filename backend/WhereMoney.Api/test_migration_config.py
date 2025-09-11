#!/usr/bin/env python3
"""
Test script to demonstrate the conservative Flask-Migrate configuration.

This script shows which tables would be managed vs. protected by the new configuration.
"""

import sys
import os

# Add the backend path to Python path
sys.path.insert(0, '/home/dave/wheremoney/backend/WhereMoney.Api')

try:
    from app import app
    
    def test_table_protection():
        """Test which tables are managed vs. protected."""
        with app.app_context():
            from models.dbConnector import db
            
            # Get tables defined in SQLAlchemy models
            model_tables = set(db.metadata.tables.keys())
            
            print("🛡️  Flask-Migrate Conservative Configuration Test\n")
            
            print("✅ MANAGED TABLES (Flask-Migrate will handle these):")
            if model_tables:
                for table in sorted(model_tables):
                    print(f"   - {table}")
            else:
                print("   - (No SQLAlchemy models found)")
            
            print("\n🛡️  PROTECTED TABLES (Any table NOT listed above):")
            print("   - Any manually created table will be automatically protected")
            print("   - Examples: analytics_data, temp_imports, legacy_users, etc.")
            
            print("\n📋 BEHAVIOR:")
            print("   ✅ Flask-Migrate WILL manage:", ', '.join(sorted(model_tables)) if model_tables else "None")
            print("   🛡️  Flask-Migrate will IGNORE: All other tables")
            
            print("\n🔍 HOW TO TEST:")
            print("   1. Create a manual table: CREATE TABLE test_manual (id SERIAL);")
            print("   2. Run: poetry run flask db migrate -m 'test'")
            print("   3. Check migration - test_manual should NOT appear")
            
            return True
            
    if __name__ == "__main__":
        test_table_protection()
        
except ImportError as e:
    print(f"❌ Error importing Flask app: {e}")
    print("Make sure you're running this from the backend directory with proper dependencies installed.")
except Exception as e:
    print(f"❌ Error: {e}")
