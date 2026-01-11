@echo off
REM ============================================================
REM Simple Database Setup - Spoken Word ChMS
REM Run this from Command Prompt (not PowerShell)
REM ============================================================

echo ========================================
echo Database Setup for Spoken Word ChMS
echo ========================================
echo.

REM Step 1: Set postgres password
set /p PGPASSWORD="Enter your PostgreSQL 'postgres' user password: "
echo.

REM Step 2: Create database
echo [1/3] Creating database...
psql -U postgres -c "CREATE DATABASE spoken_word_chms;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Database created successfully!
) else (
    echo Database may already exist or password incorrect
)
echo.

REM Step 3: Create .env file
echo [2/3] Creating .env file...
if exist .env (
    echo .env already exists, backing up...
    copy /Y .env .env.backup >nul
)
copy /Y .env.example .env >nul

REM Update password in .env using PowerShell
powershell -Command "(Get-Content .env) -replace 'DB_PASSWORD=your_password_here', 'DB_PASSWORD=%PGPASSWORD%' | Set-Content .env"
echo .env file created!
echo.

REM Step 4: Run migrations
echo [3/3] Running migrations and seeding data...
call npm run migrate
echo.
call npm run seed
echo.

REM Clear password
set PGPASSWORD=

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Default admin credentials:
echo   Email: admin@spokenword.com
echo   Password: Admin123!
echo.
echo To start the server:
echo   npm run dev
echo.
pause
