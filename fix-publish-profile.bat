@echo off
REM Double-click launcher for fix-publish-profile.ps1
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0fix-publish-profile.ps1"
pause
