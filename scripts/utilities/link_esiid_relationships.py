#!/usr/bin/env python3
"""
Link ESIID Relationships
Establish relationships between ESIIDs and existing providers/management companies
"""

import sqlite3
from pathlib import Path

def link_esiid_relationships():
    """Link ESIIDs to providers and management companies"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🔗 LINKING ESIID RELATIONSHIPS")
        print("=" * 50)
        
        # 1. Link ESIIDs to Providers based on REP field
        print("\n🔌 Linking ESIIDs to Providers...")
        
        # Get all unique REPs from ESIIDs
        cursor.execute("SELECT DISTINCT rep FROM esiids WHERE rep IS NOT NULL AND rep != ''")
        esiid_reps = [row[0] for row in cursor.fetchall()]
        print(f"   Found {len(esiid_reps)} unique REPs in ESIID data")
        
        # Get all providers
        cursor.execute("SELECT id, name FROM providers WHERE is_active = 1")
        providers = {name.upper(): provider_id for provider_id, name in cursor.fetchall()}
        print(f"   Found {len(providers)} active providers in database")
        
        # Link ESIIDs to providers
        linked_count = 0
        for rep in esiid_reps:
            rep_upper = rep.upper()
            
            # Try exact match first
            provider_id = providers.get(rep_upper)
            
            # If no exact match, try partial matches
            if not provider_id:
                for provider_name, pid in providers.items():
                    if rep_upper in provider_name or provider_name in rep_upper:
                        provider_id = pid
                        break
            
            if provider_id:
                cursor.execute("""
                    UPDATE esiids 
                    SET provider_id = ? 
                    WHERE rep = ? AND provider_id IS NULL
                """, (provider_id, rep))
                
                updated_rows = cursor.rowcount
                linked_count += updated_rows
                print(f"   Linked {updated_rows} ESIIDs with REP '{rep}' to provider ID {provider_id}")
        
        print(f"   ✅ Total ESIIDs linked to providers: {linked_count}")
        
        # 2. Link ESIIDs to Management Companies based on account names
        print("\n🏢 Linking ESIIDs to Management Companies...")
        
        # Get management companies
        cursor.execute("SELECT id, company_name, mgmt_co_code FROM management_companies WHERE is_active = 1")
        companies = {}
        for company_id, company_name, mgmt_co_code in cursor.fetchall():
            if company_name:
                companies[company_name.upper()] = company_id
            if mgmt_co_code:
                companies[mgmt_co_code.upper()] = company_id
        
        print(f"   Found {len(companies)} active management companies")
        
        # Try to link based on account names containing company codes/names
        company_linked_count = 0
        for company_key, company_id in companies.items():
            if len(company_key) >= 3:  # Only try matching on reasonably long keys
                cursor.execute("""
                    UPDATE esiids 
                    SET management_company_id = ? 
                    WHERE UPPER(account_name) LIKE ? AND management_company_id IS NULL
                """, (company_id, f"%{company_key}%"))
                
                updated_rows = cursor.rowcount
                if updated_rows > 0:
                    company_linked_count += updated_rows
                    print(f"   Linked {updated_rows} ESIIDs to company '{company_key}' (ID {company_id})")
        
        print(f"   ✅ Total ESIIDs linked to management companies: {company_linked_count}")
        
        # 3. Show statistics
        print("\n📊 ESIID RELATIONSHIP STATISTICS:")
        
        cursor.execute("SELECT COUNT(*) FROM esiids")
        total_esiids = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM esiids WHERE provider_id IS NOT NULL")
        esiids_with_provider = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM esiids WHERE management_company_id IS NOT NULL")
        esiids_with_company = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM esiids WHERE provider_id IS NOT NULL AND management_company_id IS NOT NULL")
        esiids_fully_linked = cursor.fetchone()[0]
        
        print(f"   Total ESIIDs: {total_esiids}")
        print(f"   ESIIDs with provider: {esiids_with_provider} ({(esiids_with_provider/total_esiids)*100:.1f}%)")
        print(f"   ESIIDs with company: {esiids_with_company} ({(esiids_with_company/total_esiids)*100:.1f}%)")
        print(f"   ESIIDs fully linked: {esiids_fully_linked} ({(esiids_fully_linked/total_esiids)*100:.1f}%)")
        
        # 4. Show top REPs by ESIID count
        cursor.execute("""
            SELECT rep, COUNT(*) as esiid_count
            FROM esiids
            WHERE rep IS NOT NULL AND rep != ''
            GROUP BY rep
            ORDER BY esiid_count DESC
            LIMIT 10
        """)
        
        print(f"\n🔌 TOP 10 REPs BY ESIID COUNT:")
        for rep, count in cursor.fetchall():
            print(f"   {rep}: {count} ESIIDs")
        
        # 5. Show usage statistics
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                SUM(kwh_mo) as total_kwh_mo,
                SUM(kwh_yr) as total_kwh_yr,
                SUM(total_bill) as total_billing,
                AVG(kwh_mo) as avg_kwh_mo,
                AVG(total_bill) as avg_bill
            FROM esiids
            WHERE kwh_mo IS NOT NULL AND kwh_mo > 0
        """)
        
        stats = cursor.fetchone()
        if stats:
            total, total_kwh_mo, total_kwh_yr, total_billing, avg_kwh_mo, avg_bill = stats
            print(f"\n⚡ USAGE STATISTICS:")
            print(f"   ESIIDs with usage data: {total}")
            print(f"   Total monthly kWh: {total_kwh_mo:,.0f}")
            print(f"   Total yearly kWh: {total_kwh_yr:,.0f}")
            print(f"   Total billing: ${total_billing:,.2f}")
            print(f"   Average monthly kWh: {avg_kwh_mo:.0f}")
            print(f"   Average bill: ${avg_bill:.2f}")
        
        # 6. Show load profile distribution
        cursor.execute("""
            SELECT load_profile, COUNT(*) as count
            FROM esiids
            WHERE load_profile IS NOT NULL AND load_profile != ''
            GROUP BY load_profile
            ORDER BY count DESC
            LIMIT 10
        """)
        
        print(f"\n📊 LOAD PROFILE DISTRIBUTION:")
        for profile, count in cursor.fetchall():
            print(f"   {profile}: {count} ESIIDs")
        
        # Commit changes
        conn.commit()
        print(f"\n✅ ESIID relationship linking completed!")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error during relationship linking: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    link_esiid_relationships()
