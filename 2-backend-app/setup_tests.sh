#!/bin/bash

echo "🔧 Setting up test environment for Kilowatt API"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Python version
print_status "Checking Python version..."
python_version=$(python --version 2>&1)
print_status "Found: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating virtual environment..."
    python -m venv venv
    print_success "Virtual environment created"
else
    print_status "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate || source venv/Scripts/activate

# Upgrade pip
print_status "Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements
print_status "Installing project requirements..."
python -m pip install -r requirements.txt

# Install test dependencies
print_status "Installing test dependencies..."
python -m pip install pytest pytest-cov httpx pytest-asyncio

# Verify installation
print_status "Verifying pytest installation..."
if python -m pytest --version; then
    print_success "pytest installed successfully"
else
    print_error "pytest installation failed"
    exit 1
fi

# Make test script executable
chmod +x run_tests.sh

print_success "Test environment setup complete!"
echo ""
print_status "Next steps:"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Run tests: ./run_tests.sh"
echo "  3. Or run specific tests: ./run_tests.sh auth"