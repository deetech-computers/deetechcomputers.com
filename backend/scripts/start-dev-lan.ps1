$projectRoot = Split-Path -Parent $PSScriptRoot

Start-Process powershell.exe -WorkingDirectory $projectRoot -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd '$projectRoot'; npm run dev"
)

Write-Host "Opened a new PowerShell window for the backend dev server."
Write-Host "Keep this window open while the frontend is running."
