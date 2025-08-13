#!/usr/bin/env python3
"""
Integration test to verify frontend-backend integration
"""

import os
import json
import time
import subprocess
import requests
from pathlib import Path

def test_frontend_config():
    """Test frontend configuration"""
    print("🔍 Testing frontend configuration...")
    
    env_file = "1-frontend/.env.local"
    if not os.path.exists(env_file):
        print("❌ .env.local file not found")
        return False
    
    with open(env_file, 'r') as f:
        content = f.read()
        
    if "REACT_APP_USE_BACKEND_API=true" in content:
        print("✅ Backend API enabled in frontend config")
        return True
    else:
        print("❌ Backend API not enabled in frontend config")
        return False

def test_backend_health():
    """Test if backend server is running"""
    print("🔍 Testing backend server health...")
    
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend server is running and healthy")
            return True
        else:
            print(f"❌ Backend server returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend server not accessible: {e}")
        return False

def test_api_endpoints():
    """Test API endpoints"""
    print("🔍 Testing API endpoints...")
    
    endpoints = [
        "/api/v1/accounts?limit=5",
        "/api/v1/esiids?limit=5", 
        "/api/v1/managers?limit=5"
    ]
    
    results = []
    for endpoint in endpoints:
        try:
            response = requests.get(f"http://localhost:8000{endpoint}", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {endpoint}: {len(data) if isinstance(data, list) else 'OK'}")
                results.append(True)
            else:
                print(f"❌ {endpoint}: Status {response.status_code}")
                results.append(False)
        except Exception as e:
            print(f"❌ {endpoint}: {e}")
            results.append(False)
    
    return all(results)

def test_json_fallback():
    """Test JSON fallback files"""
    print("🔍 Testing JSON fallback files...")
    
    json_files = [
        "1-frontend/src/data/accounts.json",
        "1-frontend/src/data/esiids.json",
        "1-frontend/src/data/managers.json",
        "1-frontend/src/data/companies.json",
        "1-frontend/src/data/commissions.json",
        "1-frontend/src/data/pricing.json",
        "1-frontend/src/data/providers.json",
        "1-frontend/src/data/analytics-results.json"
    ]
    
    results = []
    for json_file in json_files:
        if os.path.exists(json_file):
            try:
                with open(json_file, 'r') as f:
                    data = json.load(f)
                    count = len(data) if isinstance(data, list) else "OK"
                    print(f"✅ {os.path.basename(json_file)}: {count} records")
                    results.append(True)
            except Exception as e:
                print(f"❌ {os.path.basename(json_file)}: Invalid JSON - {e}")
                results.append(False)
        else:
            print(f"❌ {os.path.basename(json_file)}: File not found")
            results.append(False)
    
    return all(results)

def start_frontend():
    """Start the frontend development server"""
    print("🚀 Starting frontend development server...")
    
    try:
        # Change to frontend directory and start
        os.chdir("1-frontend")
        process = subprocess.Popen(
            ["npm", "start"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        print("✅ Frontend server starting...")
        print("💡 Frontend will be available at http://localhost:3000")
        print("💡 Check the browser console for data source indicators")
        
        return process
        
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        return None

def main():
    print("🚀 Kilowatt Frontend-Backend Integration Test")
    print("=" * 60)
    
    # Test frontend configuration
    config_ok = test_frontend_config()
    
    # Test backend health
    backend_ok = test_backend_health()
    
    # Test API endpoints (only if backend is running)
    if backend_ok:
        api_ok = test_api_endpoints()
    else:
        api_ok = False
        print("⚠️ Skipping API tests (backend not running)")
    
    # Test JSON fallback files
    json_ok = test_json_fallback()
    
    print("\n" + "=" * 60)
    print("📊 Integration Test Results:")
    print(f"   Frontend Config: {'✅ PASS' if config_ok else '❌ FAIL'}")
    print(f"   Backend Health: {'✅ PASS' if backend_ok else '❌ FAIL'}")
    print(f"   API Endpoints: {'✅ PASS' if api_ok else '❌ FAIL' if backend_ok else '⚠️ SKIP'}")
    print(f"   JSON Fallback: {'✅ PASS' if json_ok else '❌ FAIL'}")
    
    if config_ok and json_ok:
        if backend_ok and api_ok:
            print("\n🎉 Full integration test PASSED!")
            print("   ✅ Backend API is working")
            print("   ✅ Frontend is configured for backend mode")
            print("   ✅ JSON fallback is available")
        elif config_ok and json_ok:
            print("\n⚠️ Partial integration test PASSED!")
            print("   ❌ Backend API is not running")
            print("   ✅ Frontend is configured for backend mode")
            print("   ✅ JSON fallback will be used")
            print("\n💡 To start the backend server:")
            print("   cd 2-backend")
            print("   .venv\\Scripts\\activate")
            print("   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000")
        
        print("\n🚀 Starting frontend to test integration...")
        frontend_process = start_frontend()
        
        if frontend_process:
            print("\n✅ Integration test complete!")
            print("📱 Open http://localhost:3000 in your browser")
            print("🔍 Check browser console for data source indicators")
            print("💡 Components will show 'Backend API' or 'Static JSON' as data source")
            
    else:
        print("\n❌ Integration test FAILED!")
        print("   Please check the issues above before proceeding.")

if __name__ == "__main__":
    main()
