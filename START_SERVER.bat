@echo off
echo ========================================
echo   Social Media Feed Aggregator
echo   Starting Local Server...
echo ========================================
echo.
echo Checking for Python...

python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python found! Starting server on port 8000...
    echo.
    echo Open your browser and go to: http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
) else (
    echo Python not found. Checking for Node.js...
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Node.js found! Starting server...
        echo.
        echo Open your browser and go to: http://localhost:8080
        echo.
        echo Press Ctrl+C to stop the server
        echo.
        npx http-server
    ) else (
        echo.
        echo ERROR: Neither Python nor Node.js found!
        echo.
        echo Please install one of the following:
        echo   1. Python: https://www.python.org/downloads/
        echo   2. Node.js: https://nodejs.org/
        echo.
        echo Or use VS Code Live Server extension instead.
        echo.
        pause
    )
)
