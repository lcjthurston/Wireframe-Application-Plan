#!/usr/bin/env python3
"""
Analyze ESIID DATA.xlsx structure for database model design
"""

import pandas as pd
from pathlib import Path

def analyze_esiid_excel():
    """Analyze the ESIID DATA.xlsx file structure"""
    
    excel_file = Path("Exports/ESIID DATA.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return False
    
    print(f"📖 Analyzing {excel_file}")
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file)
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
        
        # ESIID analysis
        if 'ESIID' in df.columns:
            unique_esiids = df['ESIID'].nunique()
            print(f"   Unique ESIIDs: {unique_esiids}")
            
            # Sample ESIIDs
            sample_esiids = df['ESIID'].dropna().head(5).tolist()
            print(f"   Sample ESIIDs: {sample_esiids}")
        
        # REP analysis
        rep_cols = [col for col in df.columns if 'REP' in col.upper()]
        if rep_cols:
            print(f"   REP Columns: {rep_cols}")
            for col in rep_cols:
                if col in df.columns:
                    unique_values = df[col].value_counts().head(5)
                    print(f"     {col} top values: {dict(unique_values)}")
        
        # Usage/kWh analysis
        usage_cols = [col for col in df.columns if any(term in col.upper() for term in ['KWH', 'USAGE', 'CONSUMPTION'])]
        if usage_cols:
            print(f"   Usage Columns: {usage_cols}")
            for col in usage_cols:
                if col in df.columns and df[col].dtype in ['float64', 'int64']:
                    stats = df[col].describe()
                    print(f"     {col}: min={stats['min']:.0f}, max={stats['max']:.0f}, avg={stats['mean']:.0f}")
        
        # Address/Location analysis
        address_cols = [col for col in df.columns if any(term in col.upper() for term in ['ADDRESS', 'STREET', 'CITY', 'ZIP', 'LOCATION'])]
        if address_cols:
            print(f"   Address Columns: {address_cols}")
        
        # Billing analysis
        billing_cols = [col for col in df.columns if any(term in col.upper() for term in ['BILL', 'RATE', 'AMOUNT', 'CHARGE'])]
        if billing_cols:
            print(f"   Billing Columns: {billing_cols}")
        
        # Load Profile analysis
        load_cols = [col for col in df.columns if any(term in col.upper() for term in ['LOAD', 'PROFILE', 'CLASS'])]
        if load_cols:
            print(f"   Load Profile Columns: {load_cols}")
            for col in load_cols:
                if col in df.columns:
                    unique_values = df[col].value_counts().head(10)
                    print(f"     {col} values: {dict(unique_values)}")
        
        # Date analysis
        date_cols = [col for col in df.columns if any(term in col.upper() for term in ['DATE', 'START', 'END', 'PERIOD'])]
        if date_cols:
            print(f"   Date Columns: {date_cols}")
            for col in date_cols:
                if col in df.columns:
                    non_null_dates = df[col].count()
                    print(f"     {col}: {non_null_dates} non-null dates")
        
        # Status/Active analysis
        status_cols = [col for col in df.columns if any(term in col.upper() for term in ['STATUS', 'ACTIVE', 'STATE'])]
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
        
        # Check for duplicates
        if 'ESIID' in df.columns:
            duplicate_esiids = df['ESIID'].duplicated().sum()
            print(f"   Duplicate ESIIDs: {duplicate_esiids}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error analyzing Excel file: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Analyzing ESIID DATA.xlsx structure...")
    success = analyze_esiid_excel()
    if success:
        print("✅ Analysis completed!")
    else:
        print("❌ Analysis failed!")
