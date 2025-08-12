#!/usr/bin/env python3
"""
Quick script to check what's in the SQLite database
"""

import sqlite3
from pathlib import Path

def check_database():
    """Check the contents of the SQLite database"""
    
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return
    
    print(f"📊 Checking database: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"\n📋 Tables in database:")
        for (table_name,) in tables:
            print(f"   - {table_name}")
        
        # Check managers table specifically
        if any('managers' in table for table in tables):
            print(f"\n👥 Managers table:")
            
            # Get table schema
            cursor.execute("PRAGMA table_info(managers);")
            columns = cursor.fetchall()
            print(f"   Columns: {len(columns)}")
            for col in columns:
                print(f"     - {col[1]} ({col[2]})")
            
            # Get row count
            cursor.execute("SELECT COUNT(*) FROM managers;")
            count = cursor.fetchone()[0]
            print(f"   Total managers: {count}")
            
            # Get sample data
            cursor.execute("SELECT name, management_company, office_city FROM managers LIMIT 5;")
            samples = cursor.fetchall()
            print(f"   Sample data:")
            for name, company, city in samples:
                print(f"     - {name} | {company} | {city}")
        
        # Check other tables
        for (table_name,) in tables:
            if table_name != 'managers' and not table_name.startswith('sqlite_'):
                cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
                count = cursor.fetchone()[0]
                print(f"\n📊 {table_name}: {count} records")
        
    except Exception as e:
        print(f"❌ Error checking database: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_database()
