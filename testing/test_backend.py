#!/usr/bin/env python3
"""
Quick test to check if the backend can start and serve data
"""

import sys
import os
sys.path.append('2-backend')

try:
    # Test database connection
    import sqlite3
    db_path = "2-backend/kilowatt_dev.db"
    
    if not os.path.exists(db_path):
        print("❌ Database file not found")
        sys.exit(1)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Test accounts table
    cursor.execute("SELECT COUNT(*) FROM accounts")
    account_count = cursor.fetchone()[0]
    print(f"✅ Database connected: {account_count} accounts found")
    
    # Test a few sample records
    cursor.execute("SELECT account_name, manager_name, management_company FROM accounts LIMIT 3")
    sample_accounts = cursor.fetchall()
    
    print("📋 Sample accounts:")
    for account in sample_accounts:
        print(f"   - {account[0]} | {account[1] or 'No Manager'} | {account[2] or 'No Company'}")
    
    conn.close()
    
    # Test FastAPI import
    try:
        from app.main import app
        print("✅ FastAPI app imported successfully")
        
        # Test database models
        from app.models.account import Account
        print("✅ Database models imported successfully")
        
        print("\n🎉 Backend is ready to start!")
        print("\n💡 To start the backend server:")
        print("   cd 2-backend")
        print("   .venv\\Scripts\\activate")
        print("   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000")
        
    except Exception as e:
        print(f"❌ FastAPI import failed: {e}")
        print("💡 You may need to install dependencies in the virtual environment")
        
except Exception as e:
    print(f"❌ Database test failed: {e}")
    sys.exit(1)
