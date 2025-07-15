# Test Guide for Kilowatt API

## Quick Start

```bash
# Make the script executable
chmod +x run_tests.sh

# Run all tests
./run_tests.sh

# Run specific test categories
./run_tests.sh auth
./run_tests.sh accounts
./run_tests.sh tasks
./run_tests.sh managers
./run_tests.sh health
```

## Test Commands

### Run All Tests
```bash
./run_tests.sh all          # Full test suite with coverage
./run_tests.sh              # Same as 'all' (default)
```

### Run Specific Categories
```bash
./run_tests.sh auth         # Authentication tests only
./run_tests.sh accounts     # Account management tests
./run_tests.sh tasks        # Task management tests
./run_tests.sh managers     # Manager management tests
./run_tests.sh health       # System health tests
./run_tests.sh basic        # Basic API tests
```

### Coverage and Performance
```bash
./run_tests.sh coverage     # Detailed coverage report
./run_tests.sh quick        # Fast run without coverage
```

## Manual Test Commands

If you prefer to run pytest directly:

```bash
# Install dependencies
pip install pytest pytest-cov httpx pytest-asyncio

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html --cov-report=term-missing

# Run specific test file
pytest tests/test_auth.py -v

# Run specific test function
pytest tests/test_auth.py::test_login_success -v

# Run tests matching pattern
pytest tests/ -k "test_create" -v
```

## Test Environment

The script automatically sets up:
- `TESTING=1` environment variable
- SQLite test database (`test.db`)
- Required test dependencies

## Coverage Report

After running tests with coverage, view the HTML report:
```bash
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
```

## Troubleshooting

### Permission Denied
```bash
chmod +x run_tests.sh
```

### Missing Dependencies
```bash
pip install -r requirements.txt
pip install pytest pytest-cov httpx pytest-asyncio
```

### Database Issues
```bash
# Clean up test database
rm test.db

# Reset database
alembic upgrade head
```

### Import Errors
Make sure you're in the correct directory:
```bash
cd 2-backend-app
./run_tests.sh
```