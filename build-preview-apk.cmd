@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required.
  exit /b 1
)

call npm.cmd install
if errorlevel 1 goto :failed

call npx.cmd expo-doctor@latest
if errorlevel 1 goto :failed

call npm.cmd run check
if errorlevel 1 goto :failed

set EAS_NO_VCS=1
call npx.cmd eas-cli@latest build --platform android --profile preview
if errorlevel 1 goto :failed

echo APK build completed successfully.
pause
exit /b 0

:failed
echo.
echo Build stopped because of the error shown above.
pause
exit /b 1
