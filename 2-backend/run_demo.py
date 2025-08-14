#!/usr/bin/env python3
import uvicorn
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚀 Starting Kilowatt Backend Demo Server...")
    print("📖 API Documentation: http://localhost:8001/docs")
    print("🔍 Interactive API: http://localhost:8001/redoc")
    print("⚡ Demo Endpoints: http://localhost:8001/")
    
    try:
        uvicorn.run("demo_server:app", host="127.0.0.1", port=8001, reload=True)
    except Exception as e:
        print(f"Error starting server: {e}")
        input("Press Enter to exit...")
