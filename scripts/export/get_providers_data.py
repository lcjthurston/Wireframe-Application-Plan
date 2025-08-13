#!/usr/bin/env python3
"""
Export provider data for frontend
Outputs JSON data that can be used by the React frontend
"""

import sqlite3
import json
from pathlib import Path

def get_providers_for_frontend():
    """Get provider data formatted for frontend consumption"""
    
    # Connect to SQLite database
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return []
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get providers with relevant information
        cursor.execute("""
            SELECT 
                id,
                name,
                rep_contact,
                rep_phone,
                rep_email,
                refund_type,
                rep_active,
                city_state_zip,
                rep_payment_terms,
                rep_note
            FROM providers
            WHERE is_active = 1 AND name IS NOT NULL
            ORDER BY rep_active DESC, name
            LIMIT 50
        """)
        
        providers = []
        for row in cursor.fetchall():
            provider = {
                "id": row[0],
                "name": row[1] or "Unknown Provider",
                "contact": row[2] or "No Contact",
                "phone": row[3] or "No Phone",
                "email": row[4] or "No Email",
                "refundType": row[5] or "Unknown",
                "isRepActive": row[6] == 1.0 if row[6] is not None else False,
                "location": row[7] or "No Location",
                "paymentTerms": row[8] or "No Terms",
                "notes": row[9] or "",
                "accountCount": 0,  # We'll set this to 0 for now
                "commissionTotal": 0,  # We'll set this to 0 for now
                "lastActivity": "2024-01-01"  # Placeholder
            }
            providers.append(provider)
        
        conn.close()
        return providers
        
    except Exception as e:
        print(f"❌ Error querying database: {e}")
        conn.close()
        return []

def export_providers_json():
    """Export providers to JSON file for frontend"""
    providers = get_providers_for_frontend()
    
    if providers:
        # Write to JSON file
        output_file = "1-frontend/src/data/providers.json"
        Path(output_file).parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(providers, f, indent=2)
        
        print(f"✅ Exported {len(providers)} providers to {output_file}")
        
        # Show sample data
        print(f"\n📋 Sample providers:")
        for provider in providers[:5]:
            status = "🟢 Active" if provider['isRepActive'] else "🔴 Inactive"
            print(f"   {provider['name']} - {provider['refundType']} {status}")
        
        # Show statistics
        active_providers = sum(1 for p in providers if p['isRepActive'])
        refund_types = {}
        for p in providers:
            refund_type = p['refundType']
            refund_types[refund_type] = refund_types.get(refund_type, 0) + 1
        
        print(f"\n📊 Statistics:")
        print(f"   Total providers: {len(providers)}")
        print(f"   Active providers: {active_providers}")
        print(f"   Inactive providers: {len(providers) - active_providers}")
        
        print(f"\n📊 Refund Type Distribution:")
        for refund_type, count in sorted(refund_types.items(), key=lambda x: x[1], reverse=True):
            print(f"   {refund_type}: {count} providers")
        
        return True
    else:
        print("❌ No providers found to export")
        return False

if __name__ == "__main__":
    print("🚀 Exporting provider data for frontend...")
    success = export_providers_json()
    if success:
        print("✅ Provider data export completed!")
    else:
        print("❌ Provider data export failed!")
