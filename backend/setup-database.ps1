# Spoken Word ChMS - Quick Start Database Setup
# This script automates the entire database setup process

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Spoken Word ChMS Database Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$env:PGPASSWORD = "Romanojuma3403"

# Step 1: Drop existing database
Write-Host "[Step 1/5] Dropping existing database (if exists)..." -ForegroundColor Yellow
psql -U postgres -c "DROP DATABASE IF EXISTS spoken_word_chms;" 2>$null
Write-Host "✓ Ready for fresh install`n" -ForegroundColor Green

# Step 2: Create database
Write-Host "[Step 2/5] Creating fresh database..." -ForegroundColor Yellow
$result = psql -U postgres -c "CREATE DATABASE spoken_word_chms;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create database!" -ForegroundColor Red
    Write-Host $result
    pause
    exit 1
}
Write-Host "✓ Database created successfully`n" -ForegroundColor Green

# Step 3: Run migrations
Write-Host "[Step 3/5] Running migrations (creating tables)..." -ForegroundColor Yellow
$result = psql -U postgres -d spoken_word_chms -f src/database/migrations/001_initial_schema.sql 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Migration failed!" -ForegroundColor Red
    Write-Host $result
    pause
    exit 1
}
Write-Host "✓ Tables created successfully`n" -ForegroundColor Green

# Step 4: Seed database
Write-Host "[Step 4/5] Seeding database with sample data..." -ForegroundColor Yellow
$result = node src/database/seed.js 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Seeding failed!" -ForegroundColor Red
    Write-Host $result
    pause
    exit 1
}
Write-Host "✓ Database seeded successfully`n" -ForegroundColor Green

# Step 5: Verify
Write-Host "[Step 5/5] Verifying setup..." -ForegroundColor Yellow
Write-Host "`nTable Count:" -ForegroundColor Cyan
psql -U postgres -d spoken_word_chms -c "SELECT count(*) as table_count FROM information_schema.tables WHERE table_schema='public';"
Write-Host "`nAdmin User:" -ForegroundColor Cyan
psql -U postgres -d spoken_word_chms -c "SELECT email, role FROM users WHERE email='admin@spokenword.com';"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✓ DATABASE SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Default Login Credentials:" -ForegroundColor Yellow
Write-Host "Email: admin@spokenword.com" -ForegroundColor White
Write-Host "Password: Admin123!`n" -ForegroundColor White

Write-Host "You can now start the backend with: npm run dev`n" -ForegroundColor Cyan
pause
