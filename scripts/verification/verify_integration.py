#!/usr/bin/env python3
"""
Verify the Management Company Integration
Shows the results of the MGMT COMPANIES.xlsx integration
"""

import sqlite3
from pathlib import Path

def verify_integration():
    """Verify the management company integration results"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🔍 MANAGEMENT COMPANY INTEGRATION VERIFICATION")
        print("=" * 60)
        
        # 1. Management Companies Statistics
        cursor.execute("SELECT COUNT(*) FROM management_companies WHERE is_active = 1")
        total_companies = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM management_companies WHERE mgmt_status LIKE '%ACTIVE%'")
        active_companies = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM management_companies WHERE billing_email IS NOT NULL AND billing_email != ''")
        companies_with_email = cursor.fetchone()[0]
        
        print(f"\n📊 MANAGEMENT COMPANIES:")
        print(f"   Total companies imported: {total_companies}")
        print(f"   Active companies: {active_companies}")
        print(f"   Companies with email: {companies_with_email}")
        
        # 2. Manager-Company Relationships
        cursor.execute("SELECT COUNT(*) FROM managers WHERE management_company_id IS NOT NULL")
        linked_managers = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM managers WHERE is_active = 1")
        total_managers = cursor.fetchone()[0]
        
        print(f"\n👥 MANAGER-COMPANY RELATIONSHIPS:")
        print(f"   Total managers: {total_managers}")
        print(f"   Managers linked to companies: {linked_managers}")
        print(f"   Link success rate: {(linked_managers/total_managers)*100:.1f}%")
        
        # 3. Top Companies by Manager Count
        cursor.execute("""
            SELECT mc.company_name, mc.mgmt_co_code, COUNT(m.id) as manager_count
            FROM management_companies mc
            JOIN managers m ON mc.id = m.management_company_id
            WHERE mc.is_active = 1 AND m.is_active = 1
            GROUP BY mc.id, mc.company_name, mc.mgmt_co_code
            ORDER BY manager_count DESC
            LIMIT 10
        """)
        
        print(f"\n🏆 TOP 10 COMPANIES BY MANAGER COUNT:")
        for i, (name, code, count) in enumerate(cursor.fetchall(), 1):
            print(f"   {i:2d}. {code}: {name} ({count} managers)")
        
        # 4. Company Status Distribution
        cursor.execute("""
            SELECT mgmt_status, COUNT(*) as count
            FROM management_companies
            WHERE is_active = 1 AND mgmt_status IS NOT NULL
            GROUP BY mgmt_status
            ORDER BY count DESC
        """)
        
        print(f"\n📈 COMPANY STATUS DISTRIBUTION:")
        for status, count in cursor.fetchall():
            print(f"   {status}: {count} companies")
        
        # 5. Sample Company-Manager Relationships
        cursor.execute("""
            SELECT mc.company_name, mc.mgmt_co_code, m.name
            FROM management_companies mc
            JOIN managers m ON mc.id = m.management_company_id
            WHERE mc.mgmt_status LIKE '%ACTIVE%' AND m.is_active = 1
            ORDER BY mc.company_name, m.name
            LIMIT 15
        """)
        
        print(f"\n🔗 SAMPLE COMPANY-MANAGER RELATIONSHIPS:")
        current_company = None
        for comp_name, comp_code, mgr_name in cursor.fetchall():
            if comp_name != current_company:
                print(f"\n   📁 {comp_code}: {comp_name}")
                current_company = comp_name
            print(f"      └─ {mgr_name}")
        
        # 6. Data Quality Check
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN office_phone IS NOT NULL AND office_phone != '' THEN 1 ELSE 0 END) as with_phone,
                SUM(CASE WHEN billing_email IS NOT NULL AND billing_email != '' THEN 1 ELSE 0 END) as with_email,
                SUM(CASE WHEN office_city_state_zip IS NOT NULL AND office_city_state_zip != '' THEN 1 ELSE 0 END) as with_address
            FROM management_companies
            WHERE is_active = 1
        """)
        
        total, with_phone, with_email, with_address = cursor.fetchone()
        
        print(f"\n📋 DATA QUALITY METRICS:")
        print(f"   Companies with phone: {with_phone}/{total} ({(with_phone/total)*100:.1f}%)")
        print(f"   Companies with email: {with_email}/{total} ({(with_email/total)*100:.1f}%)")
        print(f"   Companies with address: {with_address}/{total} ({(with_address/total)*100:.1f}%)")
        
        # 7. Frontend Data Export Status
        frontend_file = Path("1-frontend/src/data/companies.json")
        if frontend_file.exists():
            import json
            with open(frontend_file, 'r') as f:
                frontend_data = json.load(f)
            print(f"\n🎨 FRONTEND INTEGRATION:")
            print(f"   Companies exported to frontend: {len(frontend_data)}")
            print(f"   Frontend data file: {frontend_file}")
        else:
            print(f"\n⚠️ FRONTEND INTEGRATION:")
            print(f"   Frontend data file not found: {frontend_file}")
        
        print(f"\n✅ INTEGRATION VERIFICATION COMPLETE!")
        print(f"   Database: {db_path}")
        print(f"   Companies: {total_companies} imported")
        print(f"   Managers: {linked_managers}/{total_managers} linked")
        print(f"   Frontend: {'✅ Ready' if frontend_file.exists() else '❌ Missing'}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    verify_integration()
