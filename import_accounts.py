#!/usr/bin/env python3
"""
Account Data Import Script
Imports account data from cr187_account_lists.xlsx into the database
This dataset contains 5,481 account records with comprehensive account information
"""

import pandas as pd
import sqlite3
from pathlib import Path
import time

def clean_account_data(df):
    """Clean and prepare account data for import"""
    print("🧹 Cleaning account data...")
    
    # Remove rows with null account names
    original_count = len(df)
    df = df[df['cr187_account_name'].notna()]
    df = df[df['cr187_account_name'] != '']
    
    print(f"📊 After cleaning: {len(df)} valid accounts (removed {original_count - len(df)} invalid records)")
    
    # Convert empty strings to None for optional fields
    optional_fields = [
        'cr187_manager', 'cr187_mgmt_company', 'cr187_procurement_status',
        'cr187_contact', 'cr187_email', 'cr187_telephone', 'cr187_fax',
        'cr187_billing_street', 'cr187_billing_city', 'cr187_billing_state', 
        'cr187_billing_zip', 'cr187_usage', 'cr187_legal_name', 'cr187_fed_tax_id',
        'cr187_load_profile', 'cr187_max_kva', 'cr187_cust_type'
    ]
    
    for col in optional_fields:
        if col in df.columns:
            df[col] = df[col].replace('', None)
            df[col] = df[col].replace('nan', None)
    
    return df

