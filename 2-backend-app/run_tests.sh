#!/bin/bash

# Kilowatt API Test Runner Script
# This script sets up the environment and runs comprehensive tests

set -e  # Exit on any error

echo "🚀 Kilowatt API Test Suite"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    print_error "Please run this script from the 2-backend-app directory"
    exit 1
fi

# Set test environment variables
export TESTING=1
export DATABASE_URL="sqlite:///./test.db"

print_status "Setting up test environment..."

# Check if virtual environment is activated
if [[ "$VIRTUAL_ENV" != "" ]]; then
    print_status "Virtual environment detected: $VIRTUAL_ENV"
else
    print_warning "No virtual environment detected. Consider using: python -m venv venv && source venv/bin/activate"
fi

# Install test dependencies with more verbose output
print_status "Installing test dependencies..."
python -m pip install --upgrade pip
python -m pip install pytest pytest-cov httpx pytest-asyncio

# Verify pytest installation
if ! python -m pytest --version > /dev/null 2>&1; then
    print_error "Failed to install pytest. Trying alternative installation..."
    pip3 install pytest pytest-cov httpx pytest-asyncio
    
    if ! python3 -m pytest --version > /dev/null 2>&1; then
        print_error "Could not install or find pytest. Please install manually:"
        echo "  pip install pytest pytest-cov httpx pytest-asyncio"
        exit 1
    else
        PYTEST_CMD="python3 -m pytest"
    fi
else
    PYTEST_CMD="python -m pytest"
fi

print_success "Dependencies installed successfully"
print_status "Using pytest command: $PYTEST_CMD"

# Function to run specific test category
run_test_category() {
    local test_file=$1
    local category_name=$2
    
    print_status "Running $category_name tests..."
    if $PYTEST_CMD "tests/$test_file" -v --tb=short; then
        print_success "$category_name tests passed"
        return 0
    else
        print_error "$category_name tests failed"
        return 1
    fi
}

# Parse command line arguments
case "${1:-all}" in
    "auth")
        print_status "Running Authentication tests only..."
        run_test_category "test_auth.py" "Authentication"
        ;;
    "accounts")
        print_status "Running Accounts tests only..."
        run_test_category "test_accounts.py" "Accounts"
        ;;
    "tasks")
        print_status "Running Tasks tests only..."
        run_test_category "test_tasks.py" "Tasks"
        ;;
    "managers")
        print_status "Running Managers tests only..."
        run_test_category "test_managers.py" "Managers"
        ;;
    "health")
        print_status "Running Health tests only..."
        run_test_category "test_health.py" "Health"
        ;;
    "basic")
        print_status "Running Basic tests only..."
        run_test_category "test_basic.py" "Basic"
        ;;
    "coverage")
        print_status "Running all tests with detailed coverage..."
        $PYTEST_CMD tests/ -v --cov=app --cov-report=html --cov-report=term-missing --tb=short
        print_success "Coverage report generated in htmlcov/"
        ;;
    "quick")
        print_status "Running quick test suite (no coverage)..."
        $PYTEST_CMD tests/ -v --tb=short
        ;;
    "install")
        print_status "Installing dependencies only..."
        python -m pip install -r requirements.txt
        python -m pip install pytest pytest-cov httpx pytest-asyncio
        print_success "Dependencies installed"
        exit 0
        ;;
    "all"|*)
        print_status "Running comprehensive test suite..."
        
        # Run tests by category for better organization
        failed_tests=0
        
        run_test_category "test_basic.py" "Basic" || ((failed_tests++))
        run_test_category "test_auth.py" "Authentication" || ((failed_tests++))
        run_test_category "test_accounts.py" "Accounts" || ((failed_tests++))
        run_test_category "test_tasks.py" "Tasks" || ((failed_tests++))
        run_test_category "test_managers.py" "Managers" || ((failed_tests++))
        run_test_category "test_health.py" "Health" || ((failed_tests++))
        
        echo ""
        print_status "Running full test suite with coverage..."
        if $PYTEST_CMD tests/ --cov=app --cov-report=html --cov-report=term-missing --tb=short; then
            print_success "All tests completed successfully!"
            print_success "Coverage report generated in htmlcov/"
            
            if [ $failed_tests -eq 0 ]; then
                echo ""
                print_success "🎉 All test categories passed!"
                echo ""
                print_status "Test Summary:"
                echo "  ✅ Basic functionality"
                echo "  ✅ Authentication"
                echo "  ✅ Accounts management"
                echo "  ✅ Tasks management"
                echo "  ✅ Managers management"
                echo "  ✅ System health"
                echo ""
                print_status "Next steps:"
                echo "  • View coverage report: open htmlcov/index.html"
                echo "  • Run specific tests: ./run_tests.sh [auth|accounts|tasks|managers|health]"
                echo "  • Run with coverage only: ./run_tests.sh coverage"
            else
                print_warning "$failed_tests test categories had failures"
            fi
        else
            print_error "Test suite failed"
            exit 1
        fi
        ;;
esac

# Clean up test database
if [ -f "test.db" ]; then
    rm test.db
    print_status "Cleaned up test database"
fi

print_success "Test run completed!"


