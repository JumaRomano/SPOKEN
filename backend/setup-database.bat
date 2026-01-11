@echo off
setlocal EnableDelayedExpansion

echo ========================================
echo Spoken Word ChMS Database Setup
echo ========================================
echo.

REM Set PostgreSQL password
set PGPASSWORD=Romanojuma3403

echo [Step 1/5] Dropping existing database (if exists)...
psql -U postgres -c "DROP DATABASE IF EXISTS spoken_word_chms;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Could not drop database, it may not exist yet.
)
echo.

echo [Step 2/5] Creating fresh database...
psql -U postgres -c "CREATE DATABASE spoken_word_chms;" 
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create database!
    pause
    exit /b 1
)
echo ✓ Database created successfully
echo.

echo [Step 3/5] Running migrations (creating tables)...
psql -U postgres -d spoken_word_chms -f src/database/migrations/001_initial_schema.sql
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Migration failed!
    pause
    exit /b 1
)
echo ✓ Tables created successfully
echo.

echo [Step 4/5] Seeding database with sample data...
node src/database/seed.js
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Seeding failed!
    pause
    exit /b 1
)
echo ✓ Database seeded successfully
echo.

echo [Step 5/5] Verifying setup...
psql -U postgres -d spoken_word_chms -c "SELECT count(*) as table_count FROM information_schema.tables WHERE table_schema='public';"
psql -U postgres -d spoken_word_chms -c "SELECT email, role FROM users WHERE email='admin@spokenword.com';"
echo.

echo ========================================
echo ✓ DATABASE SETUP COMPLETE!
echo ========================================
echo.
echo Default Login Credentials:
echo Email: admin@spokenword.com
echo Password: Admin123!
echo.
echo You can now start the backend with: npm run dev
echo.
pause
