#!/usr/bin/env python3
"""
ESIID Data Import Script
Imports meter/service point data from ESIID DATA.xlsx into the database
This is a large dataset with 21,550 records, so we'll import in batches
"""

import pandas as pd
import sqlite3
from pathlib import Path
import time

def import_esiids_to_sqlite():
    """Import ESIID data to SQLite database in batches"""
    
    # Check if Excel file exists
    excel_file = Path("Exports/ESIID DATA.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return False
    
    print(f"📖 Reading ESIID data from {excel_file}")
    print("⚠️ This is a large dataset (21,550 records) - import may take several minutes...")
    
    try:
        # Read Excel file
        start_time = time.time()
        df = pd.read_excel(excel_file)
        read_time = time.time() - start_time
        print(f"📊 Loaded {len(df)} rows from Excel in {read_time:.1f} seconds")
        
        # Basic data cleaning
        print("🧹 Cleaning data...")
        original_count = len(df)
        
        # Remove rows with null account names (these seem to be invalid)
        df = df[df['Account_Name'].notna()]
        df = df[df['Account_Name'] != '']
        
        print(f"📊 After cleaning: {len(df)} valid ESIIDs (removed {original_count - len(df)} invalid records)")
        
        # Connect to SQLite database
        db_path = "2-backend/kilowatt_dev.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create esiids table with comprehensive structure
        print("🏗️ Creating ESIID table...")
        cursor.execute("DROP TABLE IF EXISTS esiids_new")
        
        cursor.execute("""
            CREATE TABLE esiids_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                esiid_id INTEGER UNIQUE,
                account_name TEXT,
                esi_id TEXT,
                service_address_1 TEXT,
                service_address_2 TEXT,
                service_address_3 TEXT,
                description TEXT,
                note TEXT,
                status REAL,
                rep TEXT,
                rep_2 TEXT,
                rep_3 TEXT,
                rep_4 TEXT,
                old_acct TEXT,
                new_acct TEXT,
                rate_plan TEXT,
                esiid_2 TEXT,
                bill_date TEXT,
                bill_date_2 TIMESTAMP,
                bill_date_3 TIMESTAMP,
                lights REAL,
                mo_chg REAL,
                mo_lt_chg REAL,
                base_mo REAL,
                kwh_mo REAL,
                kwh_yr REAL,
                kva REAL,
                load_profile TEXT,
                load TEXT,
                zone TEXT,
                demand REAL,
                demand_2 REAL,
                e_rate_1 REAL,
                e_rate_1_kwh REAL,
                e_charge_1 REAL,
                e_rate_2 REAL,
                e_rate_2_kwh INTEGER,
                e_charge_2 REAL,
                old_fuel_cost_r REAL,
                fuel_cost REAL,
                fuel_f_rate REAL,
                fuel_factor REAL,
                other_1 REAL,
                other_2 REAL,
                e_chg_tot REAL,
                avg_e_kwh REAL,
                tdsp_delivery REAL,
                tdsp_meter_fee REAL,
                tdsp_on_bill REAL,
                tdsp REAL,
                e_tdsp_tot REAL,
                avg_etdsp_kwh REAL,
                tax_cnty REAL,
                tax_city REAL,
                tax_spec REAL,
                tax_st REAL,
                tax_grt REAL,
                tax_puc REAL,
                tax_tot REAL,
                tax2_cnty REAL,
                tax2_city REAL,
                tax2_spec REAL,
                tax2_st REAL,
                tax2_grt REAL,
                tax2_puc REAL,
                tax2_tot REAL,
                est_recovery REAL,
                county_rate REAL,
                city_rate REAL,
                spec_rate REAL,
                state_rate REAL,
                grt_rate REAL,
                puc_rate REAL,
                total_bill REAL,
                account_id INTEGER,
                provider_id INTEGER,
                management_company_id INTEGER,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Import data in batches for better performance
        batch_size = 1000
        imported_count = 0
        total_batches = (len(df) + batch_size - 1) // batch_size
        
        print(f"📥 Importing {len(df)} ESIIDs in {total_batches} batches of {batch_size}...")
        
        for batch_num in range(total_batches):
            start_idx = batch_num * batch_size
            end_idx = min((batch_num + 1) * batch_size, len(df))
            batch_df = df.iloc[start_idx:end_idx]
            
            batch_start_time = time.time()
            
            for index, row in batch_df.iterrows():
                try:
                    cursor.execute("""
                        INSERT INTO esiids_new (
                            esiid_id, account_name, esi_id, service_address_1, service_address_2, service_address_3,
                            description, note, status, rep, rep_2, rep_3, rep_4, old_acct, new_acct, rate_plan,
                            esiid_2, bill_date, lights, mo_chg, mo_lt_chg, base_mo, kwh_mo, kwh_yr, kva,
                            load_profile, load, zone, demand, demand_2, e_rate_1, e_rate_1_kwh, e_charge_1,
                            e_rate_2, e_rate_2_kwh, e_charge_2, fuel_cost, tdsp_delivery, tdsp_meter_fee,
                            tdsp, tax_tot, county_rate, city_rate, state_rate, total_bill
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        int(row['ESIID_ID']) if pd.notna(row['ESIID_ID']) else None,
                        row['Account_Name'] if pd.notna(row['Account_Name']) else None,
                        row['ESI_ID'] if pd.notna(row['ESI_ID']) else None,
                        row['SERVICE ADDRESS 1'] if pd.notna(row['SERVICE ADDRESS 1']) else None,
                        row['SERVICE ADDRESS 2'] if pd.notna(row['SERVICE ADDRESS 2']) else None,
                        row['SERVICE ADDRESS 3'] if pd.notna(row['SERVICE ADDRESS 3']) else None,
                        row['Description'] if pd.notna(row['Description']) else None,
                        row['NOTE'] if pd.notna(row['NOTE']) else None,
                        float(row['STATUS']) if pd.notna(row['STATUS']) else None,
                        row['REP'] if pd.notna(row['REP']) else None,
                        row['REP 2'] if pd.notna(row['REP 2']) else None,
                        row['REP 3'] if pd.notna(row['REP 3']) else None,
                        row['REP 4'] if pd.notna(row['REP 4']) else None,
                        row['OLD_ACCT'] if pd.notna(row['OLD_ACCT']) else None,
                        row['NEW_ACCT'] if pd.notna(row['NEW_ACCT']) else None,
                        row['RATE PLAN'] if pd.notna(row['RATE PLAN']) else None,
                        row['ESIID 2'] if pd.notna(row['ESIID 2']) else None,
                        row['BILL DATE'] if pd.notna(row['BILL DATE']) else None,
                        float(row['LIGHTS']) if pd.notna(row['LIGHTS']) else None,
                        float(row['MO CHG']) if pd.notna(row['MO CHG']) else None,
                        float(row['MO LT CHG']) if pd.notna(row['MO LT CHG']) else None,
                        float(row['BASE MO']) if pd.notna(row['BASE MO']) else None,
                        float(row['kWh Mo']) if pd.notna(row['kWh Mo']) else None,
                        float(row['kWh Yr']) if pd.notna(row['kWh Yr']) else None,
                        float(row['KVA']) if pd.notna(row['KVA']) else None,
                        row['Load Profile'] if pd.notna(row['Load Profile']) else None,
                        row['LOAD'] if pd.notna(row['LOAD']) else None,
                        row['ZONE'] if pd.notna(row['ZONE']) else None,
                        float(row['DEMAND']) if pd.notna(row['DEMAND']) else None,
                        float(row['DEMAND 2']) if pd.notna(row['DEMAND 2']) else None,
                        float(row['E RATE 1']) if pd.notna(row['E RATE 1']) else None,
                        float(row['E RATE 1 KWH']) if pd.notna(row['E RATE 1 KWH']) else None,
                        float(row['E CHARGE 1']) if pd.notna(row['E CHARGE 1']) else None,
                        float(row['E RATE 2']) if pd.notna(row['E RATE 2']) else None,
                        int(row['E RATE 2 KWH']) if pd.notna(row['E RATE 2 KWH']) else None,
                        float(row['E CHARGE 2']) if pd.notna(row['E CHARGE 2']) else None,
                        float(row['FUEL COST']) if pd.notna(row['FUEL COST']) else None,
                        float(row['TDSP DELIVERY']) if pd.notna(row['TDSP DELIVERY']) else None,
                        float(row['TDSP METER FEE']) if pd.notna(row['TDSP METER FEE']) else None,
                        float(row['TDSP']) if pd.notna(row['TDSP']) else None,
                        float(row['TAX TOT']) if pd.notna(row['TAX TOT']) else None,
                        float(row['COUNTY RATE']) if pd.notna(row['COUNTY RATE']) else None,
                        float(row['CITY RATE']) if pd.notna(row['CITY RATE']) else None,
                        float(row['STATE RATE']) if pd.notna(row['STATE RATE']) else None,
                        float(row['TOTAL BILL']) if pd.notna(row['TOTAL BILL']) else None
                    ))
                    imported_count += 1
                    
                except Exception as e:
                    print(f"⚠️ Error importing ESIID {row.get('ESIID_ID', 'Unknown')}: {e}")
                    continue
            
            batch_time = time.time() - batch_start_time
            print(f"📥 Batch {batch_num + 1}/{total_batches}: {len(batch_df)} records in {batch_time:.1f}s (Total: {imported_count})")
        
        # Replace old table with new one
        cursor.execute("DROP TABLE IF EXISTS esiids")
        cursor.execute("ALTER TABLE esiids_new RENAME TO esiids")
        
        # Create indexes for better performance
        print("🔍 Creating indexes...")
        cursor.execute("CREATE INDEX idx_esiids_esi_id ON esiids(esi_id)")
        cursor.execute("CREATE INDEX idx_esiids_account_name ON esiids(account_name)")
        cursor.execute("CREATE INDEX idx_esiids_rep ON esiids(rep)")
        cursor.execute("CREATE INDEX idx_esiids_kwh_mo ON esiids(kwh_mo)")
        cursor.execute("CREATE INDEX idx_esiids_kwh_yr ON esiids(kwh_yr)")
        cursor.execute("CREATE INDEX idx_esiids_total_bill ON esiids(total_bill)")
        
        # Commit changes
        conn.commit()
        total_time = time.time() - start_time
        print(f"✅ Successfully imported {imported_count} ESIIDs in {total_time:.1f} seconds!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("🚀 Starting ESIID Data Import...")
    success = import_esiids_to_sqlite()
    if success:
        print("✅ ESIID import completed successfully!")
    else:
        print("❌ ESIID import failed!")
