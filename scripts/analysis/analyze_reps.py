#!/usr/bin/env python3
"""
Analyze REP.xlsx structure for database model design
"""

import pandas as pd
from pathlib import Path

def analyze_reps_excel():
    """Analyze the REP.xlsx file structure"""
    
    excel_file = Path("Exports/REP.xlsx")
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
        print(f"\n📋 Sample Data (first 5 rows):")
        for i, row in df.head(5).iterrows():
            print(f"\nRow {i+1}:")
            for col in df.columns:
                value = row[col]
                if pd.notna(value):
                    print(f"   {col}: {value}")
        
        # Analyze key fields
        print(f"\n📊 Key Field Analysis:")
        
        # REP names
        if 'REP' in df.columns:
            unique_reps = df['REP'].nunique()
            print(f"   Unique REPs: {unique_reps}")
            
            # Top REPs by frequency
            top_reps = df['REP'].value_counts().head(10)
            print(f"   Top REPs:")
            for rep, count in top_reps.items():
                print(f"     {rep}: {count} records")
        
        # Contact info analysis
        contact_cols = [col for col in df.columns if any(term in col.upper() for term in ['PHONE', 'EMAIL', 'FAX', 'CONTACT', 'ADDRESS'])]
        if contact_cols:
            print(f"   Contact Columns: {contact_cols}")
        
        # Payment/Financial analysis
        payment_cols = [col for col in df.columns if any(term in col.upper() for term in ['PAY', 'TERM', 'TAX', 'RATE', 'COMMISSION', 'AGREEMENT'])]
        if payment_cols:
            print(f"   Payment/Financial Columns: {payment_cols}")
            for col in payment_cols:
                if col in df.columns and df[col].dtype in ['object', 'float64', 'int64']:
                    unique_values = df[col].value_counts().head(5)
                    print(f"     {col} top values: {dict(unique_values)}")
        
        # Date analysis
        date_cols = [col for col in df.columns if any(term in col.upper() for term in ['DATE', 'START', 'END', 'AGREEMENT'])]
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
        
        return True
        
    except Exception as e:
        print(f"❌ Error analyzing Excel file: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Analyzing REP.xlsx structure...")
    success = analyze_reps_excel()
    if success:
        print("✅ Analysis completed!")
    else:
        print("❌ Analysis failed!")
