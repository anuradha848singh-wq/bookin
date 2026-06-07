@echo off
chcp 65001 >nul 2>nul
title BookIn Monorepo Starter
cls

echo ===================================================
echo    BookIn Clinical Monorepo Quick Starter
echo ===================================================
echo.

:: Check dependencies
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo [Error] Node.js is not installed. Please install it first.
  pause
  exit /b 1
)

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
  echo [Error] pnpm is not installed. Please install it via "npm install -g pnpm".
  pause
  exit /b 1
)

:menu
echo.
echo [1] Start All Servers (Recommended One-Click)
echo [2] Verify Database Connection and Schema
echo [3] Run SQL Database Migrations
echo [4] Regenerate Prisma Client
echo [5] Exit
echo [6] Start Servers via Docker (Build and Up)
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto run_all
if "%choice%"=="2" goto verify_db
if "%choice%"=="3" goto migrate_db
if "%choice%"=="4" goto generate_db
if "%choice%"=="5" goto exit_program
if "%choice%"=="6" goto docker_run
echo Invalid option, please try again.
pause
cls
goto menu

:run_all
cls
echo [1/3] Cleaning stale Next.js cache (Prevents Windows EPERM errors)...
if exist "apps\dashboard\.next\cache" rmdir /s /q "apps\dashboard\.next\cache" >nul 2>nul
if exist "apps\booking\.next\cache" rmdir /s /q "apps\booking\.next\cache" >nul 2>nul
if exist "apps\marketing\.next\cache" rmdir /s /q "apps\marketing\.next\cache" >nul 2>nul

echo.
echo [2/3] Building dependencies (lib, db)...
call pnpm --filter @book-in/lib run build || echo [Warning] Lib build had issues, continuing anyway...
call pnpm --filter @book-in/db run build || echo [Warning] DB build had issues, continuing anyway...

echo.
echo [3/3] Starting all development servers (dashboard, booking, marketing)...
echo Dashboard : http://localhost:3002
echo Booking   : http://localhost:3003
echo Marketing : http://localhost:3001
echo.
call pnpm dev
pause
goto menu

:verify_db
cls
echo Running Phase 1 Handoff database verification...
call pnpm verify
pause
cls
goto menu

:migrate_db
cls
echo Running SQL Migrations against the Supabase database...
call pnpm db:migrate
pause
cls
goto menu

:generate_db
cls
echo Regenerating Prisma Client Types...
call pnpm db:generate
pause
cls
goto menu

:docker_run
cls
echo Checking if Docker is available...
where docker >nul 2>nul
if %errorlevel% neq 0 (
  echo [Error] Docker is not installed or not in PATH.
  echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
  pause
  cls
  goto menu
)

docker info >nul 2>nul
if %errorlevel% neq 0 (
  echo [Error] Docker Desktop is not running.
  echo Please start Docker Desktop and wait for it to fully initialize, then try again.
  pause
  cls
  goto menu
)

echo [OK] Docker is running.
echo.
echo [1/2] Rebuilding Docker images to inject environment variables...
call docker compose --env-file ".env" build
if %errorlevel% neq 0 (
  echo.
  echo [Error] Docker build failed. Check the output above for details.
  pause
  cls
  goto menu
)
echo.
echo [2/2] Starting Docker containers...
echo   Dashboard : http://localhost:3002
echo   Booking   : http://localhost:3003
echo   Marketing : http://localhost:3001
echo.
call docker compose --env-file ".env" up
pause
cls
goto menu

:exit_program
echo Goodbye!
exit /b 0
