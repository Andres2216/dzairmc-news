@echo off
setlocal
cd /d "%~dp0"

if exist app.json del /q app.json

node --check app.config.js
if errorlevel 1 (
  echo Configuration check failed.
  exit /b 1
)

echo Configuration fixed successfully.
