#!/usr/bin/env python3
"""
Check database table structures for analytics
"""

import sqlite3
from pathlib import Path

def check_table_structures():
    """Check the structure of all tables in the database"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get all table names
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print("📋 DATABASE TABLE STRUCTURES")
        print("=" * 60)
        
        for table_name, in tables:
            print(f"\n🗂️ Table: {table_name}")
            
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            print(f"   Columns ({len(columns)}):")
            for col_id, col_name, col_type, not_null, default_val, primary_key in columns:
                pk_indicator = " (PK)" if primary_key else ""
                null_indicator = " NOT NULL" if not_null else ""
                default_indicator = f" DEFAULT {default_val}" if default_val else ""
                print(f"     {col_name}: {col_type}{pk_indicator}{null_indicator}{default_indicator}")
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            row_count = cursor.fetchone()[0]
            print(f"   Rows: {row_count:,}")
            
            # Show sample data for key tables
            if table_name in ['esiids', 'daily_pricing', 'commissions', 'accounts']:
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
                sample_rows = cursor.fetchall()
                if sample_rows:
                    print(f"   Sample data:")
                    for i, row in enumerate(sample_rows, 1):
                        print(f"     Row {i}: {row[:5]}..." if len(row) > 5 else f"     Row {i}: {row}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error checking tables: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    check_table_structures()
