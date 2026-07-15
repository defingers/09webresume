@echo off
REM Double-click launcher for deploy-to-azure.ps1
REM This exists so you don't have to open PowerShell manually or type any commands.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy-to-azure.ps1"
pause
