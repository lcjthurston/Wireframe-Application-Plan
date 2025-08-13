#!/usr/bin/env python3
"""
Quick test to see if we can import and run the FastAPI app
"""

import sys
import os

# Add backend to path
sys.path.insert(0, '2-backend')

def test_app_import():
    """Test if we can import the FastAPI app"""
    print("🔍 Testing FastAPI app import...")
    
    try:
        from app.main import app
        print("✅ FastAPI app imported successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to import FastAPI app: {e}")
        return False

def test_database_models():
    """Test if database models can be imported"""
    print("🔍 Testing database models...")
    
    try:
        from app.models.account import Account
        from app.models.esiid import ESIID
        from app.models.manager import Manager
        print("✅ Database models imported successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to import database models: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    print("🔍 Testing database connection...")
    
    try:
        import sqlite3
        db_path = "2-backend/kilowatt_dev.db"
        
        if not os.path.exists(db_path):
            print("❌ Database file not found")
            return False
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM accounts")
        count = cursor.fetchone()[0]
        conn.close()
        
        print(f"✅ Database connection successful: {count} accounts")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_simple_server():
    """Test if we can create a simple server instance"""
    print("🔍 Testing simple server creation...")
    
    try:
        import uvicorn
        from app.main import app
        
        # Just test that we can create the server config
        config = uvicorn.Config(app, host="127.0.0.1", port=8000)
        print("✅ Server configuration created successfully")
        print("💡 Server can be started with: uvicorn app.main:app --reload --host 127.0.0.1 --port 8000")
        return True
    except Exception as e:
        print(f"❌ Server configuration failed: {e}")
        return False

def main():
    print("🚀 Quick Backend Server Test")
    print("=" * 40)
    
    # Change to backend directory
    os.chdir("2-backend")
    
    tests = [
        ("Database Connection", test_database_connection),
        ("Database Models", test_database_models),
        ("FastAPI App Import", test_app_import),
        ("Server Configuration", test_simple_server)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "=" * 40)
    print("📊 Test Results:")
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("\n🎉 All tests passed! Backend is ready to start.")
        print("\n💡 To start the server manually:")
        print("   1. Open a terminal in the 2-backend directory")
        print("   2. Activate virtual environment: .venv\\Scripts\\activate")
        print("   3. Start server: uvicorn app.main:app --reload --host 127.0.0.1 --port 8000")
        print("   4. Server will be available at: http://127.0.0.1:8000")
        print("   5. API docs will be at: http://127.0.0.1:8000/docs")
    else:
        print(f"\n⚠️ {len(results) - passed} tests failed. Please check the issues above.")

if __name__ == "__main__":
    main()
