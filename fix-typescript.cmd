@echo off
setlocal
cd /d "%~dp0"

(
  echo {
  echo   "extends": "expo/tsconfig.base",
  echo   "compilerOptions": {
  echo     "strict": true,
  echo     "noUncheckedIndexedAccess": true,
  echo     "noImplicitReturns": true
  echo   },
  echo   "include": ["App.tsx", "src/**/*.ts", "src/**/*.tsx"]
  echo }
) > tsconfig.json

call npm.cmd run check
if errorlevel 1 exit /b 1

echo TypeScript configuration fixed successfully.
