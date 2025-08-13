#!/usr/bin/env python3
"""
Export management company data for frontend
Outputs JSON data that can be used by the React frontend
"""

import sqlite3
import json
from pathlib import Path

def get_companies_for_frontend():
    """Get management company data formatted for frontend consumption"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return []
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get companies with manager counts
        cursor.execute("""
            SELECT 
                mc.id,
                mc.company_name,
                mc.mgmt_co_code,
                mc.mgmt_status,
                mc.office_city_state_zip,
                mc.office_phone,
                mc.billing_email,
                mc.billing_city,
                mc.billing_state,
                COUNT(m.id) as manager_count
            FROM management_companies mc
            LEFT JOIN managers m ON mc.id = m.management_company_id AND m.is_active = 1
            WHERE mc.is_active = 1
            GROUP BY mc.id, mc.company_name, mc.mgmt_co_code, mc.mgmt_status, 
                     mc.office_city_state_zip, mc.office_phone, mc.billing_email,
                     mc.billing_city, mc.billing_state
            ORDER BY manager_count DESC, mc.company_name
            LIMIT 50
        """)
        
        companies = []
        for row in cursor.fetchall():
            company = {
                "id": row[0],
                "companyName": row[1] or "Unknown Company",
                "companyCode": row[2] or "N/A",
                "status": row[3] or "Unknown",
                "officeLocation": row[4] or "No Address",
                "phone": row[5] or "No Phone",
                "email": row[6] or "No Email",
                "billingCity": row[7] or "Unknown",
                "billingState": row[8] or "Unknown",
                "managerCount": row[9],
                "accountCount": 0,  # We'll set this to 0 for now
                "totalCommission": 0,  # We'll set this to 0 for now
                "isActive": "ACTIVE" in (row[3] or "").upper()
            }
            companies.append(company)
        
        conn.close()
        return companies
        
    except Exception as e:
        print(f"❌ Error querying database: {e}")
        conn.close()
        return []

def export_companies_json():
    """Export companies to JSON file for frontend"""
    companies = get_companies_for_frontend()
    
    if companies:
        # Write to JSON file
        output_file = "1-frontend/src/data/companies.json"
        Path(output_file).parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(companies, f, indent=2)
        
        print(f"✅ Exported {len(companies)} companies to {output_file}")
        
        # Show sample data
        print(f"\n📋 Sample companies:")
        for company in companies[:5]:
            print(f"   {company['companyCode']}: {company['companyName']} ({company['managerCount']} managers)")
        
        # Show statistics
        active_companies = sum(1 for c in companies if c['isActive'])
        total_managers = sum(c['managerCount'] for c in companies)
        
        print(f"\n📊 Statistics:")
        print(f"   Total companies: {len(companies)}")
        print(f"   Active companies: {active_companies}")
        print(f"   Total managers: {total_managers}")
        print(f"   Average managers per company: {total_managers / len(companies):.1f}")
        
        return True
    else:
        print("❌ No companies found to export")
        return False

if __name__ == "__main__":
    print("🚀 Exporting company data for frontend...")
    success = export_companies_json()
    if success:
        print("✅ Company data export completed!")
    else:
        print("❌ Company data export failed!")
