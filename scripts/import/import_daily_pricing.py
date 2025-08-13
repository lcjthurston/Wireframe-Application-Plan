#!/usr/bin/env python3
"""
Daily Pricing Data Import Script
Imports pricing data from DAILY PRICING - new.xlsx into the database
This is a large dataset with 25,081 records, so we'll import in batches
"""

import pandas as pd
import sqlite3
from pathlib import Path
import time

def import_daily_pricing_to_sqlite():
    """Import daily pricing data to SQLite database in batches"""
    
    # Check if Excel file exists
    excel_file = Path("Exports/DAILY PRICING - new.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return False
    
    print(f"📖 Reading daily pricing data from {excel_file}")
    print("⚠️ This is a large dataset (25,081 records) - import may take several minutes...")
    
    try:
        # Read Excel file
        start_time = time.time()
        df = pd.read_excel(excel_file)
        read_time = time.time() - start_time
        print(f"📊 Loaded {len(df)} rows from Excel in {read_time:.1f} seconds")
        
        # Basic data cleaning
        print("🧹 Cleaning data...")
        original_count = len(df)
        
        # Remove rows with null REP1 (these seem to be invalid)
        df = df[df['REP1'].notna()]
        df = df[df['REP1'] != '']
        
        print(f"📊 After cleaning: {len(df)} valid pricing records (removed {original_count - len(df)} invalid records)")
        
        # Connect to SQLite database
        db_path = "2-backend/kilowatt_dev.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create daily_pricing table
        print("🏗️ Creating daily pricing table...")
        cursor.execute("DROP TABLE IF EXISTS daily_pricing_new")
        
        cursor.execute("""
            CREATE TABLE daily_pricing_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pricing_id INTEGER UNIQUE,
                price_date TIMESTAMP,
                effective_date TIMESTAMP,
                zone TEXT,
                load_profile TEXT,
                rep TEXT,
                term_months REAL,
                min_mwh REAL,
                max_mwh REAL,
                max_meters REAL,
                daily_no_ruc REAL,
                ruc_nodal REAL,
                daily_rate REAL,
                commercial_discount REAL,
                hoa_discount REAL,
                broker_fee REAL,
                meter_fee REAL,
                provider_id INTEGER,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Import data in batches for better performance
        batch_size = 1000
        imported_count = 0
        total_batches = (len(df) + batch_size - 1) // batch_size
        
        print(f"📥 Importing {len(df)} pricing records in {total_batches} batches of {batch_size}...")
        
        for batch_num in range(total_batches):
            start_idx = batch_num * batch_size
            end_idx = min((batch_num + 1) * batch_size, len(df))
            batch_df = df.iloc[start_idx:end_idx]
            
            batch_start_time = time.time()
            
            for index, row in batch_df.iterrows():
                try:
                    # Parse dates
                    price_date = None
                    effective_date = None
                    
                    if pd.notna(row.get('Price_Date')):
                        try:
                            price_date = pd.to_datetime(row['Price_Date']).strftime('%Y-%m-%d %H:%M:%S')
                        except:
                            pass
                    
                    if pd.notna(row.get('Date')):
                        try:
                            effective_date = pd.to_datetime(row['Date']).strftime('%Y-%m-%d %H:%M:%S')
                        except:
                            pass
                    
                    cursor.execute("""
                        INSERT INTO daily_pricing_new (
                            pricing_id, price_date, effective_date, zone, load_profile, rep,
                            term_months, min_mwh, max_mwh, max_meters, daily_no_ruc, ruc_nodal,
                            daily_rate, commercial_discount, hoa_discount, broker_fee, meter_fee
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        int(row['ID']) if pd.notna(row['ID']) else None,
                        price_date,
                        effective_date,
                        row['Zone'] if pd.notna(row['Zone']) else None,
                        row['Load'] if pd.notna(row['Load']) else None,
                        row['REP1'] if pd.notna(row['REP1']) else None,
                        float(row['Term']) if pd.notna(row['Term']) else None,
                        float(row['Min_MWh']) if pd.notna(row['Min_MWh']) else None,
                        float(row['Max_MWh']) if pd.notna(row['Max_MWh']) else None,
                        float(row['Max_Meters']) if pd.notna(row['Max_Meters']) else None,
                        float(row['Daily_No_Ruc']) if pd.notna(row['Daily_No_Ruc']) else None,
                        float(row['RUC_Nodal']) if pd.notna(row['RUC_Nodal']) else None,
                        float(row['Daily']) if pd.notna(row['Daily']) else None,
                        float(row['Com_Disc']) if pd.notna(row['Com_Disc']) else None,
                        float(row['HOA_Disc']) if pd.notna(row['HOA_Disc']) else None,
                        float(row['Broker_Fee']) if pd.notna(row['Broker_Fee']) else None,
                        float(row['Meter_Fee']) if pd.notna(row['Meter_Fee']) else None
                    ))
                    imported_count += 1
                    
                except Exception as e:
                    print(f"⚠️ Error importing pricing record {row.get('ID', 'Unknown')}: {e}")
                    continue
            
            batch_time = time.time() - batch_start_time
            print(f"📥 Batch {batch_num + 1}/{total_batches}: {len(batch_df)} records in {batch_time:.1f}s (Total: {imported_count})")
        
        # Replace old table with new one
        cursor.execute("DROP TABLE IF EXISTS daily_pricing")
        cursor.execute("ALTER TABLE daily_pricing_new RENAME TO daily_pricing")
        
        # Create indexes for better performance
        print("🔍 Creating indexes...")
        cursor.execute("CREATE INDEX idx_pricing_effective_date ON daily_pricing(effective_date)")
        cursor.execute("CREATE INDEX idx_pricing_zone ON daily_pricing(zone)")
        cursor.execute("CREATE INDEX idx_pricing_rep ON daily_pricing(rep)")
        cursor.execute("CREATE INDEX idx_pricing_daily_rate ON daily_pricing(daily_rate)")
        cursor.execute("CREATE INDEX idx_pricing_date_zone ON daily_pricing(effective_date, zone)")
        cursor.execute("CREATE INDEX idx_pricing_rep_zone ON daily_pricing(rep, zone)")
        
        # Commit changes
        conn.commit()
        total_time = time.time() - start_time
        print(f"✅ Successfully imported {imported_count} pricing records in {total_time:.1f} seconds!")
        
        # Show statistics
        cursor.execute("SELECT COUNT(*) FROM daily_pricing")
        total_records = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT zone) FROM daily_pricing WHERE zone IS NOT NULL")
        unique_zones = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT rep) FROM daily_pricing WHERE rep IS NOT NULL")
        unique_reps = cursor.fetchone()[0]
        
        cursor.execute("SELECT AVG(daily_rate), MIN(daily_rate), MAX(daily_rate) FROM daily_pricing WHERE daily_rate IS NOT NULL")
        rate_stats = cursor.fetchone()
        
        print(f"\n📊 Import Statistics:")
        print(f"   Total pricing records: {total_records}")
        print(f"   Unique zones: {unique_zones}")
        print(f"   Unique REPs: {unique_reps}")
        if rate_stats:
            avg_rate, min_rate, max_rate = rate_stats
            print(f"   Average daily rate: ${avg_rate:.2f}")
            print(f"   Rate range: ${min_rate:.2f} - ${max_rate:.2f}")
        
        # Show zone distribution
        cursor.execute("""
            SELECT zone, COUNT(*) as count, AVG(daily_rate) as avg_rate
            FROM daily_pricing 
            WHERE zone IS NOT NULL AND daily_rate IS NOT NULL
            GROUP BY zone 
            ORDER BY count DESC 
            LIMIT 10
        """)
        
        print(f"\n📊 Zone Distribution:")
        for zone, count, avg_rate in cursor.fetchall():
            print(f"   {zone}: {count} records (avg rate: ${avg_rate:.2f})")
        
        # Show REP distribution
        cursor.execute("""
            SELECT rep, COUNT(*) as count, AVG(daily_rate) as avg_rate
            FROM daily_pricing 
            WHERE rep IS NOT NULL AND daily_rate IS NOT NULL
            GROUP BY rep 
            ORDER BY count DESC 
            LIMIT 10
        """)
        
        print(f"\n🔌 REP Distribution:")
        for rep, count, avg_rate in cursor.fetchall():
            print(f"   {rep}: {count} records (avg rate: ${avg_rate:.2f})")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("🚀 Starting Daily Pricing Data Import...")
    success = import_daily_pricing_to_sqlite()
    if success:
        print("✅ Daily pricing import completed successfully!")
    else:
        print("❌ Daily pricing import failed!")
