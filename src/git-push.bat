@echo off
REM GACE - Quick Push to GitHub Script (Windows)
REM This script helps you quickly commit and push changes

echo.
echo ========================================
echo   GACE - Push to GitHub
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Git not initialized. Initializing now...
    git init
    git branch -M main
    git remote add origin https://github.com/dju78/gace.git
    echo Git initialized!
    echo.
)

REM Show current status
echo Current status:
echo ----------------
git status --short
echo.

REM Ask for confirmation
set /p add_all="Do you want to add all files? (y/n): "

if /i "%add_all%"=="y" (
    echo.
    echo Adding all files...
    git add .
    echo Files staged!
) else (
    echo.
    echo Please stage files manually with: git add ^<filename^>
    exit /b 0
)

echo.

REM Show what will be committed
echo Files to be committed:
echo ---------------------
git status --short
echo.

REM Ask for commit message
set /p commit_message="Enter commit message (or press Enter for default): "

if "%commit_message%"=="" (
    set commit_message=Update GACE platform - %date%
)

REM Commit
echo.
echo Committing changes...
git commit -m "%commit_message%"

if errorlevel 1 (
    echo.
    echo Commit failed. Please check the errors above.
    pause
    exit /b 1
)

echo Committed successfully!
echo.

REM Push
echo Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo Push failed. Trying with upstream flag...
    git push -u origin main
    
    if errorlevel 1 (
        echo.
        echo Push still failed. Common solutions:
        echo   1. Make sure you're authenticated with GitHub
        echo   2. Try: git pull origin main --rebase
        echo   3. Then run this script again
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   Successfully pushed to GitHub!
echo ========================================
echo.
echo View your repository at:
echo https://github.com/dju78/gace
echo.
echo Done!
echo.
pause