def import_accounts_to_sqlite():
    """Import account data to SQLite database"""
    
    # Check if Excel file exists
    excel_file = Path("Exports/cr187_account_lists.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return False
    
    print(f"📖 Reading account data from {excel_file}")
    print("⚠️ This is a large dataset (5,481 records) - import may take several minutes...")
    
    try:
        # Read Excel file
        start_time = time.time()
        df = pd.read_excel(excel_file)
        read_time = time.time() - start_time
        print(f"📊 Loaded {len(df)} rows from Excel in {read_time:.1f} seconds")
        
        # Clean data
        df = clean_account_data(df)
        
        # Connect to SQLite database
        db_path = "2-backend/kilowatt_dev.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create accounts table with comprehensive structure
        print("🏗️ Creating accounts table...")
        cursor.execute("DROP TABLE IF EXISTS accounts_new")
        
        cursor.execute("""
            CREATE TABLE accounts_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_list_id TEXT UNIQUE,
                account_name TEXT NOT NULL,
                manager_name TEXT,
                management_company TEXT,
                procurement_status TEXT,
                contact_name TEXT,
                email TEXT,
                telephone TEXT,
                fax TEXT,
                billing_street TEXT,
                billing_city TEXT,
                billing_state TEXT,
                billing_zip TEXT,
                legal_name TEXT,
                fed_tax_id TEXT,
                customer_type TEXT,
                usage_kwh REAL,
                load_profile TEXT,
                max_kva REAL,
                activity_date TEXT,
                current_activity TEXT,
                zone_account TEXT,
                usage_date TEXT,
                usage_tdsp REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Import accounts in batches
        batch_size = 500
        total_batches = (len(df) + batch_size - 1) // batch_size
        imported_count = 0
        
        print(f"📥 Importing {len(df)} accounts in {total_batches} batches...")
        
        for batch_num in range(total_batches):
            batch_start_time = time.time()
            start_idx = batch_num * batch_size
            end_idx = min((batch_num + 1) * batch_size, len(df))
            batch_df = df.iloc[start_idx:end_idx]
            
            for index, row in batch_df.iterrows():
                try:
                    cursor.execute("""
                        INSERT INTO accounts_new (
                            account_list_id, account_name, manager_name, management_company,
                            procurement_status, contact_name, email, telephone, fax,
                            billing_street, billing_city, billing_state, billing_zip,
                            legal_name, fed_tax_id, customer_type, usage_kwh, load_profile,
                            max_kva, activity_date, current_activity, zone_account,
                            usage_date, usage_tdsp
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        row['cr187_account_listid'] if pd.notna(row['cr187_account_listid']) else None,
                        row['cr187_account_name'],
                        row['cr187_manager'] if pd.notna(row['cr187_manager']) else None,
                        row['cr187_mgmt_company'] if pd.notna(row['cr187_mgmt_company']) else None,
                        row['cr187_procurement_status'] if pd.notna(row['cr187_procurement_status']) else None,
                        row['cr187_contact'] if pd.notna(row['cr187_contact']) else None,
                        row['cr187_email'] if pd.notna(row['cr187_email']) else None,
                        row['cr187_telephone'] if pd.notna(row['cr187_telephone']) else None,
                        row['cr187_fax'] if pd.notna(row['cr187_fax']) else None,
                        row['cr187_billing_street'] if pd.notna(row['cr187_billing_street']) else None,
                        row['cr187_billing_city'] if pd.notna(row['cr187_billing_city']) else None,
                        row['cr187_billing_state'] if pd.notna(row['cr187_billing_state']) else None,
                        str(row['cr187_billing_zip']) if pd.notna(row['cr187_billing_zip']) else None,
                        row['cr187_legal_name'] if pd.notna(row['cr187_legal_name']) else None,
                        row['cr187_fed_tax_id'] if pd.notna(row['cr187_fed_tax_id']) else None,
                        row['cr187_cust_type'] if pd.notna(row['cr187_cust_type']) else None,
                        float(row['cr187_usage']) if pd.notna(row['cr187_usage']) else None,
                        row['cr187_load_profile'] if pd.notna(row['cr187_load_profile']) else None,
                        float(row['cr187_max_kva']) if pd.notna(row['cr187_max_kva']) else None,
                        str(row['cr187_activity_date']) if pd.notna(row['cr187_activity_date']) else None,
                        row['cr187_current__activity'] if pd.notna(row['cr187_current__activity']) else None,
                        row['cr187_zone_acct'] if pd.notna(row['cr187_zone_acct']) else None,
                        str(row['cr187_usage_date']) if pd.notna(row['cr187_usage_date']) else None,
                        float(row['cr187_usage_tdsp']) if pd.notna(row['cr187_usage_tdsp']) else None
                    ))
                    imported_count += 1
                    
                except Exception as e:
                    print(f"⚠️ Error importing account {row.get('cr187_account_name', 'Unknown')}: {e}")
                    continue
            
            batch_time = time.time() - batch_start_time
            print(f"📥 Batch {batch_num + 1}/{total_batches}: {len(batch_df)} records in {batch_time:.1f}s (Total: {imported_count})")
        
        # Replace old table with new one
        cursor.execute("DROP TABLE IF EXISTS accounts_old")
        try:
            cursor.execute("ALTER TABLE accounts RENAME TO accounts_old")
        except:
            pass  # Table might not exist
        cursor.execute("ALTER TABLE accounts_new RENAME TO accounts")
        
        # Create indexes for better performance
        cursor.execute("CREATE INDEX idx_accounts_name ON accounts(account_name)")
        cursor.execute("CREATE INDEX idx_accounts_manager ON accounts(manager_name)")
        cursor.execute("CREATE INDEX idx_accounts_mgmt_company ON accounts(management_company)")
        cursor.execute("CREATE INDEX idx_accounts_status ON accounts(procurement_status)")
        
        conn.commit()
        conn.close()
        
        total_time = time.time() - start_time
        print(f"✅ Successfully imported {imported_count} accounts in {total_time:.1f} seconds!")
        
        # Show statistics
        print(f"\n📊 Import Statistics:")
        print(f"   Total accounts: {imported_count}")
        print(f"   Average import rate: {imported_count / total_time:.1f} accounts/second")
        
        return True
        
    except Exception as e:
        print(f"❌ Error importing accounts: {e}")
        return False

if __name__ == "__main__":
    success = import_accounts_to_sqlite()
    if success:
        print("\n🎉 Account import completed successfully!")
        print("💡 Next steps:")
        print("   1. Run get_accounts_data.py to export data for frontend")
        print("   2. Update frontend components to use real data")
    else:
        print("\n💥 Account import failed!")
