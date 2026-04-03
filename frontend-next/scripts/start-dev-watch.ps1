$projectRoot = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $projectRoot "dev-watch.log"

$watchCommand = @"
Set-Location '$projectRoot'
\$logPath = '$logPath'
while (\$true) {
  \$startedAt = Get-Date -Format o
  Add-Content -LiteralPath \$logPath -Value ('[START] frontend-next ' + \$startedAt)
  Write-Host ('[frontend-next] starting at ' + \$startedAt)

  & node .\node_modules\next\dist\bin\next dev --webpack --hostname 0.0.0.0 --port 3000
  \$exitCode = \$LASTEXITCODE
  \$endedAt = Get-Date -Format o

  Add-Content -LiteralPath \$logPath -Value ('[EXIT] frontend-next ' + \$endedAt + ' code=' + \$exitCode)
  Write-Host ('[frontend-next] exited at ' + \$endedAt + ' with code ' + \$exitCode) -ForegroundColor Yellow
  Write-Host ('[frontend-next] restarting in 2 seconds. Log: ' + \$logPath) -ForegroundColor DarkYellow
  Start-Sleep -Seconds 2
}
"@

Start-Process powershell.exe -WorkingDirectory $projectRoot -ArgumentList @(
  "-NoExit",
  "-Command",
  $watchCommand
)

Write-Host "Opened a watchdog PowerShell window for the frontend dev server."
Write-Host "If it exits, the window will log the exit code and restart automatically."
Write-Host ("Log file: " + $logPath)
