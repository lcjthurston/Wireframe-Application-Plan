#!/usr/bin/env python3
"""
Verify the REP Integration
Shows the results of the REP.xlsx integration
"""

import sqlite3
from pathlib import Path

def verify_rep_integration():
    """Verify the REP integration results"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🔍 REP/PROVIDER INTEGRATION VERIFICATION")
        print("=" * 60)
        
        # 1. Provider Statistics
        cursor.execute("SELECT COUNT(*) FROM providers WHERE is_active = 1")
        total_providers = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM providers WHERE rep_active = 1")
        active_reps = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM providers WHERE rep_email IS NOT NULL AND rep_email != ''")
        providers_with_email = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM providers WHERE rep_phone IS NOT NULL AND rep_phone != ''")
        providers_with_phone = cursor.fetchone()[0]
        
        print(f"\n📊 ENERGY PROVIDERS:")
        print(f"   Total providers imported: {total_providers}")
        print(f"   REP active providers: {active_reps}")
        print(f"   Providers with email: {providers_with_email}")
        print(f"   Providers with phone: {providers_with_phone}")
        
        # 2. Refund Type Distribution
        cursor.execute("""
            SELECT refund_type, COUNT(*) as count
            FROM providers
            WHERE is_active = 1 AND refund_type IS NOT NULL
            GROUP BY refund_type
            ORDER BY count DESC
        """)
        
        print(f"\n📈 REFUND TYPE DISTRIBUTION:")
        for refund_type, count in cursor.fetchall():
            print(f"   {refund_type}: {count} providers")
        
        # 3. Top Active Providers
        cursor.execute("""
            SELECT name, rep_contact, rep_phone, refund_type
            FROM providers
            WHERE rep_active = 1 AND name IS NOT NULL
            ORDER BY name
            LIMIT 15
        """)
        
        print(f"\n🔌 ACTIVE ENERGY PROVIDERS:")
        for name, contact, phone, refund_type in cursor.fetchall():
            contact_info = f" ({contact})" if contact else ""
            phone_info = f" - {phone}" if phone else ""
            refund_info = f" [{refund_type}]" if refund_type else ""
            print(f"   {name}{contact_info}{phone_info}{refund_info}")
        
        # 4. Provider Contact Quality
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN rep_phone IS NOT NULL AND rep_phone != '' THEN 1 ELSE 0 END) as with_phone,
                SUM(CASE WHEN rep_email IS NOT NULL AND rep_email != '' THEN 1 ELSE 0 END) as with_email,
                SUM(CASE WHEN rep_contact IS NOT NULL AND rep_contact != '' THEN 1 ELSE 0 END) as with_contact,
                SUM(CASE WHEN city_state_zip IS NOT NULL AND city_state_zip != '' THEN 1 ELSE 0 END) as with_address
            FROM providers
            WHERE is_active = 1
        """)
        
        total, with_phone, with_email, with_contact, with_address = cursor.fetchone()
        
        print(f"\n📋 PROVIDER DATA QUALITY:")
        print(f"   Providers with phone: {with_phone}/{total} ({(with_phone/total)*100:.1f}%)")
        print(f"   Providers with email: {with_email}/{total} ({(with_email/total)*100:.1f}%)")
        print(f"   Providers with contact: {with_contact}/{total} ({(with_contact/total)*100:.1f}%)")
        print(f"   Providers with address: {with_address}/{total} ({(with_address/total)*100:.1f}%)")
        
        # 5. Payment Terms Analysis
        cursor.execute("""
            SELECT rep_payment_terms, COUNT(*) as count
            FROM providers
            WHERE is_active = 1 AND rep_payment_terms IS NOT NULL AND rep_payment_terms != ''
            GROUP BY rep_payment_terms
            ORDER BY count DESC
            LIMIT 5
        """)
        
        payment_terms = cursor.fetchall()
        if payment_terms:
            print(f"\n💰 PAYMENT TERMS (Top 5):")
            for terms, count in payment_terms:
                print(f"   {terms}: {count} providers")
        
        # 6. Tax Information
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN rep_fed_tax_id IS NOT NULL AND rep_fed_tax_id != '' THEN 1 ELSE 0 END) as with_tax_id,
                SUM(CASE WHEN tax_email IS NOT NULL AND tax_email != '' THEN 1 ELSE 0 END) as with_tax_email
            FROM providers
            WHERE is_active = 1
        """)
        
        total, with_tax_id, with_tax_email = cursor.fetchone()
        
        print(f"\n🏛️ TAX INFORMATION:")
        print(f"   Providers with Federal Tax ID: {with_tax_id}/{total} ({(with_tax_id/total)*100:.1f}%)")
        print(f"   Providers with Tax Email: {with_tax_email}/{total} ({(with_tax_email/total)*100:.1f}%)")
        
        # 7. Frontend Data Export Status
        frontend_file = Path("1-frontend/src/data/providers.json")
        if frontend_file.exists():
            import json
            with open(frontend_file, 'r') as f:
                frontend_data = json.load(f)
            print(f"\n🎨 FRONTEND INTEGRATION:")
            print(f"   Providers exported to frontend: {len(frontend_data)}")
            print(f"   Frontend data file: {frontend_file}")
            
            # Show frontend statistics
            active_in_frontend = sum(1 for p in frontend_data if p.get('isRepActive'))
            print(f"   Active providers in frontend: {active_in_frontend}")
        else:
            print(f"\n⚠️ FRONTEND INTEGRATION:")
            print(f"   Frontend data file not found: {frontend_file}")
        
        # 8. Integration Summary
        print(f"\n✅ REP INTEGRATION VERIFICATION COMPLETE!")
        print(f"   Database: {db_path}")
        print(f"   Providers: {total_providers} imported")
        print(f"   Active REPs: {active_reps}/{total_providers}")
        print(f"   Contact Quality: {((with_phone + with_email)/2/total)*100:.1f}% avg")
        print(f"   Frontend: {'✅ Ready' if frontend_file.exists() else '❌ Missing'}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        conn.close()
        return False

if __name__ == "__main__":
    verify_rep_integration()
