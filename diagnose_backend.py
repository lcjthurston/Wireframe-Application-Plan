#!/usr/bin/env python3
"""
Diagnose backend issues
"""

import sys
import os
import sqlite3

# Add backend to path
sys.path.insert(0, '2-backend')

def test_database_direct():
    """Test database connection directly"""
    print("🔍 Testing direct database connection...")
    
    try:
        db_path = "2-backend/kilowatt_dev.db"
        if not os.path.exists(db_path):
            print(f"❌ Database file not found: {db_path}")
            return False
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Test accounts table
        cursor.execute("SELECT COUNT(*) FROM accounts")
        count = cursor.fetchone()[0]
        print(f"✅ Direct database connection: {count} accounts")
        
        # Test sample query
        cursor.execute("SELECT id, account_name, manager_name FROM accounts LIMIT 3")
        rows = cursor.fetchall()
        
        print("📋 Sample accounts:")
        for row in rows:
            print(f"   ID: {row[0]}, Name: {row[1]}, Manager: {row[2] or 'None'}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Direct database error: {e}")
        return False

def test_sqlalchemy_models():
    """Test SQLAlchemy models"""
    print("\n🔍 Testing SQLAlchemy models...")
    
    try:
        from app.models.account import Account
        from app.database import SessionLocal
        
        print("✅ Models imported successfully")
        
        # Test database session
        db = SessionLocal()
        
        # Test query
        count = db.query(Account).count()
        print(f"✅ SQLAlchemy query: {count} accounts")
        
        # Test sample query
        accounts = db.query(Account).limit(3).all()
        print("📋 Sample accounts via SQLAlchemy:")
        for account in accounts:
            print(f"   ID: {account.id}, Name: {account.account_name}, Manager: {account.manager_name or 'None'}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ SQLAlchemy error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_fastapi_import():
    """Test FastAPI app import"""
    print("\n🔍 Testing FastAPI app import...")
    
    try:
        from app.main import app
        print("✅ FastAPI app imported successfully")
        
        # Test if we can access routes
        routes = [route.path for route in app.routes]
        api_routes = [r for r in routes if r.startswith('/api')]
        print(f"✅ Found {len(api_routes)} API routes")
        
        return True
        
    except Exception as e:
        print(f"❌ FastAPI import error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🚀 Backend Diagnostic Tool")
    print("=" * 50)
    
    # Change to backend directory
    os.chdir("2-backend")
    
    tests = [
        ("Direct Database", test_database_direct),
        ("SQLAlchemy Models", test_sqlalchemy_models),
        ("FastAPI Import", test_fastapi_import)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Diagnostic Results:")
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed < len(results):
        print("\n💡 Troubleshooting suggestions:")
        print("   1. Check that you're in the correct virtual environment")
        print("   2. Verify all dependencies are installed: pip install -r requirements.txt")
        print("   3. Check database file exists and has correct permissions")
        print("   4. Look at the detailed error messages above")

if __name__ == "__main__":
    main()
