#!/usr/bin/env python3
"""
Export ESIID data for frontend
Outputs JSON data that can be used by the React frontend
"""

import sqlite3
import json
from pathlib import Path

def get_esiids_for_frontend():
    """Get ESIID data formatted for frontend consumption"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return []
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get ESIIDs with relevant information
        cursor.execute("""
            SELECT 
                e.id,
                e.esi_id,
                e.account_name,
                e.service_address_1,
                e.rep,
                e.kwh_mo,
                e.kwh_yr,
                e.total_bill,
                e.load_profile,
                e.zone,
                e.status,
                p.name as provider_name,
                mc.company_name as management_company_name
            FROM esiids e
            LEFT JOIN providers p ON e.provider_id = p.id
            LEFT JOIN management_companies mc ON e.management_company_id = mc.id
            WHERE e.is_active = 1 
            AND e.kwh_mo IS NOT NULL 
            AND e.kwh_mo > 0
            ORDER BY e.kwh_mo DESC
            LIMIT 100
        """)
        
        esiids = []
        for row in cursor.fetchall():
            esiid = {
                "id": row[0],
                "esiId": row[1] or "Unknown",
                "accountName": row[2] or "Unknown Account",
                "serviceAddress": row[3] or "No Address",
                "rep": row[4] or "No REP",
                "kwhMo": row[5] or 0,
                "kwhYr": row[6] or 0,
                "totalBill": row[7] or 0,
                "loadProfile": row[8] or "Unknown",
                "zone": row[9] or "Unknown",
                "status": row[10] or 0,
                "providerName": row[11] or "Unknown Provider",
                "managementCompany": row[12] or "Unknown Company",
                "isActive": True,
                "lastReading": "2024-01-01"  # Placeholder
            }
            esiids.append(esiid)
        
        conn.close()
        return esiids
        
    except Exception as e:
        print(f"❌ Error querying database: {e}")
        conn.close()
        return []

def export_esiids_json():
    """Export ESIIDs to JSON file for frontend"""
    esiids = get_esiids_for_frontend()
    
    if esiids:
        # Write to JSON file
        output_file = "1-frontend/src/data/esiids.json"
        Path(output_file).parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(esiids, f, indent=2)
        
        print(f"✅ Exported {len(esiids)} ESIIDs to {output_file}")
        
        # Show sample data
        print(f"\n📋 Sample ESIIDs:")
        for esiid in esiids[:5]:
            print(f"   {esiid['esiId']} - {esiid['accountName']} - {esiid['rep']} - {esiid['kwhMo']:,.0f} kWh/mo")
        
        # Show statistics
        total_kwh_mo = sum(e['kwhMo'] for e in esiids)
        total_kwh_yr = sum(e['kwhYr'] for e in esiids)
        total_billing = sum(e['totalBill'] for e in esiids)
        
        rep_counts = {}
        for e in esiids:
            rep = e['rep']
            rep_counts[rep] = rep_counts.get(rep, 0) + 1
        
        print(f"\n📊 Statistics:")
        print(f"   Total ESIIDs: {len(esiids)}")
        print(f"   Total monthly kWh: {total_kwh_mo:,.0f}")
        print(f"   Total yearly kWh: {total_kwh_yr:,.0f}")
        print(f"   Total billing: ${total_billing:,.2f}")
        print(f"   Average monthly kWh: {total_kwh_mo/len(esiids):,.0f}")
        print(f"   Average bill: ${total_billing/len(esiids):,.2f}")
        
        print(f"\n📊 Top REPs by ESIID Count:")
        for rep, count in sorted(rep_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"   {rep}: {count} ESIIDs")
        
        return True
    else:
        print("❌ No ESIIDs found to export")
        return False

def get_esiid_statistics():
    """Get comprehensive ESIID statistics"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return {}
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Overall statistics
        cursor.execute("""
            SELECT 
                COUNT(*) as total_esiids,
                COUNT(CASE WHEN kwh_mo > 0 THEN 1 END) as with_usage,
                COUNT(CASE WHEN provider_id IS NOT NULL THEN 1 END) as with_provider,
                COUNT(CASE WHEN management_company_id IS NOT NULL THEN 1 END) as with_company,
                SUM(kwh_mo) as total_kwh_mo,
                SUM(kwh_yr) as total_kwh_yr,
                SUM(total_bill) as total_billing,
                AVG(kwh_mo) as avg_kwh_mo,
                AVG(total_bill) as avg_bill
            FROM esiids
            WHERE is_active = 1
        """)
        
        stats = cursor.fetchone()
        
        statistics = {
            "total_esiids": stats[0],
            "with_usage": stats[1],
            "with_provider": stats[2],
            "with_company": stats[3],
            "total_kwh_mo": stats[4] or 0,
            "total_kwh_yr": stats[5] or 0,
            "total_billing": stats[6] or 0,
            "avg_kwh_mo": stats[7] or 0,
            "avg_bill": stats[8] or 0
        }
        
        # Write statistics to JSON file
        output_file = "1-frontend/src/data/esiid-stats.json"
        with open(output_file, 'w') as f:
            json.dump(statistics, f, indent=2)
        
        print(f"✅ Exported ESIID statistics to {output_file}")
        
        conn.close()
        return statistics
        
    except Exception as e:
        print(f"❌ Error getting statistics: {e}")
        conn.close()
        return {}

if __name__ == "__main__":
    print("🚀 Exporting ESIID data for frontend...")
    success = export_esiids_json()
    if success:
        print("\n📊 Getting ESIID statistics...")
        get_esiid_statistics()
        print("✅ ESIID data export completed!")
    else:
        print("❌ ESIID data export failed!")
