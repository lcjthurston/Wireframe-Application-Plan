#!/usr/bin/env python3
"""
Account Data Export Script
Exports account data from SQLite database to JSON for frontend consumption
"""

import sqlite3
import json
from pathlib import Path

def get_accounts_from_db():
    """Get account data from SQLite database"""
    
    db_path = "2-backend/kilowatt_dev.db"
    if not Path(db_path).exists():
        print(f"❌ Database not found: {db_path}")
        return []
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if accounts table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='accounts'")
        if not cursor.fetchone():
            print("❌ Accounts table not found. Please run import_accounts.py first.")
            return []
        
        # Get account data with all relevant fields
        cursor.execute("""
            SELECT 
                id,
                account_list_id,
                account_name,
                manager_name,
                management_company,
                procurement_status,
                contact_name,
                email,
                telephone,
                fax,
                billing_street,
                billing_city,
                billing_state,
                billing_zip,
                legal_name,
                fed_tax_id,
                customer_type,
                usage_kwh,
                load_profile,
                max_kva,
                activity_date,
                current_activity,
                zone_account,
                usage_date,
                usage_tdsp,
                created_at,
                updated_at
            FROM accounts
            ORDER BY account_name
        """)
        
        rows = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        accounts = []
        for row in rows:
            account = {
                "id": row[0],
                "accountListId": row[1],
                "accountName": row[2],
                "managerName": row[3],
                "managementCompany": row[4],
                "procurementStatus": row[5],
                "contactName": row[6],
                "email": row[7],
                "telephone": row[8],
                "fax": row[9],
                "billingStreet": row[10],
                "billingCity": row[11],
                "billingState": row[12],
                "billingZip": row[13],
                "legalName": row[14],
                "fedTaxId": row[15],
                "customerType": row[16],
                "usageKwh": row[17] if row[17] is not None else 0,
                "loadProfile": row[18],
                "maxKva": row[19],
                "activityDate": row[20],
                "currentActivity": row[21],
                "zoneAccount": row[22],
                "usageDate": row[23],
                "usageTdsp": row[24],
                "createdAt": row[25],
                "updatedAt": row[26]
            }
            
            # Add computed fields for frontend compatibility
            account["name"] = account["accountName"]  # Legacy compatibility
            account["status"] = account["procurementStatus"] or "Unknown"
            
            # Format usage for display
            if account["usageKwh"] and account["usageKwh"] > 0:
                if account["usageKwh"] >= 1000000:
                    account["usage"] = f"{account['usageKwh']/1000000:.1f}M kWh/year"
                elif account["usageKwh"] >= 1000:
                    account["usage"] = f"{account['usageKwh']/1000:.0f}K kWh/year"
                else:
                    account["usage"] = f"{account['usageKwh']:.0f} kWh/year"
            else:
                account["usage"] = "No usage data"
            
            # Format address
            address_parts = []
            if account["billingStreet"]:
                address_parts.append(account["billingStreet"])
            if account["billingCity"]:
                city_state_zip = account["billingCity"]
                if account["billingState"]:
                    city_state_zip += f", {account['billingState']}"
                if account["billingZip"]:
                    city_state_zip += f" {account['billingZip']}"
                address_parts.append(city_state_zip)
            
            account["address"] = ", ".join(address_parts) if address_parts else "No address"
            
            # Count ESIIDs (placeholder - would need to join with ESIIDs table)
            account["esiidCount"] = 0  # TODO: Implement ESIID count query
            
            accounts.append(account)
        
        return accounts
        
    except Exception as e:
        print(f"❌ Error reading accounts from database: {e}")
        return []

def export_accounts_to_json():
    """Export account data to JSON file for frontend"""
    
    print("📖 Reading account data from database...")
    accounts = get_accounts_from_db()
    
    if not accounts:
        print("❌ No account data found")
        return False
    
    # Write to JSON file
    output_file = "1-frontend/src/data/accounts.json"
    Path(output_file).parent.mkdir(exist_ok=True)
    
    with open(output_file, 'w') as f:
        json.dump(accounts, f, indent=2)
    
    print(f"✅ Exported {len(accounts)} accounts to {output_file}")
    
    # Show sample data
    print(f"\n📋 Sample Accounts:")
    for account in accounts[:5]:
        status = account['status'][:20] + "..." if len(account['status']) > 20 else account['status']
        print(f"   {account['accountName'][:30]:<30} - {account['managerName'] or 'No Manager':<20} - {status}")
    
    # Show statistics
    total_usage = sum(a['usageKwh'] for a in accounts if a['usageKwh'])
    accounts_with_usage = len([a for a in accounts if a['usageKwh'] and a['usageKwh'] > 0])
    accounts_with_managers = len([a for a in accounts if a['managerName']])
    
    status_counts = {}
    for account in accounts:
        status = account['status']
        status_counts[status] = status_counts.get(status, 0) + 1
    
    mgmt_company_counts = {}
    for account in accounts:
        company = account['managementCompany'] or 'No Company'
        mgmt_company_counts[company] = mgmt_company_counts.get(company, 0) + 1
    
    print(f"\n📊 Account Statistics:")
    print(f"   Total accounts: {len(accounts):,}")
    print(f"   Accounts with usage data: {accounts_with_usage:,}")
    print(f"   Accounts with managers: {accounts_with_managers:,}")
    print(f"   Total usage: {total_usage:,.0f} kWh/year")
    
    print(f"\n📈 Top Procurement Statuses:")
    for status, count in sorted(status_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"   {status}: {count:,} accounts")
    
    print(f"\n🏢 Top Management Companies:")
    for company, count in sorted(mgmt_company_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
        company_name = company[:40] + "..." if len(company) > 40 else company
        print(f"   {company_name}: {count:,} accounts")
    
    return True

if __name__ == "__main__":
    success = export_accounts_to_json()
    if success:
        print("\n🎉 Account data export completed successfully!")
        print("💡 Next steps:")
        print("   1. Update frontend AccountsList component to use real data")
        print("   2. Test the accounts table functionality")
    else:
        print("\n💥 Account data export failed!")
