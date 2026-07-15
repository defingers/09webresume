@echo off
REM Double-click launcher for diagnose.ps1
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0diagnose.ps1"
pause
