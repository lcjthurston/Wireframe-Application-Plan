#!/usr/bin/env python3
"""
Simple Manager Data Import Script
Imports manager data directly into SQLite database
"""

import pandas as pd
import sqlite3
from pathlib import Path

def import_managers_to_sqlite():
    """Import manager data to SQLite database"""
    
    # Check if Excel file exists
    excel_file = Path("Exports/MANAGER LIST.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return False
    
    print(f"📖 Reading manager data from {excel_file}")
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file, sheet_name="MANAGER LIST")
        print(f"📊 Loaded {len(df)} rows from Excel")
        
        # Clean data
        df = df[df['MANAGER'].notna()]
        df = df[df['MANAGER'] != '?']
        df = df[df['MANAGER'].str.strip() != '']
        
        print(f"📊 After cleaning: {len(df)} valid managers")
        
        # Connect to SQLite database
        db_path = "2-backend/kilowatt_dev.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create managers table with new structure
        cursor.execute("""
            DROP TABLE IF EXISTS managers_new
        """)
        
        cursor.execute("""
            CREATE TABLE managers_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mgr_id INTEGER UNIQUE,
                name TEXT NOT NULL,
                mgr_status TEXT,
                mgr_class TEXT,
                management_company TEXT,
                office TEXT,
                office_city TEXT,
                supervisor TEXT,
                admin_assistant TEXT,
                email TEXT,
                assistant_email TEXT,
                phone TEXT,
                cell TEXT,
                fax TEXT,
                mgr_note TEXT,
                last_update TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Import data
        imported_count = 0
        for index, row in df.iterrows():
            try:
                cursor.execute("""
                    INSERT INTO managers_new (
                        mgr_id, name, mgr_status, mgr_class, management_company,
                        office, office_city, supervisor, admin_assistant,
                        email, assistant_email, phone, cell, fax, mgr_note, last_update
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    int(row['MGR_ID']) if pd.notna(row['MGR_ID']) else None,
                    row['MANAGER'],
                    row.get('MGR_STATUS') if pd.notna(row.get('MGR_STATUS')) else None,
                    row.get('MGR_CLASS') if pd.notna(row.get('MGR_CLASS')) else None,
                    row.get('MGMT CO') if pd.notna(row.get('MGMT CO')) else None,
                    row.get('OFFICE') if pd.notna(row.get('OFFICE')) else None,
                    row.get('OFFICE_CITY') if pd.notna(row.get('OFFICE_CITY')) else None,
                    row.get('SUPERVISOR') if pd.notna(row.get('SUPERVISOR')) else None,
                    row.get('ADM_ASST') if pd.notna(row.get('ADM_ASST')) else None,
                    row.get('EMAIL') if pd.notna(row.get('EMAIL')) else None,
                    row.get('ASST_EMAIL') if pd.notna(row.get('ASST_EMAIL')) else None,
                    row.get('PHONE') if pd.notna(row.get('PHONE')) else None,
                    row.get('CELL') if pd.notna(row.get('CELL')) else None,
                    row.get('FAX') if pd.notna(row.get('FAX')) else None,
                    row.get('MGR NOTE') if pd.notna(row.get('MGR NOTE')) else None,
                    str(row.get('UDPATE')) if pd.notna(row.get('UDPATE')) else None
                ))
                imported_count += 1
                
                if imported_count % 100 == 0:
                    print(f"📥 Imported {imported_count} managers...")
                    
            except Exception as e:
                print(f"⚠️ Error importing manager {row.get('MANAGER', 'Unknown')}: {e}")
                continue
        
        # Replace old table with new one
        cursor.execute("DROP TABLE IF EXISTS managers")
        cursor.execute("ALTER TABLE managers_new RENAME TO managers")
        
        # Commit changes
        conn.commit()
        print(f"✅ Successfully imported {imported_count} managers!")
        
        # Show statistics
        cursor.execute("SELECT COUNT(*) FROM managers")
        total_managers = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM managers WHERE email IS NOT NULL AND email != ''")
        with_email = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM managers WHERE phone IS NOT NULL AND phone != ''")
        with_phone = cursor.fetchone()[0]
        
        print(f"\n📊 Import Statistics:")
        print(f"   Total managers: {total_managers}")
        print(f"   With email: {with_email}")
        print(f"   With phone: {with_phone}")
        
        # Show top management companies
        cursor.execute("""
            SELECT management_company, COUNT(*) as count 
            FROM managers 
            WHERE management_company IS NOT NULL 
            GROUP BY management_company 
            ORDER BY count DESC 
            LIMIT 10
        """)
        
        print(f"\n🏢 Top Management Companies:")
        for company, count in cursor.fetchall():
            print(f"   {company}: {count} managers")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Manager Data Import...")
    success = import_managers_to_sqlite()
    if success:
        print("✅ Manager import completed successfully!")
    else:
        print("❌ Manager import failed!")
