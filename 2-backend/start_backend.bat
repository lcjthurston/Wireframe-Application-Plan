@echo off
cd /d "%~dp0"
echo Starting Kilowatt Backend Server...
echo Current directory: %CD%
echo.

REM Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate

REM Check if requirements.txt exists
if exist requirements.txt (
    echo Installing/updating dependencies...
    pip install -r requirements.txt
) else (
    echo Warning: requirements.txt not found, skipping dependency installation
)

REM Start the server
echo.
echo Starting FastAPI server on http://127.0.0.1:8000
echo Press Ctrl+C to stop the server
echo.
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
