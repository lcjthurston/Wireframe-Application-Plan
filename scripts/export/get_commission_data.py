#!/usr/bin/env python3
"""
Export commission data for frontend
Outputs JSON data that can be used by the React frontend
"""

import sqlite3
import json
from pathlib import Path

def get_commissions_for_frontend():
    """Get commission data formatted for frontend consumption"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return []
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get commissions with relevant information
        cursor.execute("""
            SELECT 
                c.id,
                c.account_name,
                c.k_rep,
                c.commission_type,
                c.actual_payment_amount,
                c.actual_payment_received,
                c.actual_payment_date,
                c.payment_type,
                c.contract_date,
                c.start_date,
                c.end_date,
                c.is_active,
                c.annual_amount,
                c.contracted_amount,
                c.status
            FROM commissions c
            WHERE c.account_name IS NOT NULL
            ORDER BY 
                CASE WHEN c.commission_type = 'received' THEN c.actual_payment_date 
                     ELSE c.contract_date END DESC
            LIMIT 100
        """)
        
        commissions = []
        for row in cursor.fetchall():
            commission = {
                "id": row[0],
                "accountName": row[1] or "Unknown Account",
                "kRep": row[2] or "Unknown REP",
                "commissionType": row[3] or "unknown",
                "actualPaymentAmount": float(row[4]) if row[4] else 0,
                "actualPaymentReceived": float(row[5]) if row[5] else 0,
                "actualPaymentDate": row[6] or None,
                "paymentType": row[7] or "Unknown",
                "contractDate": row[8] or None,
                "startDate": row[9] or None,
                "endDate": row[10] or None,
                "isActive": bool(row[11]) if row[11] is not None else True,
                "annualAmount": row[12] or "0",
                "contractedAmount": row[13] or "0",
                "status": row[14] or "pending"
            }
            commissions.append(commission)
        
        conn.close()
        return commissions
        
    except Exception as e:
        print(f"❌ Error querying database: {e}")
        conn.close()
        return []

def get_commission_statistics():
    """Get commission statistics for frontend"""
    
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
                COUNT(*) as total_commissions,
                COUNT(CASE WHEN commission_type = 'received' THEN 1 END) as received_count,
                COUNT(CASE WHEN commission_type = 'scheduled' THEN 1 END) as scheduled_count,
                COUNT(CASE WHEN commission_type = 'scheduled' AND is_active = 1 THEN 1 END) as active_schedules,
                SUM(CASE WHEN commission_type = 'received' THEN actual_payment_amount ELSE 0 END) as total_received_amount,
                AVG(CASE WHEN commission_type = 'received' THEN actual_payment_amount ELSE NULL END) as avg_received_amount
            FROM commissions
        """)
        
        stats = cursor.fetchone()
        
        # Top REPs by commission amount
        cursor.execute("""
            SELECT k_rep, 
                   COUNT(*) as commission_count,
                   SUM(actual_payment_amount) as total_amount
            FROM commissions
            WHERE commission_type = 'received' AND k_rep IS NOT NULL
            GROUP BY k_rep
            ORDER BY total_amount DESC
            LIMIT 10
        """)
        
        top_reps = []
        for rep, count, total in cursor.fetchall():
            top_reps.append({
                "rep": rep,
                "commissionCount": count,
                "totalAmount": float(total) if total else 0
            })
        
        # Monthly breakdown for current year
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
        
        monthly_data = {}
        for month, count, total in cursor.fetchall():
            if month:
                month_names = {
                    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
                    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
                    '09': 'September', '10': 'October', '11': 'November', '12': 'December'
                }
                month_name = month_names.get(month, f"Month {month}")
                monthly_data[month_name] = {
                    "count": count,
                    "totalAmount": float(total) if total else 0
                }
        
        statistics = {
            "totalCommissions": stats[0] or 0,
            "receivedCount": stats[1] or 0,
            "scheduledCount": stats[2] or 0,
            "activeSchedules": stats[3] or 0,
            "totalReceivedAmount": float(stats[4]) if stats[4] else 0,
            "avgReceivedAmount": float(stats[5]) if stats[5] else 0,
            "topReps": top_reps,
            "monthlyData": monthly_data
        }
        
        conn.close()
        return statistics
        
    except Exception as e:
        print(f"❌ Error getting statistics: {e}")
        conn.close()
        return {}

def export_commission_data():
    """Export commission data and statistics to JSON files for frontend"""
    
    # Export commission data
    commissions = get_commissions_for_frontend()
    
    if commissions:
        # Write to JSON file
        output_file = "1-frontend/src/data/commissions.json"
        Path(output_file).parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(commissions, f, indent=2)
        
        print(f"✅ Exported {len(commissions)} commissions to {output_file}")
        
        # Show sample data
        print(f"\n📋 Sample commissions:")
        for commission in commissions[:5]:
            amount = commission['actualPaymentAmount']
            type_display = commission['commissionType']
            print(f"   {commission['accountName']} - {commission['kRep']} - {type_display} - ${amount:,.2f}")
        
        # Export statistics
        stats = get_commission_statistics()
        if stats:
            stats_file = "1-frontend/src/data/commission-stats.json"
            with open(stats_file, 'w') as f:
                json.dump(stats, f, indent=2)
            
            print(f"✅ Exported commission statistics to {stats_file}")
            
            print(f"\n📊 Commission Statistics:")
            print(f"   Total commissions: {stats['totalCommissions']}")
            print(f"   Received commissions: {stats['receivedCount']}")
            print(f"   Scheduled commissions: {stats['scheduledCount']}")
            print(f"   Total received amount: ${stats['totalReceivedAmount']:,.2f}")
            print(f"   Average received amount: ${stats['avgReceivedAmount']:,.2f}")
            
            if stats['topReps']:
                print(f"\n📊 Top REPs by Commission Amount:")
                for rep_data in stats['topReps'][:5]:
                    print(f"   {rep_data['rep']}: ${rep_data['totalAmount']:,.2f} ({rep_data['commissionCount']} commissions)")
        
        return True
    else:
        print("❌ No commissions found to export")
        return False

if __name__ == "__main__":
    print("🚀 Exporting commission data for frontend...")
    success = export_commission_data()
    if success:
        print("✅ Commission data export completed!")
    else:
        print("❌ Commission data export failed!")
