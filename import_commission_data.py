#!/usr/bin/env python3
"""
Commission Data Import Script
Imports commission data from both COMMISSION RECEIVED.xlsx and COMMISSION SCHEDULE.xlsx
"""

import pandas as pd
import sqlite3
from pathlib import Path
import json
from datetime import datetime

def import_commission_received(cursor):
    """Import COMMISSION RECEIVED.xlsx data"""
    
    excel_file = Path("Exports/COMMISSION RECEIVED.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return 0
    
    print(f"📖 Reading COMMISSION RECEIVED data from {excel_file}")
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file)
        print(f"📊 Loaded {len(df)} commission received records")
        
        # Clean data
        df = df[df['Acct_Name'].notna()]
        df = df[df['Acct_Name'] != '']
        
        print(f"📊 After cleaning: {len(df)} valid commission received records")
        
        imported_count = 0
        for index, row in df.iterrows():
            try:
                # Parse payment date
                payment_date = None
                if pd.notna(row.get('Act_PYMT_Date')):
                    try:
                        payment_date = pd.to_datetime(row['Act_PYMT_Date']).strftime('%Y-%m-%d %H:%M:%S')
                    except:
                        pass
                
                cursor.execute("""
                    INSERT INTO commissions_new (
                        commission_sched_id, account_name, k_rep, commission_type,
                        actual_payment_amount, actual_payment_received, actual_payment_date,
                        actual_mils, payment_type, is_active
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    int(row['COMM_SCHED_ID']) if pd.notna(row['COMM_SCHED_ID']) else None,
                    row['Acct_Name'] if pd.notna(row['Acct_Name']) else None,
                    row['K_REP'] if pd.notna(row['K_REP']) else None,
                    'received',
                    float(row['Act_PYMT_Amt']) if pd.notna(row['Act_PYMT_Amt']) else None,
                    float(row['Act_PYMT_Recvd']) if pd.notna(row['Act_PYMT_Recvd']) else None,
                    payment_date,
                    float(row['Act_Mils']) if pd.notna(row['Act_Mils']) else None,
                    row['Pymt_Type'] if pd.notna(row['Pymt_Type']) else None,
                    1
                ))
                imported_count += 1
                
                if imported_count % 100 == 0:
                    print(f"📥 Imported {imported_count} commission received records...")
                    
            except Exception as e:
                print(f"⚠️ Error importing commission received {row.get('COMM_SCHED_ID', 'Unknown')}: {e}")
                continue
        
        print(f"✅ Successfully imported {imported_count} commission received records!")
        return imported_count
        
    except Exception as e:
        print(f"❌ Error importing commission received: {e}")
        return 0

def import_commission_schedule(cursor):
    """Import COMMISSION SCHEDULE.xlsx data"""
    
    excel_file = Path("Exports/COMMISSION SCHEDULE.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return 0
    
    print(f"📖 Reading COMMISSION SCHEDULE data from {excel_file}")
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file)
        print(f"📊 Loaded {len(df)} commission schedule records")
        
        # Clean data
        df = df[df['Acct_Name'].notna()]
        df = df[df['Acct_Name'] != '']
        
        print(f"📊 After cleaning: {len(df)} valid commission schedule records")
        
        imported_count = 0
        for index, row in df.iterrows():
            try:
                # Parse dates
                contract_date = None
                start_date = None
                end_date = None
                
                if pd.notna(row.get('Con_Date')):
                    try:
                        contract_date = pd.to_datetime(row['Con_Date']).strftime('%Y-%m-%d %H:%M:%S')
                    except:
                        pass
                
                if pd.notna(row.get('Start')):
                    try:
                        start_date = pd.to_datetime(row['Start']).strftime('%Y-%m-%d %H:%M:%S')
                    except:
                        pass
                
                if pd.notna(row.get('End')):
                    try:
                        end_date = pd.to_datetime(row['End']).strftime('%Y-%m-%d %H:%M:%S')
                    except:
                        pass
                
                # Extract monthly scheduled amounts (non-R columns)
                monthly_scheduled = {}
                monthly_received = {}
                
                for col in df.columns:
                    if col.endswith(' R') and col != 'Feb 22R':  # Received columns
                        if pd.notna(row[col]) and row[col] != 0:
                            monthly_received[col] = float(row[col])
                    elif any(month in col for month in ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']) and not col.endswith(' R'):
                        if pd.notna(row[col]) and row[col] != 0:
                            try:
                                monthly_scheduled[col] = float(row[col])
                            except:
                                monthly_scheduled[col] = str(row[col])
                
                cursor.execute("""
                    INSERT INTO commissions_new (
                        commission_sched_id, account_name, k_rep, commission_type,
                        contract_date, start_date, end_date, is_active, is_currently_active,
                        annual_amount, contracted_amount, monthly_scheduled, monthly_received
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    int(row['COMM_SCHED_ID']) if pd.notna(row['COMM_SCHED_ID']) else None,
                    row['Acct_Name'] if pd.notna(row['Acct_Name']) else None,
                    row['K_REP'] if pd.notna(row['K_REP']) else None,
                    'scheduled',
                    contract_date,
                    start_date,
                    end_date,
                    bool(row['Active']) if pd.notna(row['Active']) else True,
                    bool(row['CActive']) if pd.notna(row['CActive']) else None,
                    str(row['Annual']) if pd.notna(row['Annual']) else None,
                    str(row['Contracted']) if pd.notna(row['Contracted']) else None,
                    json.dumps(monthly_scheduled) if monthly_scheduled else None,
                    json.dumps(monthly_received) if monthly_received else None
                ))
                imported_count += 1
                
                if imported_count % 500 == 0:
                    print(f"📥 Imported {imported_count} commission schedule records...")
                    
            except Exception as e:
                print(f"⚠️ Error importing commission schedule {row.get('COMM_SCHED_ID', 'Unknown')}: {e}")
                continue
        
        print(f"✅ Successfully imported {imported_count} commission schedule records!")
        return imported_count
        
    except Exception as e:
        print(f"❌ Error importing commission schedule: {e}")
        return 0

