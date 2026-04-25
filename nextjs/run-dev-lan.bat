@echo off
cd /d "%~dp0"
start "Deetech Next Dev" cmd /k "cd /d \"%~dp0\" && node .\node_modules\next\dist\bin\next dev --hostname 0.0.0.0 --port 3000"
echo A new window should open and keep the dev server running.
echo When it shows Ready, open http://172.20.10.11:3000
pause
