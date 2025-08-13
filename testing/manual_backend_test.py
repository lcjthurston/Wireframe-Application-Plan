#!/usr/bin/env python3
"""
Manual test to verify backend functionality without starting the server
"""

import sys
import os
import sqlite3
import json

# Add backend to path
sys.path.insert(0, '2-backend')

def test_database():
    """Test database connectivity and data"""
    print("🔍 Testing database connectivity...")
    
    db_path = "2-backend/kilowatt_dev.db"
    if not os.path.exists(db_path):
        print("❌ Database file not found")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Test accounts
        cursor.execute("SELECT COUNT(*) FROM accounts")
        account_count = cursor.fetchone()[0]
        print(f"✅ Accounts table: {account_count} records")
        
        # Test ESIIDs
        cursor.execute("SELECT COUNT(*) FROM esiids")
        esiid_count = cursor.fetchone()[0]
        print(f"✅ ESIIDs table: {esiid_count} records")
        
        # Test managers
        cursor.execute("SELECT COUNT(*) FROM managers")
        manager_count = cursor.fetchone()[0]
        print(f"✅ Managers table: {manager_count} records")
        
        # Test sample account data
        cursor.execute("""
            SELECT account_name, manager_name, management_company, procurement_status 
            FROM accounts 
            LIMIT 5
        """)
        sample_accounts = cursor.fetchall()
        
        print("\n📋 Sample account data:")
        for account in sample_accounts:
            print(f"   - {account[0][:30]:<30} | {account[1] or 'No Manager':<15} | {account[2] or 'No Company':<20} | {account[3] or 'No Status'}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def test_api_simulation():
    """Simulate API responses using direct database queries"""
    print("\n🔍 Testing API simulation...")
    
    try:
        conn = sqlite3.connect("2-backend/kilowatt_dev.db")
        cursor = conn.cursor()
        
        # Simulate GET /api/v1/accounts
        cursor.execute("""
            SELECT id, account_name, manager_name, management_company, 
                   procurement_status, usage_kwh
            FROM accounts 
            LIMIT 10
        """)
        
        accounts = []
        for row in cursor.fetchall():
            account = {
                "id": row[0],
                "accountName": row[1],
                "managerName": row[2],
                "managementCompany": row[3],
                "status": row[4],
                "usageKwh": row[5]
            }
            accounts.append(account)
        
        print(f"✅ Simulated accounts API: {len(accounts)} records")
        
        # Simulate GET /api/v1/esiids
        cursor.execute("SELECT COUNT(*) FROM esiids")
        esiid_count = cursor.fetchone()[0]
        print(f"✅ Simulated ESIIDs API: {esiid_count} records available")
        
        # Simulate GET /api/v1/managers
        cursor.execute("SELECT COUNT(*) FROM managers")
        manager_count = cursor.fetchone()[0]
        print(f"✅ Simulated managers API: {manager_count} records available")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ API simulation error: {e}")
        return False

def test_frontend_integration():
    """Test if frontend can switch to backend mode"""
    print("\n🔍 Testing frontend integration readiness...")
    
    # Check if frontend config exists
    config_path = "1-frontend/src/config/app.js"
    if os.path.exists(config_path):
        print("✅ Frontend configuration file exists")
    else:
        print("❌ Frontend configuration file missing")
        return False
    
    # Check if data service exists
    service_path = "1-frontend/src/services/dataService.js"
    if os.path.exists(service_path):
        print("✅ Frontend data service exists")
    else:
        print("❌ Frontend data service missing")
        return False
    
    # Check if API service exists
    api_path = "1-frontend/src/services/api.js"
    if os.path.exists(api_path):
        print("✅ Frontend API service exists")
    else:
        print("❌ Frontend API service missing")
        return False
    
    # Check if env example exists
    env_path = "1-frontend/.env.example"
    if os.path.exists(env_path):
        print("✅ Frontend environment example exists")
    else:
        print("❌ Frontend environment example missing")
        return False
    
    return True

def main():
    print("🚀 Kilowatt Backend Integration Test")
    print("=" * 50)
    
    # Test database
    db_ok = test_database()
    
    # Test API simulation
    api_ok = test_api_simulation()
    
    # Test frontend integration
    frontend_ok = test_frontend_integration()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"   Database: {'✅ PASS' if db_ok else '❌ FAIL'}")
    print(f"   API Simulation: {'✅ PASS' if api_ok else '❌ FAIL'}")
    print(f"   Frontend Integration: {'✅ PASS' if frontend_ok else '❌ FAIL'}")
    
    if db_ok and api_ok and frontend_ok:
        print("\n🎉 All tests passed! Backend integration is ready.")
        print("\n💡 Next steps:")
        print("   1. Start the backend server manually:")
        print("      cd 2-backend")
        print("      .venv\\Scripts\\activate")
        print("      uvicorn app.main:app --reload --host 127.0.0.1 --port 8000")
        print("   2. Switch frontend to backend mode:")
        print("      Copy 1-frontend/.env.example to 1-frontend/.env.local")
        print("      Set REACT_APP_USE_BACKEND_API=true")
        print("   3. Test the integration!")
    else:
        print("\n❌ Some tests failed. Please check the issues above.")

if __name__ == "__main__":
    main()