def import_commission_data():
    """Import both commission data files to SQLite database"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🚀 STARTING COMMISSION DATA IMPORT")
        print("=" * 50)
        
        # Create new commissions table
        print("🏗️ Creating commission table...")
        cursor.execute("DROP TABLE IF EXISTS commissions_new")
        
        cursor.execute("""
            CREATE TABLE commissions_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                commission_sched_id INTEGER UNIQUE,
                account_name TEXT,
                k_rep TEXT,
                commission_type TEXT NOT NULL,
                actual_payment_amount DECIMAL(12,2),
                actual_payment_received DECIMAL(12,2),
                actual_payment_date TIMESTAMP,
                actual_mils REAL,
                payment_type TEXT,
                contract_date TIMESTAMP,
                start_date TIMESTAMP,
                end_date TIMESTAMP,
                is_active BOOLEAN DEFAULT 1,
                is_currently_active BOOLEAN,
                annual_amount TEXT,
                contracted_amount TEXT,
                monthly_scheduled TEXT,
                monthly_received TEXT,
                manager_id INTEGER,
                account_id INTEGER,
                provider_id INTEGER,
                amount DECIMAL(10,2),
                status TEXT DEFAULT 'pending',
                payment_date TIMESTAMP,
                notes TEXT,
                commission_metadata TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Import commission received data
        received_count = import_commission_received(cursor)
        
        # Import commission schedule data
        schedule_count = import_commission_schedule(cursor)
        
        # Replace old table with new one
        cursor.execute("DROP TABLE IF EXISTS commissions")
        cursor.execute("ALTER TABLE commissions_new RENAME TO commissions")
        
        # Create indexes
        print("🔍 Creating indexes...")
        cursor.execute("CREATE INDEX idx_commissions_account_name ON commissions(account_name)")
        cursor.execute("CREATE INDEX idx_commissions_k_rep ON commissions(k_rep)")
        cursor.execute("CREATE INDEX idx_commissions_type ON commissions(commission_type)")
        cursor.execute("CREATE INDEX idx_commissions_payment_date ON commissions(actual_payment_date)")
        cursor.execute("CREATE INDEX idx_commissions_active ON commissions(is_active)")
        
        # Commit changes
        conn.commit()
        
        total_imported = received_count + schedule_count
        print(f"\n✅ COMMISSION IMPORT COMPLETED!")
        print(f"   Commission received: {received_count}")
        print(f"   Commission scheduled: {schedule_count}")
        print(f"   Total imported: {total_imported}")
        
        # Show statistics
        cursor.execute("SELECT COUNT(*) FROM commissions WHERE commission_type = 'received'")
        total_received = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM commissions WHERE commission_type = 'scheduled'")
        total_scheduled = cursor.fetchone()[0]
        
        cursor.execute("SELECT SUM(actual_payment_amount) FROM commissions WHERE commission_type = 'received'")
        total_received_amount = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT COUNT(*) FROM commissions WHERE commission_type = 'scheduled' AND is_active = 1")
        active_schedules = cursor.fetchone()[0]
        
        print(f"\n📊 Commission Statistics:")
        print(f"   Total received commissions: {total_received}")
        print(f"   Total scheduled commissions: {total_scheduled}")
        print(f"   Total received amount: ${total_received_amount:,.2f}")
        print(f"   Active schedules: {active_schedules}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    print("🚀 Starting Commission Data Import...")
    success = import_commission_data()
    if success:
        print("✅ Commission import completed successfully!")
    else:
        print("❌ Commission import failed!")
