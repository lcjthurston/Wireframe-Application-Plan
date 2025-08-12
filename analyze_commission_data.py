#!/usr/bin/env python3
"""
Analyze Commission Data structure for database model design
Examines both COMMISSION RECEIVED.xlsx and COMMISSION SCHEDULE.xlsx
"""

import pandas as pd
from pathlib import Path

def analyze_commission_file(file_path, file_name):
    """Analyze a single commission Excel file"""
    
    if not file_path.exists():
        print(f"❌ Excel file not found: {file_path}")
        return False
    
    print(f"\n📖 Analyzing {file_name}")
    print("=" * 50)
    
    try:
        # Read Excel file
        df = pd.read_excel(file_path)
        print(f"📊 Loaded {len(df)} rows from Excel")
        print(f"📊 Columns ({len(df.columns)}): {list(df.columns)}")
        
        # Show data types
        print(f"\n📋 Data Types:")
        for col in df.columns:
            dtype = df[col].dtype
            non_null = df[col].count()
            null_count = len(df) - non_null
            print(f"   {col}: {dtype} ({non_null} non-null, {null_count} null)")
        
        # Show sample data
        print(f"\n📋 Sample Data (first 3 rows):")
        for i, row in df.head(3).iterrows():
            print(f"\nRow {i+1}:")
            for col in df.columns:
                value = row[col]
                if pd.notna(value):
                    print(f"   {col}: {value}")
        
        # Analyze key fields
        print(f"\n📊 Key Field Analysis:")
        
        # Commission amount analysis
        amount_cols = [col for col in df.columns if any(term in col.upper() for term in ['AMOUNT', 'COMMISSION', 'TOTAL', 'PAYMENT', 'RECEIVED'])]
        if amount_cols:
            print(f"   Amount Columns: {amount_cols}")
            for col in amount_cols:
                if col in df.columns and df[col].dtype in ['float64', 'int64']:
                    stats = df[col].describe()
                    print(f"     {col}: min=${stats['min']:.2f}, max=${stats['max']:.2f}, avg=${stats['mean']:.2f}, total=${stats['sum']:.2f}")
        
        # Date analysis
        date_cols = [col for col in df.columns if any(term in col.upper() for term in ['DATE', 'PERIOD', 'MONTH', 'YEAR'])]
        if date_cols:
            print(f"   Date Columns: {date_cols}")
            for col in date_cols:
                if col in df.columns:
                    non_null_dates = df[col].count()
                    print(f"     {col}: {non_null_dates} non-null dates")
                    if non_null_dates > 0:
                        # Show date range
                        try:
                            if df[col].dtype == 'object':
                                # Try to parse as date
                                date_series = pd.to_datetime(df[col], errors='coerce')
                                valid_dates = date_series.dropna()
                                if len(valid_dates) > 0:
                                    print(f"       Range: {valid_dates.min()} to {valid_dates.max()}")
                            else:
                                print(f"       Range: {df[col].min()} to {df[col].max()}")
                        except:
                            pass
        
        # Manager/REP analysis
        manager_cols = [col for col in df.columns if any(term in col.upper() for term in ['MANAGER', 'MGR', 'REP', 'AGENT'])]
        if manager_cols:
            print(f"   Manager/REP Columns: {manager_cols}")
            for col in manager_cols:
                if col in df.columns:
                    unique_values = df[col].value_counts().head(5)
                    print(f"     {col} top values: {dict(unique_values)}")
        
        # Account/Customer analysis
        account_cols = [col for col in df.columns if any(term in col.upper() for term in ['ACCOUNT', 'CUSTOMER', 'CLIENT', 'ACCT'])]
        if account_cols:
            print(f"   Account Columns: {account_cols}")
            for col in account_cols:
                if col in df.columns:
                    unique_count = df[col].nunique()
                    print(f"     {col}: {unique_count} unique values")
        
        # Status analysis
        status_cols = [col for col in df.columns if any(term in col.upper() for term in ['STATUS', 'STATE', 'PAID', 'PENDING'])]
        if status_cols:
            print(f"   Status Columns: {status_cols}")
            for col in status_cols:
                if col in df.columns:
                    unique_values = df[col].value_counts()
                    print(f"     {col} values: {dict(unique_values)}")
        
        # Data quality check
        print(f"\n📊 Data Quality:")
        total_rows = len(df)
        complete_rows = df.dropna().shape[0]
        print(f"   Total rows: {total_rows}")
        print(f"   Complete rows (no nulls): {complete_rows}")
        print(f"   Completeness: {(complete_rows/total_rows)*100:.1f}%")
        
        return df
        
    except Exception as e:
        print(f"❌ Error analyzing Excel file: {e}")
        return None

def analyze_commission_data():
    """Analyze both commission data files"""
    
    print("🚀 Analyzing Commission Data Files...")
    
    # Analyze COMMISSION RECEIVED.xlsx
    received_file = Path("Exports/COMMISSION RECEIVED.xlsx")
    received_df = analyze_commission_file(received_file, "COMMISSION RECEIVED.xlsx")
    
    # Analyze COMMISSION SCHEDULE.xlsx
    schedule_file = Path("Exports/COMMISSION SCHEDULE.xlsx")
    schedule_df = analyze_commission_file(schedule_file, "COMMISSION SCHEDULE.xlsx")
    
    # Compare the two files
    if received_df is not None and schedule_df is not None:
        print(f"\n🔍 COMPARISON ANALYSIS:")
        print("=" * 50)
        print(f"   COMMISSION RECEIVED: {len(received_df)} rows, {len(received_df.columns)} columns")
        print(f"   COMMISSION SCHEDULE: {len(schedule_df)} rows, {len(schedule_df.columns)} columns")
        
        # Find common columns
        received_cols = set(received_df.columns)
        schedule_cols = set(schedule_df.columns)
        common_cols = received_cols.intersection(schedule_cols)
        received_only = received_cols - schedule_cols
        schedule_only = schedule_cols - received_cols
        
        print(f"\n📊 Column Comparison:")
        print(f"   Common columns: {len(common_cols)}")
        if common_cols:
            print(f"     {list(common_cols)}")
        
        print(f"   RECEIVED only: {len(received_only)}")
        if received_only:
            print(f"     {list(received_only)}")
        
        print(f"   SCHEDULE only: {len(schedule_only)}")
        if schedule_only:
            print(f"     {list(schedule_only)}")
        
        # Calculate total commission amounts if possible
        for df_name, df in [("RECEIVED", received_df), ("SCHEDULE", schedule_df)]:
            amount_cols = [col for col in df.columns if any(term in col.upper() for term in ['AMOUNT', 'COMMISSION', 'TOTAL'])]
            if amount_cols:
                for col in amount_cols:
                    if df[col].dtype in ['float64', 'int64']:
                        total = df[col].sum()
                        print(f"   {df_name} {col} total: ${total:,.2f}")
    
    print(f"\n✅ Commission data analysis completed!")
    return True

if __name__ == "__main__":
    analyze_commission_data()
