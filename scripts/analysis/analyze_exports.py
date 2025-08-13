#!/usr/bin/env python3
"""
Excel File Analysis Script for Kilowatt Platform
Analyzes the structure and content of Excel files in the Exports directory
"""

import pandas as pd
import os
from pathlib import Path

def analyze_excel_file(file_path):
    """Analyze a single Excel file and return its structure"""
    try:
        # Read all sheets
        excel_file = pd.ExcelFile(file_path)
        analysis = {
            'filename': os.path.basename(file_path),
            'sheets': {},
            'total_sheets': len(excel_file.sheet_names)
        }
        
        for sheet_name in excel_file.sheet_names:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            
            analysis['sheets'][sheet_name] = {
                'rows': len(df),
                'columns': len(df.columns),
                'column_names': list(df.columns),
                'sample_data': df.head(3).to_dict('records') if len(df) > 0 else [],
                'data_types': df.dtypes.to_dict()
            }
        
        return analysis
    except Exception as e:
        return {
            'filename': os.path.basename(file_path),
            'error': str(e)
        }

def main():
    """Analyze all Excel files in the Exports directory"""
    exports_dir = Path("Exports")
    
    if not exports_dir.exists():
        print("Exports directory not found!")
        return
    
    excel_files = list(exports_dir.glob("*.xlsx"))
    
    if not excel_files:
        print("No Excel files found in Exports directory!")
        return
    
    print("=" * 80)
    print("KILOWATT PLATFORM - EXCEL FILES ANALYSIS")
    print("=" * 80)
    
    for excel_file in excel_files:
        print(f"\n📊 ANALYZING: {excel_file.name}")
        print("-" * 60)
        
        analysis = analyze_excel_file(excel_file)
        
        if 'error' in analysis:
            print(f"❌ ERROR: {analysis['error']}")
            continue
        
        print(f"📋 Total Sheets: {analysis['total_sheets']}")
        
        for sheet_name, sheet_data in analysis['sheets'].items():
            print(f"\n  📄 Sheet: {sheet_name}")
            print(f"     Rows: {sheet_data['rows']}")
            print(f"     Columns: {sheet_data['columns']}")
            print(f"     Column Names: {', '.join(sheet_data['column_names'])}")
            
            if sheet_data['sample_data']:
                print(f"     Sample Data (first 3 rows):")
                for i, row in enumerate(sheet_data['sample_data'], 1):
                    print(f"       Row {i}: {row}")
        
        print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
