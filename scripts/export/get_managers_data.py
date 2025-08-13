#!/usr/bin/env python3
"""
Simple script to extract manager data for frontend
Outputs JSON data that can be used by the React frontend
"""

import sqlite3
import json
from pathlib import Path

def get_managers_for_frontend():
    """Get manager data formatted for frontend consumption"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return []
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get managers with all relevant fields
        cursor.execute("""
            SELECT 
                id,
                name,
                management_company,
                email,
                phone,
                cell,
                office_city,
                mgr_status,
                mgr_class,
                office
            FROM managers 
            WHERE is_active = 1 
            ORDER BY name
            LIMIT 50
        """)
        
        managers = []
        for row in cursor.fetchall():
            manager = {
                "id": row[0],
                "name": row[1] or "Unknown Manager",
                "managementCompany": row[2] or "No Company",
                "email": row[3] or "No Email",
                "phone": row[4] or row[5] or "No Phone",  # Use phone or cell
                "officeAddress": f"{row[9] or ''}, {row[6] or ''}".strip(', ') or "No Address",
                "accountCount": 0,  # We'll set this to 0 for now
                "totalCommission": 0,  # We'll set this to 0 for now
                "pendingContracts": 0,  # We'll set this to 0 for now
                "status": row[7] or "Active",
                "class": row[8] or "Manager",
                "officeCity": row[6] or "Unknown"
            }
            managers.append(manager)
        
        conn.close()
        return managers
        
    except Exception as e:
        print(f"❌ Error querying database: {e}")
        conn.close()
        return []

def export_managers_json():
    """Export managers to JSON file for frontend"""
    managers = get_managers_for_frontend()
    
    if managers:
        # Write to JSON file
        output_file = "1-frontend/src/data/managers.json"
        Path(output_file).parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(managers, f, indent=2)
        
        print(f"✅ Exported {len(managers)} managers to {output_file}")
        
        # Show sample data
        print(f"\n📋 Sample managers:")
        for manager in managers[:5]:
            print(f"   {manager['name']} - {manager['managementCompany']}")
        
        return True
    else:
        print("❌ No managers found to export")
        return False

if __name__ == "__main__":
    print("🚀 Exporting manager data for frontend...")
    success = export_managers_json()
    if success:
        print("✅ Manager data export completed!")
    else:
        print("❌ Manager data export failed!")
