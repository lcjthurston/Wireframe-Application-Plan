#!/usr/bin/env python3
"""
Verify the Commission Integration
Shows the results of the commission data integration
"""

import sqlite3
from pathlib import Path

def verify_commission_integration():
    """Verify the commission integration results"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🔍 COMMISSION INTEGRATION VERIFICATION")
        print("=" * 60)
        
        # 1. Commission Statistics
        cursor.execute("SELECT COUNT(*) FROM commissions")
        total_commissions = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM commissions WHERE commission_type = 'received'")
        received_commissions = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM commissions WHERE commission_type = 'scheduled'")
        scheduled_commissions = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM commissions WHERE commission_type = 'scheduled' AND is_active = 1")
        active_schedules = cursor.fetchone()[0]
        
        print(f"\n📊 COMMISSION DATA:")
        print(f"   Total commissions imported: {total_commissions}")
        print(f"   Received commissions: {received_commissions}")
        print(f"   Scheduled commissions: {scheduled_commissions}")
        print(f"   Active schedules: {active_schedules}")
        
        # 2. Financial Statistics
        cursor.execute("""
            SELECT 
                SUM(actual_payment_amount) as total_received,
                AVG(actual_payment_amount) as avg_received,
                MAX(actual_payment_amount) as max_received,
                MIN(actual_payment_amount) as min_received
            FROM commissions
            WHERE commission_type = 'received' AND actual_payment_amount IS NOT NULL
        """)
        
        financial_stats = cursor.fetchone()
        if financial_stats:
            total_received, avg_received, max_received, min_received = financial_stats
            print(f"\n💰 FINANCIAL STATISTICS:")
            print(f"   Total received amount: ${total_received:,.2f}")
            print(f"   Average commission: ${avg_received:,.2f}")
            print(f"   Highest commission: ${max_received:,.2f}")
            print(f"   Lowest commission: ${min_received:,.2f}")
        
        # 3. Top REPs by Commission Amount
        cursor.execute("""
            SELECT k_rep, 
                   COUNT(*) as commission_count,
                   SUM(actual_payment_amount) as total_amount,
                   AVG(actual_payment_amount) as avg_amount
            FROM commissions
            WHERE commission_type = 'received' AND k_rep IS NOT NULL AND actual_payment_amount IS NOT NULL
            GROUP BY k_rep
            ORDER BY total_amount DESC
            LIMIT 10
        """)
        
        print(f"\n🏆 TOP 10 REPs BY COMMISSION AMOUNT:")
        for rep, count, total, avg in cursor.fetchall():
            print(f"   {rep}: ${total:,.2f} ({count} commissions, avg: ${avg:,.2f})")
        
        # 4. Payment Type Distribution
        cursor.execute("""
            SELECT payment_type, COUNT(*) as count, SUM(actual_payment_amount) as total_amount
            FROM commissions
            WHERE commission_type = 'received' AND payment_type IS NOT NULL
            GROUP BY payment_type
            ORDER BY count DESC
        """)
        
        payment_types = cursor.fetchall()
        if payment_types:
            print(f"\n💳 PAYMENT TYPE DISTRIBUTION:")
            for payment_type, count, total in payment_types:
                print(f"   {payment_type}: {count} payments (${total:,.2f})")
        
        # 5. Monthly Commission Breakdown (2024)
        cursor.execute("""
            SELECT strftime('%m', actual_payment_date) as month,
                   COUNT(*) as count,
                   SUM(actual_payment_amount) as total_amount
            FROM commissions
            WHERE commission_type = 'received' 
            AND strftime('%Y', actual_payment_date) = '2024'
            AND actual_payment_date IS NOT NULL
            GROUP BY strftime('%m', actual_payment_date)
            ORDER BY month
        """)
        
        monthly_data = cursor.fetchall()
        if monthly_data:
            print(f"\n📅 MONTHLY BREAKDOWN (2024):")
            month_names = {
                '01': 'January', '02': 'February', '03': 'March', '04': 'April',
                '05': 'May', '06': 'June', '07': 'July', '08': 'August',
                '09': 'September', '10': 'October', '11': 'November', '12': 'December'
            }
            for month, count, total in monthly_data:
                month_name = month_names.get(month, f"Month {month}")
                print(f"   {month_name}: {count} commissions (${total:,.2f})")
        
        # 6. Commission Status Distribution
        cursor.execute("""
            SELECT status, COUNT(*) as count
            FROM commissions
            WHERE status IS NOT NULL
            GROUP BY status
            ORDER BY count DESC
        """)
        
        status_distribution = cursor.fetchall()
        if status_distribution:
            print(f"\n📋 COMMISSION STATUS DISTRIBUTION:")
            for status, count in status_distribution:
                print(f"   {status}: {count} commissions")
        
        # 7. Account Analysis
        cursor.execute("""
            SELECT account_name, 
                   COUNT(*) as commission_count,
                   SUM(CASE WHEN commission_type = 'received' THEN actual_payment_amount ELSE 0 END) as total_received
            FROM commissions
            WHERE account_name IS NOT NULL
            GROUP BY account_name
            HAVING total_received > 0
            ORDER BY total_received DESC
            LIMIT 10
        """)
        
        print(f"\n🏢 TOP 10 ACCOUNTS BY COMMISSION AMOUNT:")
        for account, count, total in cursor.fetchall():
            print(f"   {account}: ${total:,.2f} ({count} commissions)")
        
        # 8. Data Quality Assessment
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN account_name IS NOT NULL AND account_name != '' THEN 1 END) as with_account,
                COUNT(CASE WHEN k_rep IS NOT NULL AND k_rep != '' THEN 1 END) as with_rep,
                COUNT(CASE WHEN commission_type = 'received' AND actual_payment_amount IS NOT NULL THEN 1 END) as with_amount,
                COUNT(CASE WHEN commission_type = 'received' AND actual_payment_date IS NOT NULL THEN 1 END) as with_date
            FROM commissions
        """)
        
        total, with_account, with_rep, with_amount, with_date = cursor.fetchone()
        
        print(f"\n📋 DATA QUALITY ASSESSMENT:")
        print(f"   Commissions with account name: {with_account}/{total} ({(with_account/total)*100:.1f}%)")
        print(f"   Commissions with REP: {with_rep}/{total} ({(with_rep/total)*100:.1f}%)")
        print(f"   Received with amount: {with_amount}/{received_commissions} ({(with_amount/received_commissions)*100:.1f}%)")
        print(f"   Received with date: {with_date}/{received_commissions} ({(with_date/received_commissions)*100:.1f}%)")
        
        # 9. Frontend Data Export Status
        frontend_file = Path("1-frontend/src/data/commissions.json")
        stats_file = Path("1-frontend/src/data/commission-stats.json")
        
        if frontend_file.exists() and stats_file.exists():
            import json
            with open(frontend_file, 'r') as f:
                frontend_data = json.load(f)
            with open(stats_file, 'r') as f:
                stats_data = json.load(f)
            
            print(f"\n🎨 FRONTEND INTEGRATION:")
            print(f"   Commissions exported to frontend: {len(frontend_data)}")
            print(f"   Frontend data file: {frontend_file}")
            print(f"   Statistics file: {stats_file}")
            print(f"   Total amount in frontend: ${stats_data.get('totalReceivedAmount', 0):,.2f}")
        else:
            print(f"\n⚠️ FRONTEND INTEGRATION:")
            print(f"   Frontend data files missing")
        
        # 10. Integration Summary
        print(f"\n✅ COMMISSION INTEGRATION VERIFICATION COMPLETE!")
        print(f"   Database: {db_path}")
        print(f"   Total commissions: {total_commissions:,}")
        print(f"   Received commissions: {received_commissions:,}")
        print(f"   Scheduled commissions: {scheduled_commissions:,}")
        print(f"   Total received amount: ${total_received:,.2f}" if financial_stats else "")
        print(f"   Average commission: ${avg_received:,.2f}" if financial_stats else "")
        print(f"   Data quality: {((with_account + with_rep)/2/total)*100:.1f}% avg")
        print(f"   Frontend: {'✅ Ready' if frontend_file.exists() else '❌ Missing'}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    verify_commission_integration()
