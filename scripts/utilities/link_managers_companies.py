#!/usr/bin/env python3
"""
Link Managers to Management Companies
Updates the managers table to establish proper foreign key relationships
"""

import sqlite3
from pathlib import Path

def link_managers_to_companies():
    """Link managers to their management companies"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # First, add the management_company_id column to managers table if it doesn't exist
        cursor.execute("PRAGMA table_info(managers)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'management_company_id' not in columns:
            print("📝 Adding management_company_id column to managers table...")
            cursor.execute("ALTER TABLE managers ADD COLUMN management_company_id INTEGER")
        
        # Get all managers with their management company names
        cursor.execute("""
            SELECT id, name, management_company 
            FROM managers 
            WHERE management_company IS NOT NULL 
            AND management_company != ''
        """)
        managers = cursor.fetchall()
        
        print(f"📊 Found {len(managers)} managers with company information")
        
        # Get all management companies
        cursor.execute("SELECT id, mgmt_co_code, company_name FROM management_companies")
        companies = cursor.fetchall()
        
        print(f"📊 Found {len(companies)} management companies")
        
        # Create mapping dictionaries
        company_by_code = {}
        company_by_name = {}
        
        for comp_id, code, name in companies:
            if code:
                company_by_code[code.upper()] = comp_id
            if name:
                company_by_name[name.upper()] = comp_id
        
        # Link managers to companies
        linked_count = 0
        unlinked_managers = []
        
        for mgr_id, mgr_name, mgr_company in managers:
            company_id = None
            mgr_company_upper = mgr_company.upper()
            
            # Try to match by company code first
            if mgr_company_upper in company_by_code:
                company_id = company_by_code[mgr_company_upper]
            # Try to match by partial company name
            else:
                for comp_name, comp_id in company_by_name.items():
                    if mgr_company_upper in comp_name or comp_name in mgr_company_upper:
                        company_id = comp_id
                        break
            
            if company_id:
                cursor.execute("""
                    UPDATE managers 
                    SET management_company_id = ? 
                    WHERE id = ?
                """, (company_id, mgr_id))
                linked_count += 1
            else:
                unlinked_managers.append((mgr_name, mgr_company))
        
        # Commit changes
        conn.commit()
        
        print(f"✅ Successfully linked {linked_count} managers to companies!")
        
        # Show statistics
        cursor.execute("""
            SELECT COUNT(*) 
            FROM managers 
            WHERE management_company_id IS NOT NULL
        """)
        total_linked = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM managers WHERE is_active = 1")
        total_active_managers = cursor.fetchone()[0]
        
        print(f"\n📊 Linking Statistics:")
        print(f"   Total active managers: {total_active_managers}")
        print(f"   Managers linked to companies: {total_linked}")
        print(f"   Unlinked managers: {len(unlinked_managers)}")
        
        # Show some successful links
        cursor.execute("""
            SELECT m.name, mc.company_name, mc.mgmt_co_code
            FROM managers m
            JOIN management_companies mc ON m.management_company_id = mc.id
            WHERE m.is_active = 1
            LIMIT 10
        """)
        
        print(f"\n🔗 Sample Manager-Company Links:")
        for mgr_name, comp_name, comp_code in cursor.fetchall():
            print(f"   {mgr_name} → {comp_code}: {comp_name}")
        
        # Show unlinked managers (first 10)
        if unlinked_managers:
            print(f"\n⚠️ Unlinked Managers (first 10):")
            for mgr_name, mgr_company in unlinked_managers[:10]:
                print(f"   {mgr_name} → {mgr_company}")
        
        # Show company statistics
        cursor.execute("""
            SELECT mc.company_name, mc.mgmt_co_code, COUNT(m.id) as manager_count
            FROM management_companies mc
            LEFT JOIN managers m ON mc.id = m.management_company_id AND m.is_active = 1
            WHERE mc.mgmt_status LIKE '%ACTIVE%'
            GROUP BY mc.id, mc.company_name, mc.mgmt_co_code
            HAVING manager_count > 0
            ORDER BY manager_count DESC
            LIMIT 10
        """)
        
        print(f"\n🏢 Top Companies by Manager Count:")
        for comp_name, comp_code, mgr_count in cursor.fetchall():
            print(f"   {comp_code}: {comp_name} ({mgr_count} managers)")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error linking managers to companies: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    print("🚀 Starting Manager-Company Linking...")
    success = link_managers_to_companies()
    if success:
        print("✅ Manager-Company linking completed successfully!")
    else:
        print("❌ Manager-Company linking failed!")
