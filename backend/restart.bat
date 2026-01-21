@echo off
echo Restarting backend server...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul
cd /d "%~dp0.."
npm run dev
