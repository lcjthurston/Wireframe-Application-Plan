#!/usr/bin/env python3
"""
Test runner script for the Kilowatt API
"""
import subprocess
import sys
import os

def run_tests():
    """Run all tests with coverage"""
    print("🧪 Running Kilowatt API Tests...")
    
    # Set test environment
    os.environ["TESTING"] = "1"
    
    # Run tests with coverage
    cmd = [
        "python", "-m", "pytest",
        "tests/",
        "-v",
        "--cov=app",
        "--cov-report=html",
        "--cov-report=term-missing",
        "--tb=short"
    ]
    
    try:
        result = subprocess.run(cmd, check=True)
        print("✅ All tests passed!")
        print("📊 Coverage report generated in htmlcov/")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Tests failed with exit code {e.returncode}")
        return False

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)