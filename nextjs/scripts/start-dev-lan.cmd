@echo off
start "Deetech Next Dev" cmd /k "cd /d \"%~dp0..\" && node .\node_modules\next\dist\bin\next dev --hostname 0.0.0.0 --port 3000"
echo Opened a new CMD window for the Next.js dev server.
echo Use http://172.20.10.11:3000 after the new window shows Ready.
