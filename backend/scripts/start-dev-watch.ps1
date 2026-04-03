$projectRoot = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $projectRoot "dev-watch.log"

$watchCommand = @"
Set-Location '$projectRoot'
\$logPath = '$logPath'
while (\$true) {
  \$startedAt = Get-Date -Format o
  Add-Content -LiteralPath \$logPath -Value ('[START] backend ' + \$startedAt)
  Write-Host ('[backend] starting at ' + \$startedAt)

  & npm run dev
  \$exitCode = \$LASTEXITCODE
  \$endedAt = Get-Date -Format o

  Add-Content -LiteralPath \$logPath -Value ('[EXIT] backend ' + \$endedAt + ' code=' + \$exitCode)
  Write-Host ('[backend] exited at ' + \$endedAt + ' with code ' + \$exitCode) -ForegroundColor Yellow
  Write-Host ('[backend] restarting in 2 seconds. Log: ' + \$logPath) -ForegroundColor DarkYellow
  Start-Sleep -Seconds 2
}
"@

Start-Process powershell.exe -WorkingDirectory $projectRoot -ArgumentList @(
  "-NoExit",
  "-Command",
  $watchCommand
)

Write-Host "Opened a watchdog PowerShell window for the backend dev server."
Write-Host "If it exits, the window will log the exit code and restart automatically."
Write-Host ("Log file: " + $logPath)
