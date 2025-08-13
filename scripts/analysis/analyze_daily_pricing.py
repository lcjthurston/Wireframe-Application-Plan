#!/usr/bin/env python3
"""
Analyze Daily Pricing Data structure for database model design
"""

import pandas as pd
from pathlib import Path

def analyze_daily_pricing_excel():
    """Analyze the DAILY PRICING - new.xlsx file structure"""
    
    excel_file = Path("Exports/DAILY PRICING - new.xlsx")
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
        
        # Date analysis
        date_cols = [col for col in df.columns if any(term in col.upper() for term in ['DATE', 'DAY', 'TIME', 'PERIOD'])]
        if date_cols:
            print(f"   Date Columns: {date_cols}")
            for col in date_cols:
                if col in df.columns:
                    non_null_dates = df[col].count()
                    print(f"     {col}: {non_null_dates} non-null dates")
                    if non_null_dates > 0:
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
        
        # Price/Rate analysis
        price_cols = [col for col in df.columns if any(term in col.upper() for term in ['PRICE', 'RATE', 'COST', 'CHARGE', 'TARIFF', 'KWH'])]
        if price_cols:
            print(f"   Price/Rate Columns: {price_cols}")
            for col in price_cols:
                if col in df.columns and df[col].dtype in ['float64', 'int64']:
                    stats = df[col].describe()
                    print(f"     {col}: min=${stats['min']:.4f}, max=${stats['max']:.4f}, avg=${stats['mean']:.4f}")
        
        # Zone/Location analysis
        zone_cols = [col for col in df.columns if any(term in col.upper() for term in ['ZONE', 'REGION', 'AREA', 'LOCATION', 'MARKET'])]
        if zone_cols:
            print(f"   Zone/Location Columns: {zone_cols}")
            for col in zone_cols:
                if col in df.columns:
                    unique_values = df[col].value_counts().head(10)
                    print(f"     {col} top values: {dict(unique_values)}")
        
        # Load/Demand analysis
        load_cols = [col for col in df.columns if any(term in col.upper() for term in ['LOAD', 'DEMAND', 'USAGE', 'CONSUMPTION'])]
        if load_cols:
            print(f"   Load/Demand Columns: {load_cols}")
            for col in load_cols:
                if col in df.columns and df[col].dtype in ['float64', 'int64']:
                    stats = df[col].describe()
                    print(f"     {col}: min={stats['min']:.2f}, max={stats['max']:.2f}, avg={stats['mean']:.2f}")
        
        # Time period analysis
        time_cols = [col for col in df.columns if any(term in col.upper() for term in ['HOUR', 'MINUTE', 'PERIOD', 'INTERVAL', 'BLOCK'])]
        if time_cols:
            print(f"   Time Period Columns: {time_cols}")
            for col in time_cols:
                if col in df.columns:
                    unique_values = df[col].value_counts().head(10)
                    print(f"     {col} values: {dict(unique_values)}")
        
        # Provider/Utility analysis
        provider_cols = [col for col in df.columns if any(term in col.upper() for term in ['PROVIDER', 'UTILITY', 'COMPANY', 'SUPPLIER', 'REP'])]
        if provider_cols:
            print(f"   Provider/Utility Columns: {provider_cols}")
            for col in provider_cols:
                if col in df.columns:
                    unique_values = df[col].value_counts().head(5)
                    print(f"     {col} top values: {dict(unique_values)}")
        
        # Data quality check
        print(f"\n📊 Data Quality:")
        total_rows = len(df)
        complete_rows = df.dropna().shape[0]
        print(f"   Total rows: {total_rows}")
        print(f"   Complete rows (no nulls): {complete_rows}")
        print(f"   Completeness: {(complete_rows/total_rows)*100:.1f}%")
        
        # Check for duplicates based on date if date column exists
        if date_cols:
            for date_col in date_cols:
                if date_col in df.columns:
                    duplicate_dates = df[date_col].duplicated().sum()
                    print(f"   Duplicate dates in {date_col}: {duplicate_dates}")
        
        # Price range analysis
        numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
        if len(numeric_cols) > 0:
            print(f"\n📊 Numeric Data Summary:")
            for col in numeric_cols:
                if 'price' in col.lower() or 'rate' in col.lower() or 'cost' in col.lower():
                    non_zero = df[df[col] != 0][col]
                    if len(non_zero) > 0:
                        print(f"   {col}: {len(non_zero)} non-zero values, range: ${non_zero.min():.4f} - ${non_zero.max():.4f}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error analyzing Excel file: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Analyzing DAILY PRICING - new.xlsx structure...")
    success = analyze_daily_pricing_excel()
    if success:
        print("✅ Analysis completed!")
    else:
        print("❌ Analysis failed!")
