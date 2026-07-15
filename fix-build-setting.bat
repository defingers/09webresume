@echo off
REM Double-click launcher for fix-build-setting.ps1
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0fix-build-setting.ps1"
pause
