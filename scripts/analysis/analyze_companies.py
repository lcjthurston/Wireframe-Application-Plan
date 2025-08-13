#!/usr/bin/env python3
"""
Analyze MGMT COMPANIES.xlsx structure for database model design
"""

import pandas as pd
from pathlib import Path

def analyze_companies_excel():
    """Analyze the MGMT COMPANIES.xlsx file structure"""
    
    excel_file = Path("Exports/MGMT COMPANIES.xlsx")
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
        
        # Company names
        if 'MGMT CO' in df.columns:
            unique_companies = df['MGMT CO'].nunique()
            print(f"   Unique Companies: {unique_companies}")
            
            # Top companies by frequency
            top_companies = df['MGMT CO'].value_counts().head(5)
            print(f"   Top Companies:")
            for company, count in top_companies.items():
                print(f"     {company}: {count} records")
        
        # Address analysis
        address_cols = [col for col in df.columns if 'ADDRESS' in col.upper() or 'ADDR' in col.upper()]
        if address_cols:
            print(f"   Address Columns: {address_cols}")
        
        # Contact info analysis
        contact_cols = [col for col in df.columns if any(term in col.upper() for term in ['PHONE', 'EMAIL', 'FAX', 'CONTACT'])]
        if contact_cols:
            print(f"   Contact Columns: {contact_cols}")
        
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
    print("🚀 Analyzing MGMT COMPANIES.xlsx structure...")
    success = analyze_companies_excel()
    if success:
        print("✅ Analysis completed!")
    else:
        print("❌ Analysis failed!")
