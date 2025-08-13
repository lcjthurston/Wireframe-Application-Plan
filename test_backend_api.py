#!/usr/bin/env python3
"""
Test script to verify backend API endpoints
"""

import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check: {data}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_accounts_api():
    """Test accounts API"""
    print("🔍 Testing accounts API...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/accounts?limit=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Accounts API: {len(data)} records returned")
            
            # Show sample data
            if data:
                sample = data[0]
                print(f"   Sample account: {sample.get('accountName', 'Unknown')}")
                print(f"   Manager: {sample.get('managerName', 'Unknown')}")
                print(f"   Company: {sample.get('managementCompany', 'Unknown')}")
            return True
        else:
            print(f"❌ Accounts API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Accounts API error: {e}")
        return False

def test_esiids_api():
    """Test ESIIDs API"""
    print("🔍 Testing ESIIDs API...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/esiids?limit=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ ESIIDs API: {len(data)} records returned")
            
            # Show sample data
            if data:
                sample = data[0]
                print(f"   Sample ESIID: {sample.get('esiId', 'Unknown')}")
                print(f"   Account: {sample.get('accountName', 'Unknown')}")
                print(f"   REP: {sample.get('rep', 'Unknown')}")
            return True
        else:
            print(f"❌ ESIIDs API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ESIIDs API error: {e}")
        return False

def test_managers_api():
    """Test managers API"""
    print("🔍 Testing managers API...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/managers?limit=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Managers API: {len(data)} records returned")
            
            # Show sample data
            if data:
                sample = data[0]
                print(f"   Sample manager: {sample.get('name', 'Unknown')}")
                print(f"   Company: {sample.get('managementCompany', 'Unknown')}")
                print(f"   Email: {sample.get('email', 'Unknown')}")
            return True
        else:
            print(f"❌ Managers API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Managers API error: {e}")
        return False

def test_api_docs():
    """Test API documentation"""
    print("🔍 Testing API documentation...")
    try:
        response = requests.get(f"{BASE_URL}/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API documentation accessible at http://127.0.0.1:8000/docs")
            return True
        else:
            print(f"❌ API docs failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API docs error: {e}")
        return False

def wait_for_server(max_attempts=30):
    """Wait for server to start"""
    print("⏳ Waiting for server to start...")
    
    for attempt in range(max_attempts):
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=2)
            if response.status_code == 200:
                print(f"✅ Server is ready! (attempt {attempt + 1})")
                return True
        except:
            pass
        
        print(f"   Attempt {attempt + 1}/{max_attempts}...")
        time.sleep(2)
    
    print("❌ Server did not start within expected time")
    return False

def main():
    print("🚀 Kilowatt Backend API Test")
    print("=" * 50)
    
    # Wait for server to be ready
    if not wait_for_server():
        print("\n❌ Cannot connect to backend server")
        print("💡 Make sure the backend server is running:")
        print("   cd 2-backend")
        print("   .venv\\Scripts\\activate")
        print("   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000")
        return
    
    print("\n🧪 Running API tests...")
    
    # Run all tests
    tests = [
        ("Health Check", test_health),
        ("Accounts API", test_accounts_api),
        ("ESIIDs API", test_esiids_api),
        ("Managers API", test_managers_api),
        ("API Documentation", test_api_docs)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("\n🎉 All tests passed! Backend API is working correctly.")
        print("\n💡 Next steps:")
        print("   1. Keep the backend server running")
        print("   2. Start the frontend: cd 1-frontend && npm start")
        print("   3. Open http://localhost:3000")
        print("   4. Components should show 'Backend API' as data source")
    else:
        print(f"\n⚠️ {len(results) - passed} tests failed. Please check the backend server.")

if __name__ == "__main__":
    main()
