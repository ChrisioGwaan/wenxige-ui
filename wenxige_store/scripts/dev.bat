@echo off
setlocal enabledelayedexpansion

REM Development scripts for Wenxige Store (Windows)
REM Usage: scripts\dev.bat <command>

cd /d "%~dp0\.."

REM Check if Flutter is installed
where flutter >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Flutter is not installed or not in PATH
    exit /b 1
)

REM Main script logic
if "%1"=="" goto :help
if "%1"=="setup" goto :setup
if "%1"=="clean" goto :clean
if "%1"=="format" goto :format
if "%1"=="analyze" goto :analyze
if "%1"=="test" goto :test
if "%1"=="build" goto :build
if "%1"=="dev" goto :dev
if "%1"=="quality" goto :quality
if "%1"=="generate" goto :generate
if "%1"=="watch" goto :watch
if "%1"=="deploy" goto :deploy
if "%1"=="help" goto :help

echo ❌ Unknown command: %1
goto :help

:setup
echo ℹ️  Setting up development environment...
flutter pub get
flutter packages pub run build_runner build --delete-conflicting-outputs
echo ✅ Development environment setup complete!
goto :end

:clean
echo ℹ️  Cleaning project...
flutter clean
flutter pub get
if exist "build" rmdir /s /q "build"
if exist ".dart_tool" rmdir /s /q ".dart_tool"
echo ✅ Project cleaned!
goto :end

:format
echo ℹ️  Formatting code...
dart format .
echo ✅ Code formatted!
goto :end

:analyze
echo ℹ️  Analyzing code...
dart analyze --fatal-infos --fatal-warnings
echo ✅ Code analysis complete!
goto :end

:test
echo ℹ️  Running tests...
flutter test --coverage --reporter=expanded
echo ✅ Tests completed!
goto :end

:build
echo ℹ️  Building for all platforms...
echo ℹ️  Building for Web...
flutter build web --release --web-renderer canvaskit
echo ℹ️  Building for Android...
flutter build apk --release --split-per-abi
flutter build appbundle --release
echo ✅ All builds completed!
goto :end

:dev
echo ℹ️  Starting development server...
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from template...
    if exist ".env.example" (
        copy ".env.example" ".env"
    ) else (
        echo # Environment variables > .env
    )
)
flutter run -d chrome --web-port 3000
goto :end

:quality
echo ℹ️  Running quality checks...
call :format
call :analyze
call :test
echo ✅ All quality checks passed!
goto :end

:generate
echo ℹ️  Running code generation...
flutter packages pub run build_runner build --delete-conflicting-outputs
echo ✅ Code generation complete!
goto :end

:watch
echo ℹ️  Watching for changes and regenerating code...
flutter packages pub run build_runner watch --delete-conflicting-outputs
goto :end

:deploy
set environment=%2
if "%environment%"=="" set environment=staging
echo ℹ️  Deploying to %environment%...
flutter build web --release --web-renderer canvaskit
where firebase >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Firebase CLI not found. Install it with: npm install -g firebase-tools
    exit /b 1
)
firebase deploy --only hosting:%environment%
echo ✅ Deployed to %environment%!
goto :end

:help
echo Wenxige Store Development Scripts (Windows)
echo.
echo Usage: %0 ^<command^>
echo.
echo Commands:
echo   setup     - Setup development environment
echo   clean     - Clean project and dependencies
echo   format    - Format all Dart code
echo   analyze   - Run static analysis
echo   test      - Run all tests with coverage
echo   build     - Build for all platforms
echo   dev       - Start development server
echo   quality   - Run all quality checks
echo   generate  - Run code generation
echo   watch     - Watch and regenerate code
echo   deploy    - Deploy to Firebase (default: staging)
echo   help      - Show this help message
goto :end

:end