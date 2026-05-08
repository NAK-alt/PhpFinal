@echo off
echo ============================================
echo   Chronos Luxury - Full Stack Setup
echo ============================================
echo.

REM ── Step 1: Check Composer ──────────────────
where composer >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Composer not found. Install from https://getcomposer.org/
    pause & exit /b 1
)

REM ── Step 2: Backend setup ───────────────────
echo [1/6] Installing Laravel dependencies...
cd backend
composer install --no-interaction --prefer-dist
if %errorlevel% neq 0 ( echo [ERROR] composer install failed & pause & exit /b 1 )

echo [2/6] Configuring environment...
copy .env.example .env
php artisan key:generate

echo [3/6] Running migrations and seeding database...
php artisan migrate:fresh --seed --force
if %errorlevel% neq 0 ( echo [ERROR] Migration failed. Is MySQL running in Laragon? & pause & exit /b 1 )

echo [4/6] Caching config...
php artisan config:clear
php artisan route:clear

echo.
echo [Backend ready] Starting Laravel on http://localhost:8000 ...
start "Chronos API" cmd /k "php artisan serve --port=8000"

cd ..

REM ── Step 3: Frontend setup ──────────────────
echo [5/6] Installing React dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 ( echo [ERROR] npm install failed & pause & exit /b 1 )

echo [6/6] Starting React dev server on http://localhost:5173 ...
start "Chronos React" cmd /k "npm run dev"

cd ..

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo   React Frontend : http://localhost:5173
echo   Laravel API    : http://localhost:8000/api
echo.
echo   Admin Login    : admin@chronos.com / password
echo   Customer Login : user@chronos.com  / password
echo.
pause
