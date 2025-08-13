#!/usr/bin/env python3
"""
Debug database connection issues
"""

import sys
import os
import sqlite3

# Add backend to path
sys.path.insert(0, '2-backend')
os.chdir('2-backend')

def test_sqlite_direct():
    """Test SQLite database directly"""
    print("🔍 Testing SQLite database directly...")
    
    try:
        # Check if database file exists
        db_files = ['kilowatt_dev.db', './kilowatt_dev.db']
        db_path = None
        
        for path in db_files:
            if os.path.exists(path):
                db_path = path
                break
        
        if not db_path:
            print("❌ Database file not found. Looking for:")
            for path in db_files:
                print(f"   - {os.path.abspath(path)}")
            return False
        
        print(f"✅ Found database: {os.path.abspath(db_path)}")
        
        # Test connection
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # List tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f"✅ Database tables: {[t[0] for t in tables]}")
        
        # Test accounts table
        if ('accounts',) in tables:
            cursor.execute("SELECT COUNT(*) FROM accounts")
            count = cursor.fetchone()[0]
            print(f"✅ Accounts table: {count} records")
            
            # Test sample query
            cursor.execute("SELECT id, account_name FROM accounts LIMIT 3")
            rows = cursor.fetchall()
            print("📋 Sample accounts:")
            for row in rows:
                print(f"   ID: {row[0]}, Name: {row[1]}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ SQLite direct test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_sqlalchemy_config():
    """Test SQLAlchemy configuration"""
    print("\n🔍 Testing SQLAlchemy configuration...")
    
    try:
        from app.core.config import settings
        print(f"✅ Settings loaded")
        print(f"   Database URL: {settings.database_url}")
        print(f"   Debug mode: {settings.debug}")
        
        from app.database import engine, SessionLocal
        print(f"✅ Database engine created")
        
        # Test engine connection
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            print(f"✅ Engine connection test: {result.fetchone()}")
        
        # Test session
        db = SessionLocal()
        print(f"✅ Session created")
        db.close()
        
        return True
        
    except Exception as e:
        print(f"❌ SQLAlchemy config test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_account_model():
    """Test Account model"""
    print("\n🔍 Testing Account model...")
    
    try:
        from app.models.account import Account
        from app.database import SessionLocal
        
        print(f"✅ Account model imported")
        
        # Test query
        db = SessionLocal()
        
        # Simple count query
        count = db.query(Account).count()
        print(f"✅ Account count query: {count} records")
        
        # Test limit query
        accounts = db.query(Account).limit(3).all()
        print(f"✅ Account limit query: {len(accounts)} records returned")
        
        # Show sample data
        for account in accounts:
            print(f"   ID: {account.id}, Name: {account.account_name}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Account model test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_fastapi_route():
    """Test FastAPI route manually"""
    print("\n🔍 Testing FastAPI route manually...")
    
    try:
        from app.api.v1.accounts import get_accounts_test
        
        # Call the simple test function
        result = get_accounts_test()
        print(f"✅ Simple test route: {result}")
        
        return True
        
    except Exception as e:
        print(f"❌ FastAPI route test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🚀 Database Debug Tool")
    print("=" * 50)
    print(f"Working directory: {os.getcwd()}")
    print(f"Python path: {sys.path[:3]}...")
    
    tests = [
        ("SQLite Direct", test_sqlite_direct),
        ("SQLAlchemy Config", test_sqlalchemy_config),
        ("Account Model", test_account_model),
        ("FastAPI Route", test_fastapi_route)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Test {test_name} crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Debug Results:")
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")

if __name__ == "__main__":
    main()
