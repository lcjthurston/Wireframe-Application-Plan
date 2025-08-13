#!/usr/bin/env python3
"""
Verify the ESIID Integration
Shows the results of the ESIID DATA.xlsx integration
"""

import sqlite3
from pathlib import Path

def verify_esiid_integration():
    """Verify the ESIID integration results"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🔍 ESIID/METER INTEGRATION VERIFICATION")
        print("=" * 60)
        
        # 1. ESIID Statistics
        cursor.execute("SELECT COUNT(*) FROM esiids WHERE is_active = 1")
        total_esiids = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM esiids WHERE kwh_mo IS NOT NULL AND kwh_mo > 0")
        esiids_with_usage = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM esiids WHERE provider_id IS NOT NULL")
        esiids_with_provider = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM esiids WHERE management_company_id IS NOT NULL")
        esiids_with_company = cursor.fetchone()[0]
        
        print(f"\n📊 ESIID/METER DATA:")
        print(f"   Total ESIIDs imported: {total_esiids}")
        print(f"   ESIIDs with usage data: {esiids_with_usage}")
        print(f"   ESIIDs linked to providers: {esiids_with_provider}")
        print(f"   ESIIDs linked to companies: {esiids_with_company}")
        
        # 2. Usage and Billing Statistics
        cursor.execute("""
            SELECT 
                SUM(kwh_mo) as total_kwh_mo,
                SUM(kwh_yr) as total_kwh_yr,
                SUM(total_bill) as total_billing,
                AVG(kwh_mo) as avg_kwh_mo,
                AVG(total_bill) as avg_bill,
                MAX(kwh_mo) as max_kwh_mo,
                MIN(kwh_mo) as min_kwh_mo
            FROM esiids
            WHERE is_active = 1 AND kwh_mo IS NOT NULL AND kwh_mo > 0
        """)
        
        usage_stats = cursor.fetchone()
        if usage_stats:
            total_kwh_mo, total_kwh_yr, total_billing, avg_kwh_mo, avg_bill, max_kwh_mo, min_kwh_mo = usage_stats
            print(f"\n⚡ USAGE & BILLING STATISTICS:")
            print(f"   Total monthly kWh: {total_kwh_mo:,.0f}")
            print(f"   Total yearly kWh: {total_kwh_yr:,.0f}")
            print(f"   Total billing: ${total_billing:,.2f}")
            print(f"   Average monthly kWh: {avg_kwh_mo:,.0f}")
            print(f"   Average bill: ${avg_bill:.2f}")
            print(f"   Highest usage: {max_kwh_mo:,.0f} kWh/month")
            print(f"   Lowest usage: {min_kwh_mo:,.0f} kWh/month")
        
        # 3. Top REPs by ESIID Count
        cursor.execute("""
            SELECT rep, COUNT(*) as esiid_count, SUM(kwh_mo) as total_kwh
            FROM esiids
            WHERE is_active = 1 AND rep IS NOT NULL AND rep != ''
            GROUP BY rep
            ORDER BY esiid_count DESC
            LIMIT 10
        """)
        
        print(f"\n🔌 TOP 10 REPs BY ESIID COUNT:")
        for rep, count, total_kwh in cursor.fetchall():
            kwh_display = f" ({total_kwh:,.0f} kWh)" if total_kwh else ""
            print(f"   {rep}: {count} ESIIDs{kwh_display}")
        
        # 4. Load Profile Distribution
        cursor.execute("""
            SELECT load_profile, COUNT(*) as count, AVG(kwh_mo) as avg_usage
            FROM esiids
            WHERE is_active = 1 AND load_profile IS NOT NULL AND load_profile != ''
            GROUP BY load_profile
            ORDER BY count DESC
            LIMIT 10
        """)
        
        print(f"\n📊 LOAD PROFILE DISTRIBUTION:")
        for profile, count, avg_usage in cursor.fetchall():
            usage_display = f" (avg: {avg_usage:,.0f} kWh)" if avg_usage else ""
            print(f"   {profile}: {count} ESIIDs{usage_display}")
        
        # 5. Geographic Distribution (by Zone)
        cursor.execute("""
            SELECT zone, COUNT(*) as count, SUM(kwh_mo) as total_kwh
            FROM esiids
            WHERE is_active = 1 AND zone IS NOT NULL AND zone != ''
            GROUP BY zone
            ORDER BY count DESC
            LIMIT 10
        """)
        
        zones = cursor.fetchall()
        if zones:
            print(f"\n🗺️ GEOGRAPHIC DISTRIBUTION (by Zone):")
            for zone, count, total_kwh in zones:
                kwh_display = f" ({total_kwh:,.0f} kWh)" if total_kwh else ""
                print(f"   {zone}: {count} ESIIDs{kwh_display}")
        
        # 6. Relationship Quality
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN provider_id IS NOT NULL THEN 1 END) as with_provider,
                COUNT(CASE WHEN management_company_id IS NOT NULL THEN 1 END) as with_company,
                COUNT(CASE WHEN provider_id IS NOT NULL AND management_company_id IS NOT NULL THEN 1 END) as fully_linked
            FROM esiids
            WHERE is_active = 1
        """)
        
        total, with_provider, with_company, fully_linked = cursor.fetchone()
        
        print(f"\n🔗 RELATIONSHIP QUALITY:")
        print(f"   ESIIDs with provider: {with_provider}/{total} ({(with_provider/total)*100:.1f}%)")
        print(f"   ESIIDs with company: {with_company}/{total} ({(with_company/total)*100:.1f}%)")
        print(f"   ESIIDs fully linked: {fully_linked}/{total} ({(fully_linked/total)*100:.1f}%)")
        
        # 7. High Usage ESIIDs
        cursor.execute("""
            SELECT account_name, rep, kwh_mo, total_bill, service_address_1
            FROM esiids
            WHERE is_active = 1 AND kwh_mo IS NOT NULL
            ORDER BY kwh_mo DESC
            LIMIT 10
        """)
        
        print(f"\n🏭 TOP 10 HIGHEST USAGE ESIIDs:")
        for account, rep, kwh, bill, address in cursor.fetchall():
            rep_display = f" ({rep})" if rep else ""
            bill_display = f" - ${bill:,.0f}" if bill else ""
            address_display = f" - {address[:50]}..." if address and len(address) > 50 else f" - {address}" if address else ""
            print(f"   {account}{rep_display}: {kwh:,.0f} kWh{bill_display}{address_display}")
        
        # 8. Data Quality Assessment
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN esi_id IS NOT NULL AND esi_id != '' THEN 1 END) as with_esi_id,
                COUNT(CASE WHEN service_address_1 IS NOT NULL AND service_address_1 != '' THEN 1 END) as with_address,
                COUNT(CASE WHEN rep IS NOT NULL AND rep != '' THEN 1 END) as with_rep,
                COUNT(CASE WHEN kwh_mo IS NOT NULL AND kwh_mo > 0 THEN 1 END) as with_usage,
                COUNT(CASE WHEN total_bill IS NOT NULL AND total_bill > 0 THEN 1 END) as with_billing
            FROM esiids
            WHERE is_active = 1
        """)
        
        total, with_esi_id, with_address, with_rep, with_usage, with_billing = cursor.fetchone()
        
        print(f"\n📋 DATA QUALITY ASSESSMENT:")
        print(f"   ESIIDs with ESI ID: {with_esi_id}/{total} ({(with_esi_id/total)*100:.1f}%)")
        print(f"   ESIIDs with address: {with_address}/{total} ({(with_address/total)*100:.1f}%)")
        print(f"   ESIIDs with REP: {with_rep}/{total} ({(with_rep/total)*100:.1f}%)")
        print(f"   ESIIDs with usage data: {with_usage}/{total} ({(with_usage/total)*100:.1f}%)")
        print(f"   ESIIDs with billing data: {with_billing}/{total} ({(with_billing/total)*100:.1f}%)")
        
        # 9. Frontend Data Export Status
        frontend_file = Path("1-frontend/src/data/esiids.json")
        stats_file = Path("1-frontend/src/data/esiid-stats.json")
        
        if frontend_file.exists() and stats_file.exists():
            import json
            with open(frontend_file, 'r') as f:
                frontend_data = json.load(f)
            with open(stats_file, 'r') as f:
                stats_data = json.load(f)
            
            print(f"\n🎨 FRONTEND INTEGRATION:")
            print(f"   ESIIDs exported to frontend: {len(frontend_data)}")
            print(f"   Frontend data file: {frontend_file}")
            print(f"   Statistics file: {stats_file}")
            print(f"   Total kWh in frontend: {sum(e.get('kwhMo', 0) for e in frontend_data):,.0f}")
        else:
            print(f"\n⚠️ FRONTEND INTEGRATION:")
            print(f"   Frontend data files missing")
        
        # 10. Integration Summary
        print(f"\n✅ ESIID INTEGRATION VERIFICATION COMPLETE!")
        print(f"   Database: {db_path}")
        print(f"   ESIIDs: {total_esiids:,} imported")
        print(f"   Usage data: {esiids_with_usage:,} ESIIDs ({(esiids_with_usage/total_esiids)*100:.1f}%)")
        print(f"   Provider links: {esiids_with_provider:,} ESIIDs ({(esiids_with_provider/total_esiids)*100:.1f}%)")
        print(f"   Company links: {esiids_with_company:,} ESIIDs ({(esiids_with_company/total_esiids)*100:.1f}%)")
        print(f"   Total energy: {total_kwh_mo:,.0f} kWh/month" if usage_stats else "")
        print(f"   Total billing: ${total_billing:,.2f}" if usage_stats else "")
        print(f"   Frontend: {'✅ Ready' if frontend_file.exists() else '❌ Missing'}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    verify_esiid_integration()
