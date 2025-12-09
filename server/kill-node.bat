@echo off
echo Killing all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo All Node.js processes have been terminated.
) else (
    echo No Node.js processes were running.
)
echo.
echo You can now start your server with: npm run dev
pause
