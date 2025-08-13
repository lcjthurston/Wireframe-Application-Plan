#!/usr/bin/env python3
"""
Management Company Data Import Script
Imports company data from MGMT COMPANIES.xlsx into the database
"""

import pandas as pd
import sqlite3
from pathlib import Path
from datetime import datetime

def import_companies_to_sqlite():
    """Import management company data to SQLite database"""
    
    # Check if Excel file exists
    excel_file = Path("Exports/MGMT COMPANIES.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return False
    
    print(f"📖 Reading company data from {excel_file}")
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file)
        print(f"📊 Loaded {len(df)} rows from Excel")
        
        # Clean data
        df = df[df['MGMT_CO'].notna()]
        df = df[df['MANAGEMENT CO'].notna()]
        
        print(f"📊 After cleaning: {len(df)} valid companies")
        
        # Connect to SQLite database
        db_path = "2-backend/kilowatt_dev.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create management_companies table
        cursor.execute("""
            DROP TABLE IF EXISTS management_companies_new
        """)
        
        cursor.execute("""
            CREATE TABLE management_companies_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mgmt_co_id INTEGER UNIQUE,
                mgmt_co_code TEXT UNIQUE,
                company_name TEXT NOT NULL,
                mgmt_status TEXT,
                data_contact TEXT,
                office_street TEXT,
                office_city_state_zip TEXT,
                office_phone TEXT,
                office_fax TEXT,
                billing_street TEXT,
                billing_city TEXT,
                billing_state TEXT,
                billing_zip TEXT,
                billing_phone TEXT,
                billing_fax TEXT,
                billing_email TEXT,
                follow_up TIMESTAMP,
                priority REAL,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Import data
        imported_count = 0
        for index, row in df.iterrows():
            try:
                # Handle follow_up date
                follow_up = None
                if pd.notna(row.get('FOLLOW UP')):
                    try:
                        follow_up = row['FOLLOW UP'].strftime('%Y-%m-%d %H:%M:%S')
                    except:
                        follow_up = None
                
                cursor.execute("""
                    INSERT INTO management_companies_new (
                        mgmt_co_id, mgmt_co_code, company_name, mgmt_status, data_contact,
                        office_street, office_city_state_zip, office_phone, office_fax,
                        billing_street, billing_city, billing_state, billing_zip,
                        billing_phone, billing_fax, billing_email, follow_up, priority
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    int(row['MGMT_CO_ID']) if pd.notna(row['MGMT_CO_ID']) else None,
                    row['MGMT_CO'] if pd.notna(row['MGMT_CO']) else None,
                    row['MANAGEMENT CO'] if pd.notna(row['MANAGEMENT CO']) else None,
                    row.get('MGMT STATUS') if pd.notna(row.get('MGMT STATUS')) else None,
                    row.get('DATA CONTACT') if pd.notna(row.get('DATA CONTACT')) else None,
                    row.get('OFFICE STREET') if pd.notna(row.get('OFFICE STREET')) else None,
                    row.get('OFFICE CITY, STATE, ZIP') if pd.notna(row.get('OFFICE CITY, STATE, ZIP')) else None,
                    row.get('OFFICE TEL') if pd.notna(row.get('OFFICE TEL')) else None,
                    row.get('OFFICE FAX') if pd.notna(row.get('OFFICE FAX')) else None,
                    row.get('BILLING STREET') if pd.notna(row.get('BILLING STREET')) else None,
                    row.get('BILLING CITY') if pd.notna(row.get('BILLING CITY')) else None,
                    row.get('BILLING STATE') if pd.notna(row.get('BILLING STATE')) else None,
                    row.get('BILLING ZIP') if pd.notna(row.get('BILLING ZIP')) else None,
                    row.get('BILLING TEL') if pd.notna(row.get('BILLING TEL')) else None,
                    row.get('BILLING FAX') if pd.notna(row.get('BILLING FAX')) else None,
                    row.get('BILL EMAIL') if pd.notna(row.get('BILL EMAIL')) else None,
                    follow_up,
                    float(row.get('PRIORITY')) if pd.notna(row.get('PRIORITY')) else None
                ))
                imported_count += 1
                
                if imported_count % 50 == 0:
                    print(f"📥 Imported {imported_count} companies...")
                    
            except Exception as e:
                print(f"⚠️ Error importing company {row.get('MANAGEMENT CO', 'Unknown')}: {e}")
                continue
        
        # Replace old table with new one
        cursor.execute("DROP TABLE IF EXISTS management_companies")
        cursor.execute("ALTER TABLE management_companies_new RENAME TO management_companies")
        
        # Commit changes
        conn.commit()
        print(f"✅ Successfully imported {imported_count} companies!")
        
        # Show statistics
        cursor.execute("SELECT COUNT(*) FROM management_companies")
        total_companies = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM management_companies WHERE billing_email IS NOT NULL AND billing_email != ''")
        with_email = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM management_companies WHERE office_phone IS NOT NULL AND office_phone != ''")
        with_phone = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM management_companies WHERE mgmt_status LIKE '%ACTIVE%'")
        active_companies = cursor.fetchone()[0]
        
        print(f"\n📊 Import Statistics:")
        print(f"   Total companies: {total_companies}")
        print(f"   Active companies: {active_companies}")
        print(f"   With email: {with_email}")
        print(f"   With phone: {with_phone}")
        
        # Show top company statuses
        cursor.execute("""
            SELECT mgmt_status, COUNT(*) as count 
            FROM management_companies 
            WHERE mgmt_status IS NOT NULL 
            GROUP BY mgmt_status 
            ORDER BY count DESC 
            LIMIT 10
        """)
        
        print(f"\n📊 Company Status Distribution:")
        for status, count in cursor.fetchall():
            print(f"   {status}: {count} companies")
        
        # Show sample companies
        cursor.execute("""
            SELECT company_name, mgmt_co_code, mgmt_status 
            FROM management_companies 
            WHERE mgmt_status LIKE '%ACTIVE%'
            LIMIT 5
        """)
        
        print(f"\n🏢 Sample Active Companies:")
        for name, code, status in cursor.fetchall():
            print(f"   {code}: {name} ({status})")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Management Company Data Import...")
    success = import_companies_to_sqlite()
    if success:
        print("✅ Company import completed successfully!")
    else:
        print("❌ Company import failed!")
