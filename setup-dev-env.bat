@echo off
echo Setting up College Access Management Development Environment...

REM Set Android environment variables
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools

echo ANDROID_HOME set to: %ANDROID_HOME%

REM Check if Android SDK exists
if not exist "%ANDROID_HOME%" (
    echo ERROR: Android SDK not found at %ANDROID_HOME%
    echo Please install Android Studio and SDK first.
    pause
    exit /b 1
)

echo Android SDK found at: %ANDROID_HOME%

REM Navigate to project directory
cd /d "%~dp0"

echo Setup complete! You can now run:
echo   1. npm start (to start Metro bundler)
echo   2. npm run android (to build and run Android app)
echo   3. Backend server: cd backend && npm start

pause