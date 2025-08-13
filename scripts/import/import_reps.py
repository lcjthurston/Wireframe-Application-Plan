#!/usr/bin/env python3
"""
REP Data Import Script
Imports energy representative data from REP.xlsx into the database
"""

import pandas as pd
import sqlite3
from pathlib import Path

def import_reps_to_sqlite():
    """Import REP data to SQLite database"""
    
    # Check if Excel file exists
    excel_file = Path("Exports/REP.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return False
    
    print(f"📖 Reading REP data from {excel_file}")
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file)
        print(f"📊 Loaded {len(df)} rows from Excel")
        
        # Clean data - remove rows with null REP names
        df = df[df['REP'].notna()]
        df = df[df['REP'] != '?']  # Remove placeholder entries
        df = df[df['REP'].str.strip() != '']
        
        print(f"📊 After cleaning: {len(df)} valid REPs")
        
        # Connect to SQLite database
        db_path = "2-backend/kilowatt_dev.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create providers table with new structure
        cursor.execute("""
            DROP TABLE IF EXISTS providers_new
        """)
        
        cursor.execute("""
            CREATE TABLE providers_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rep_id INTEGER UNIQUE,
                name TEXT NOT NULL,
                type TEXT DEFAULT 'electricity',
                street_address TEXT,
                city_state_zip TEXT,
                rep_phone TEXT,
                rep_contact TEXT,
                rep_email TEXT,
                rep_note TEXT,
                rep_payment_terms TEXT,
                rep_agreement_date TEXT,
                refund_type TEXT,
                rep_fed_tax_id TEXT,
                rep_tax_payer_number REAL,
                tax_email TEXT,
                tax_fax TEXT,
                tax_mail_address TEXT,
                call_to_check TEXT,
                rep_provided_spreadsheet TEXT,
                rep_provided_forms TEXT,
                cust_provided_spreadsheet TEXT,
                cust_provided_bill_copies TEXT,
                cust_provided_bank_stmts TEXT,
                contact_info TEXT,
                performance_metrics TEXT,
                rep_active REAL,
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
                    INSERT INTO providers_new (
                        rep_id, name, street_address, city_state_zip, rep_phone, rep_contact,
                        rep_email, rep_note, rep_payment_terms, rep_agreement_date, refund_type,
                        rep_fed_tax_id, rep_tax_payer_number, tax_email, tax_fax, tax_mail_address,
                        call_to_check, rep_provided_spreadsheet, rep_provided_forms,
                        cust_provided_spreadsheet, cust_provided_bill_copies, cust_provided_bank_stmts,
                        rep_active
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    int(row['REP_ID']) if pd.notna(row['REP_ID']) else None,
                    row['REP'] if pd.notna(row['REP']) else None,
                    row.get('STREET ADDRESS') if pd.notna(row.get('STREET ADDRESS')) else None,
                    row.get('CITY ST ZIP') if pd.notna(row.get('CITY ST ZIP')) else None,
                    row.get('REP_PHONE') if pd.notna(row.get('REP_PHONE')) else None,
                    row.get('REP_CONTACT') if pd.notna(row.get('REP_CONTACT')) else None,
                    row.get('REP_EMAIL') if pd.notna(row.get('REP_EMAIL')) else None,
                    row.get('REP_NOTE') if pd.notna(row.get('REP_NOTE')) else None,
                    row.get('REP_PYMT_TERMS') if pd.notna(row.get('REP_PYMT_TERMS')) else None,
                    str(row.get('REP_AGMT_DATE')) if pd.notna(row.get('REP_AGMT_DATE')) else None,
                    row.get('REFUND_TYPE') if pd.notna(row.get('REFUND_TYPE')) else None,
                    row.get('REP_FED_TAX_ID') if pd.notna(row.get('REP_FED_TAX_ID')) else None,
                    float(row.get('REP_TAX_PAYER_NUMBER')) if pd.notna(row.get('REP_TAX_PAYER_NUMBER')) else None,
                    row.get('TAX_EMAIL') if pd.notna(row.get('TAX_EMAIL')) else None,
                    row.get('TAX_FAX') if pd.notna(row.get('TAX_FAX')) else None,
                    row.get('TAX_MAIL _ADDRESS') if pd.notna(row.get('TAX_MAIL _ADDRESS')) else None,
                    row.get('CALL_TO_CHECK') if pd.notna(row.get('CALL_TO_CHECK')) else None,
                    row.get('REP_PROVIDED_SPREADSHEET') if pd.notna(row.get('REP_PROVIDED_SPREADSHEET')) else None,
                    row.get('REP_PROVIDED_FORMS') if pd.notna(row.get('REP_PROVIDED_FORMS')) else None,
                    row.get('CUST_PROVIDED_SPREADSHEET') if pd.notna(row.get('CUST_PROVIDED_SPREADSHEET')) else None,
                    row.get('CUST_PROVIDED_BILL_COPIES') if pd.notna(row.get('CUST_PROVIDED_BILL_COPIES')) else None,
                    row.get('CUST_PROVIDED_BANK_STMTS') if pd.notna(row.get('CUST_PROVIDED_BANK_STMTS')) else None,
                    float(row.get('REP_ACTIVE')) if pd.notna(row.get('REP_ACTIVE')) else None
                ))
                imported_count += 1
                
                if imported_count % 25 == 0:
                    print(f"📥 Imported {imported_count} REPs...")
                    
            except Exception as e:
                print(f"⚠️ Error importing REP {row.get('REP', 'Unknown')}: {e}")
                continue
        
        # Replace old table with new one
        cursor.execute("DROP TABLE IF EXISTS providers")
        cursor.execute("ALTER TABLE providers_new RENAME TO providers")
        
        # Commit changes
        conn.commit()
        print(f"✅ Successfully imported {imported_count} REPs!")
        
        # Show statistics
        cursor.execute("SELECT COUNT(*) FROM providers")
        total_reps = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM providers WHERE rep_active = 1")
        active_reps = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM providers WHERE rep_email IS NOT NULL AND rep_email != ''")
        with_email = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM providers WHERE rep_phone IS NOT NULL AND rep_phone != ''")
        with_phone = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM providers WHERE refund_type IS NOT NULL AND refund_type != ''")
        with_refund_type = cursor.fetchone()[0]
        
        print(f"\n📊 Import Statistics:")
        print(f"   Total REPs: {total_reps}")
        print(f"   Active REPs: {active_reps}")
        print(f"   With email: {with_email}")
        print(f"   With phone: {with_phone}")
        print(f"   With refund type: {with_refund_type}")
        
        # Show refund type distribution
        cursor.execute("""
            SELECT refund_type, COUNT(*) as count 
            FROM providers 
            WHERE refund_type IS NOT NULL AND refund_type != ''
            GROUP BY refund_type 
            ORDER BY count DESC 
            LIMIT 10
        """)
        
        print(f"\n📊 Refund Type Distribution:")
        for refund_type, count in cursor.fetchall():
            print(f"   {refund_type}: {count} REPs")
        
        # Show sample active REPs
        cursor.execute("""
            SELECT name, rep_contact, rep_phone, refund_type 
            FROM providers 
            WHERE rep_active = 1 AND name IS NOT NULL
            ORDER BY name
            LIMIT 10
        """)
        
        print(f"\n🔌 Sample Active REPs:")
        for name, contact, phone, refund_type in cursor.fetchall():
            contact_info = f" ({contact})" if contact else ""
            phone_info = f" - {phone}" if phone else ""
            refund_info = f" [{refund_type}]" if refund_type else ""
            print(f"   {name}{contact_info}{phone_info}{refund_info}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting REP Data Import...")
    success = import_reps_to_sqlite()
    if success:
        print("✅ REP import completed successfully!")
    else:
        print("❌ REP import failed!")
