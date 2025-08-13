#!/usr/bin/env python3
"""
Export daily pricing data for frontend
Outputs JSON data that can be used by the React frontend
"""

import sqlite3
import json
from pathlib import Path

def get_pricing_for_frontend():
    """Get pricing data formatted for frontend consumption"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return []
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get pricing data with relevant information
        cursor.execute("""
            SELECT 
                p.id,
                p.effective_date,
                p.zone,
                p.rep,
                p.load_profile,
                p.daily_rate,
                p.term_months,
                p.min_mwh,
                p.max_mwh,
                p.commercial_discount,
                p.hoa_discount,
                p.broker_fee
            FROM daily_pricing p
            WHERE p.is_active = 1 
            AND p.daily_rate IS NOT NULL
            ORDER BY p.daily_rate ASC
            LIMIT 100
        """)
        
        pricing_records = []
        for row in cursor.fetchall():
            pricing = {
                "id": row[0],
                "effectiveDate": row[1] or None,
                "zone": row[2] or "Unknown Zone",
                "rep": row[3] or "Unknown REP",
                "loadProfile": row[4] or "Unknown",
                "dailyRate": float(row[5]) if row[5] else 0,
                "termMonths": float(row[6]) if row[6] else 0,
                "minMwh": float(row[7]) if row[7] else 0,
                "maxMwh": float(row[8]) if row[8] else 0,
                "commercialDiscount": float(row[9]) if row[9] else 0,
                "hoaDiscount": float(row[10]) if row[10] else 0,
                "brokerFee": float(row[11]) if row[11] else 0,
                "isActive": True
            }
            pricing_records.append(pricing)
        
        conn.close()
        return pricing_records
        
    except Exception as e:
        print(f"❌ Error querying database: {e}")
        conn.close()
        return []

def get_pricing_statistics():
    """Get pricing statistics for frontend"""
    
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
                COUNT(*) as total_records,
                COUNT(DISTINCT zone) as unique_zones,
                COUNT(DISTINCT rep) as unique_reps,
                AVG(daily_rate) as avg_rate,
                MIN(daily_rate) as min_rate,
                MAX(daily_rate) as max_rate
            FROM daily_pricing
            WHERE is_active = 1 AND daily_rate IS NOT NULL
        """)
        
        stats = cursor.fetchone()
        
        # Zone analysis
        cursor.execute("""
            SELECT zone, 
                   COUNT(*) as record_count,
                   AVG(daily_rate) as avg_rate,
                   MIN(daily_rate) as min_rate,
                   MAX(daily_rate) as max_rate
            FROM daily_pricing
            WHERE is_active = 1 AND zone IS NOT NULL AND daily_rate IS NOT NULL
            GROUP BY zone
            ORDER BY avg_rate ASC
        """)
        
        zone_analysis = []
        for zone, count, avg_rate, min_rate, max_rate in cursor.fetchall():
            zone_analysis.append({
                "zone": zone,
                "recordCount": count,
                "avgRate": float(avg_rate),
                "minRate": float(min_rate),
                "maxRate": float(max_rate)
            })
        
        # REP analysis
        cursor.execute("""
            SELECT rep, 
                   COUNT(*) as record_count,
                   AVG(daily_rate) as avg_rate,
                   MIN(daily_rate) as min_rate,
                   MAX(daily_rate) as max_rate,
                   COUNT(DISTINCT zone) as zones_served
            FROM daily_pricing
            WHERE is_active = 1 AND rep IS NOT NULL AND daily_rate IS NOT NULL
            GROUP BY rep
            ORDER BY avg_rate ASC
        """)
        
        rep_analysis = []
        for rep, count, avg_rate, min_rate, max_rate, zones in cursor.fetchall():
            rep_analysis.append({
                "rep": rep,
                "recordCount": count,
                "avgRate": float(avg_rate),
                "minRate": float(min_rate),
                "maxRate": float(max_rate),
                "zonesServed": zones
            })
        
        # Best rates by zone
        cursor.execute("""
            SELECT zone, rep, daily_rate, term_months
            FROM daily_pricing
            WHERE is_active = 1 AND daily_rate IS NOT NULL
            ORDER BY daily_rate ASC
            LIMIT 20
        """)
        
        best_rates = []
        for zone, rep, rate, term in cursor.fetchall():
            best_rates.append({
                "zone": zone,
                "rep": rep,
                "rate": float(rate),
                "termMonths": float(term) if term else 0
            })
        
        statistics = {
            "totalRecords": stats[0] or 0,
            "uniqueZones": stats[1] or 0,
            "uniqueReps": stats[2] or 0,
            "avgRate": float(stats[3]) if stats[3] else 0,
            "minRate": float(stats[4]) if stats[4] else 0,
            "maxRate": float(stats[5]) if stats[5] else 0,
            "zoneAnalysis": zone_analysis,
            "repAnalysis": rep_analysis,
            "bestRates": best_rates
        }
        
        conn.close()
        return statistics
        
    except Exception as e:
        print(f"❌ Error getting statistics: {e}")
        conn.close()
        return {}

def export_pricing_data():
    """Export pricing data and statistics to JSON files for frontend"""
    
    # Export pricing data
    pricing_records = get_pricing_for_frontend()
    
    if pricing_records:
        # Write to JSON file
        output_file = "1-frontend/src/data/pricing.json"
        Path(output_file).parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(pricing_records, f, indent=2)
        
        print(f"✅ Exported {len(pricing_records)} pricing records to {output_file}")
        
        # Show sample data
        print(f"\n📋 Sample pricing records:")
        for pricing in pricing_records[:5]:
            rate = pricing['dailyRate']
            zone = pricing['zone']
            rep = pricing['rep']
            print(f"   {zone} - {rep} - ${rate:.2f}/day")
        
        # Export statistics
        stats = get_pricing_statistics()
        if stats:
            stats_file = "1-frontend/src/data/pricing-stats.json"
            with open(stats_file, 'w') as f:
                json.dump(stats, f, indent=2)
            
            print(f"✅ Exported pricing statistics to {stats_file}")
            
            print(f"\n📊 Pricing Statistics:")
            print(f"   Total pricing records: {stats['totalRecords']}")
            print(f"   Unique zones: {stats['uniqueZones']}")
            print(f"   Unique REPs: {stats['uniqueReps']}")
            print(f"   Average daily rate: ${stats['avgRate']:.2f}")
            print(f"   Rate range: ${stats['minRate']:.2f} - ${stats['maxRate']:.2f}")
            
            if stats['zoneAnalysis']:
                print(f"\n📊 Zone Analysis (by avg rate):")
                for zone_data in stats['zoneAnalysis'][:5]:
                    print(f"   {zone_data['zone']}: ${zone_data['avgRate']:.2f} avg ({zone_data['recordCount']} records)")
            
            if stats['repAnalysis']:
                print(f"\n📊 REP Analysis (by avg rate):")
                for rep_data in stats['repAnalysis'][:5]:
                    print(f"   {rep_data['rep']}: ${rep_data['avgRate']:.2f} avg ({rep_data['recordCount']} records)")
        
        return True
    else:
        print("❌ No pricing records found to export")
        return False

if __name__ == "__main__":
    print("🚀 Exporting pricing data for frontend...")
    success = export_pricing_data()
    if success:
        print("✅ Pricing data export completed!")
    else:
        print("❌ Pricing data export failed!")
