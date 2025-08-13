# Kilowatt Backend Server Startup Script
Write-Host "🚀 Starting Kilowatt Backend Server" -ForegroundColor Green
Write-Host "=" * 50

# Check current directory
$currentDir = Get-Location
Write-Host "📁 Current directory: $currentDir"

# Check if we're in the backend directory
if (-not (Test-Path "app\main.py")) {
    Write-Host "❌ Error: Not in backend directory or app/main.py not found" -ForegroundColor Red
    Write-Host "💡 Please run this script from the 2-backend directory" -ForegroundColor Yellow
    exit 1
}

# Check if virtual environment exists
if (-not (Test-Path ".venv\Scripts\activate.ps1")) {
    Write-Host "❌ Error: Virtual environment not found" -ForegroundColor Red
    Write-Host "💡 Please create virtual environment first:" -ForegroundColor Yellow
    Write-Host "   python -m venv .venv" -ForegroundColor Cyan
    exit 1
}

# Check if database exists
if (-not (Test-Path "kilowatt_dev.db")) {
    Write-Host "❌ Error: Database file not found" -ForegroundColor Red
    Write-Host "💡 Database should be at: kilowatt_dev.db" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ All prerequisites found" -ForegroundColor Green

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& .venv\Scripts\Activate.ps1

# Check if activation worked
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to activate virtual environment" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Virtual environment activated" -ForegroundColor Green

# Install/update dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Start the server
Write-Host ""
Write-Host "🚀 Starting FastAPI server..." -ForegroundColor Green
Write-Host "📡 Server will be available at: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "📚 API documentation at: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start uvicorn
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
