@echo off
REM Starts a local web server for this folder and opens the dashboard
REM over http://localhost, which is required for the microphone/voice
REM activation to work (browsers block mic access on file:// pages).
REM Double-click this file whenever you want to run HERMES locally.

setlocal
set PORT=8765
cd /d "%~dp0"

echo Checking if port %PORT% is already in use...
netstat -ano | findstr :%PORT% | findstr LISTENING >nul
if %errorlevel%==0 (
    echo Server already running on port %PORT%.
) else (
    echo Starting local server on port %PORT%...
    start "HERMES local server" /min cmd /c "python -m http.server %PORT%"
    timeout /t 2 /nobreak >nul
)

echo Opening dashboard...
start "" "http://localhost:%PORT%/dashboard.html"

echo.
echo HERMES is running at http://localhost:%PORT%/dashboard.html
echo Leave this window's server process running in the background.
echo Close the "HERMES local server" window to stop it.
