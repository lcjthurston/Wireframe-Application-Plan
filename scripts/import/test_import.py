#!/usr/bin/env python3
"""
Simple test script to verify Excel file reading
"""

import pandas as pd
from pathlib import Path

def test_excel_reading():
    """Test reading the Excel file"""
    
    # Check if Excel file exists
    excel_file = Path("Exports/MANAGER LIST.xlsx")
    if not excel_file.exists():
        print(f"❌ Excel file not found: {excel_file}")
        return False
    
    print(f"📖 Reading manager data from {excel_file}")
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_file, sheet_name="MANAGER LIST")
        print(f"📊 Loaded {len(df)} rows from Excel")
        print(f"📊 Columns: {list(df.columns)}")
        
        # Show first few rows
        print(f"\n📋 First 3 rows:")
        for i, row in df.head(3).iterrows():
            print(f"Row {i}: {row['MANAGER']} - {row.get('MGMT CO', 'No Company')}")
        
        # Clean data
        df = df[df['MANAGER'].notna()]
        df = df[df['MANAGER'] != '?']
        df = df[df['MANAGER'].str.strip() != '']
        
        print(f"📊 After cleaning: {len(df)} valid managers")
        
        # Show some statistics
        companies = df['MGMT CO'].value_counts().head(5)
        print(f"\n🏢 Top 5 Management Companies:")
        for company, count in companies.items():
            print(f"   {company}: {count} managers")
        
        return True
        
    except Exception as e:
        print(f"❌ Error reading Excel file: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Excel file reading...")
    success = test_excel_reading()
    if success:
        print("✅ Excel reading test completed successfully!")
    else:
        print("❌ Excel reading test failed!")
