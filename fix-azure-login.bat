@echo off
REM Double-click launcher for fix-azure-login.ps1
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0fix-azure-login.ps1"
pause
