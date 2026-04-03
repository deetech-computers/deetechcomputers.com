$projectRoot = Split-Path -Parent $PSScriptRoot

Start-Process powershell.exe -WorkingDirectory $projectRoot -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd '$projectRoot'; node .\node_modules\next\dist\bin\next dev --hostname 0.0.0.0 --port 3000"
)

Write-Host "Opened a new PowerShell window for the Next.js dev server."
Write-Host "Use http://172.20.10.11:3000 after the new window shows 'Ready'."
