#!/usr/bin/env python3
"""
Verify the Daily Pricing Integration
Shows the results of the DAILY PRICING - new.xlsx integration
"""

import sqlite3
from pathlib import Path

def verify_pricing_integration():
    """Verify the daily pricing integration results"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🔍 DAILY PRICING INTEGRATION VERIFICATION")
        print("=" * 60)
        
        # 1. Pricing Statistics
        cursor.execute("SELECT COUNT(*) FROM daily_pricing WHERE is_active = 1")
        total_pricing = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT zone) FROM daily_pricing WHERE zone IS NOT NULL")
        unique_zones = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT rep) FROM daily_pricing WHERE rep IS NOT NULL")
        unique_reps = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM daily_pricing WHERE daily_rate IS NOT NULL AND daily_rate > 0")
        pricing_with_rates = cursor.fetchone()[0]
        
        print(f"\n📊 PRICING DATA:")
        print(f"   Total pricing records: {total_pricing}")
        print(f"   Unique zones: {unique_zones}")
        print(f"   Unique REPs: {unique_reps}")
        print(f"   Records with rates: {pricing_with_rates}")
        
        # 2. Rate Statistics
        cursor.execute("""
            SELECT 
                AVG(daily_rate) as avg_rate,
                MIN(daily_rate) as min_rate,
                MAX(daily_rate) as max_rate,
                COUNT(*) as rate_count
            FROM daily_pricing
            WHERE is_active = 1 AND daily_rate IS NOT NULL AND daily_rate > 0
        """)
        
        rate_stats = cursor.fetchone()
        if rate_stats:
            avg_rate, min_rate, max_rate, rate_count = rate_stats
            print(f"\n💰 RATE STATISTICS:")
            print(f"   Average daily rate: ${avg_rate:.2f}")
            print(f"   Lowest rate: ${min_rate:.2f}")
            print(f"   Highest rate: ${max_rate:.2f}")
            print(f"   Records with valid rates: {rate_count}")
        
        # 3. Zone Analysis
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
        
        print(f"\n🗺️ ZONE ANALYSIS (by avg rate):")
        for zone, count, avg_rate, min_rate, max_rate in cursor.fetchall():
            print(f"   {zone}: {count} records, avg: ${avg_rate:.2f}, range: ${min_rate:.2f}-${max_rate:.2f}")
        
        # 4. REP Analysis
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
        
        print(f"\n🔌 REP ANALYSIS (by avg rate):")
        for rep, count, avg_rate, min_rate, max_rate, zones in cursor.fetchall():
            print(f"   {rep}: {count} records, avg: ${avg_rate:.2f}, range: ${min_rate:.2f}-${max_rate:.2f}, {zones} zones")
        
        # 5. Load Profile Analysis
        cursor.execute("""
            SELECT load_profile, 
                   COUNT(*) as record_count,
                   AVG(daily_rate) as avg_rate
            FROM daily_pricing
            WHERE is_active = 1 AND load_profile IS NOT NULL AND daily_rate IS NOT NULL
            GROUP BY load_profile
            ORDER BY avg_rate ASC
        """)
        
        load_profiles = cursor.fetchall()
        if load_profiles:
            print(f"\n📊 LOAD PROFILE ANALYSIS:")
            for profile, count, avg_rate in load_profiles:
                print(f"   {profile}: {count} records, avg: ${avg_rate:.2f}")
        
        # 6. Term Analysis
        cursor.execute("""
            SELECT term_months, 
                   COUNT(*) as record_count,
                   AVG(daily_rate) as avg_rate
            FROM daily_pricing
            WHERE is_active = 1 AND term_months IS NOT NULL AND daily_rate IS NOT NULL
            GROUP BY term_months
            ORDER BY term_months ASC
        """)
        
        terms = cursor.fetchall()
        if terms:
            print(f"\n📅 CONTRACT TERM ANALYSIS:")
            for term, count, avg_rate in terms[:10]:  # Show top 10
                print(f"   {term} months: {count} records, avg: ${avg_rate:.2f}")
        
        # 7. Best Rates Analysis
        cursor.execute("""
            SELECT zone, rep, daily_rate, term_months, load_profile
            FROM daily_pricing
            WHERE is_active = 1 AND daily_rate IS NOT NULL AND daily_rate > 0
            ORDER BY daily_rate ASC
            LIMIT 10
        """)
        
        print(f"\n🏆 TOP 10 BEST RATES:")
        for zone, rep, rate, term, profile in cursor.fetchall():
            term_display = f"{term} months" if term else "N/A"
            profile_display = profile or "N/A"
            print(f"   ${rate:.2f}/day - {rep} ({zone}) - {term_display} - {profile_display}")
        
        # 8. Date Range Analysis
        cursor.execute("""
            SELECT 
                MIN(effective_date) as earliest_date,
                MAX(effective_date) as latest_date,
                COUNT(DISTINCT DATE(effective_date)) as unique_dates
            FROM daily_pricing
            WHERE is_active = 1 AND effective_date IS NOT NULL
        """)
        
        date_stats = cursor.fetchone()
        if date_stats and date_stats[0]:
            earliest, latest, unique_dates = date_stats
            print(f"\n📅 DATE RANGE ANALYSIS:")
            print(f"   Earliest date: {earliest}")
            print(f"   Latest date: {latest}")
            print(f"   Unique dates: {unique_dates}")
        
        # 9. Data Quality Assessment
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN zone IS NOT NULL AND zone != '' THEN 1 END) as with_zone,
                COUNT(CASE WHEN rep IS NOT NULL AND rep != '' THEN 1 END) as with_rep,
                COUNT(CASE WHEN daily_rate IS NOT NULL AND daily_rate > 0 THEN 1 END) as with_rate,
                COUNT(CASE WHEN effective_date IS NOT NULL THEN 1 END) as with_date,
                COUNT(CASE WHEN term_months IS NOT NULL THEN 1 END) as with_term
            FROM daily_pricing
            WHERE is_active = 1
        """)
        
        total, with_zone, with_rep, with_rate, with_date, with_term = cursor.fetchone()
        
        print(f"\n📋 DATA QUALITY ASSESSMENT:")
        print(f"   Records with zone: {with_zone}/{total} ({(with_zone/total)*100:.1f}%)")
        print(f"   Records with REP: {with_rep}/{total} ({(with_rep/total)*100:.1f}%)")
        print(f"   Records with rate: {with_rate}/{total} ({(with_rate/total)*100:.1f}%)")
        print(f"   Records with date: {with_date}/{total} ({(with_date/total)*100:.1f}%)")
        print(f"   Records with term: {with_term}/{total} ({(with_term/total)*100:.1f}%)")
        
        # 10. Frontend Data Export Status
        frontend_file = Path("1-frontend/src/data/pricing.json")
        stats_file = Path("1-frontend/src/data/pricing-stats.json")
        
        if frontend_file.exists() and stats_file.exists():
            import json
            with open(frontend_file, 'r') as f:
                frontend_data = json.load(f)
            with open(stats_file, 'r') as f:
                stats_data = json.load(f)
            
            print(f"\n🎨 FRONTEND INTEGRATION:")
            print(f"   Pricing records exported: {len(frontend_data)}")
            print(f"   Frontend data file: {frontend_file}")
            print(f"   Statistics file: {stats_file}")
            print(f"   Average rate in frontend: ${stats_data.get('avgRate', 0):.2f}")
        else:
            print(f"\n⚠️ FRONTEND INTEGRATION:")
            print(f"   Frontend data files missing")
        
        # 11. Integration Summary
        print(f"\n✅ PRICING INTEGRATION VERIFICATION COMPLETE!")
        print(f"   Database: {db_path}")
        print(f"   Pricing records: {total_pricing:,}")
        print(f"   Zones covered: {unique_zones}")
        print(f"   REPs included: {unique_reps}")
        print(f"   Rate range: ${min_rate:.2f} - ${max_rate:.2f}" if rate_stats else "")
        print(f"   Average rate: ${avg_rate:.2f}" if rate_stats else "")
        print(f"   Data quality: {((with_zone + with_rep + with_rate)/3/total)*100:.1f}% avg")
        print(f"   Frontend: {'✅ Ready' if frontend_file.exists() else '❌ Missing'}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    verify_pricing_integration()
