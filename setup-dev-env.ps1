# setup-dev-env.ps1
Write-Host "Setting up College Access Management Development Environment..." -ForegroundColor Green

# Set Android environment variables
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"

Write-Host "ANDROID_HOME set to: $env:ANDROID_HOME" -ForegroundColor Yellow

# Check if Android SDK exists
if (!(Test-Path $env:ANDROID_HOME)) {
    Write-Host "ERROR: Android SDK not found at $env:ANDROID_HOME" -ForegroundColor Red
    Write-Host "Please install Android Studio and SDK first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Android SDK found at: $env:ANDROID_HOME" -ForegroundColor Green

# Navigate to project directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "`nSetup complete! You can now run:" -ForegroundColor Green
Write-Host "  1. npm start (to start Metro bundler)" -ForegroundColor Cyan
Write-Host "  2. npm run android (to build and run Android app)" -ForegroundColor Cyan
Write-Host "  3. Backend server: cd backend; npm start" -ForegroundColor Cyan

Write-Host "`nTesting backend server..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000" -TimeoutSec 5
    Write-Host "✅ Backend server is running!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend server is not running. Start it with: cd backend; npm start" -ForegroundColor Yellow
}

Read-Host "`nPress Enter to continue"