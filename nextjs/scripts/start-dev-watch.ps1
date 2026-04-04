$projectRoot = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $projectRoot "dev-watch.log"

$watchCommand = @"
Set-Location '$projectRoot'
\$logPath = '$logPath'
while (\$true) {
  \$startedAt = Get-Date -Format o
  Add-Content -LiteralPath \$logPath -Value ('[START] nextjs ' + \$startedAt)
  Write-Host ('[nextjs] starting at ' + \$startedAt)

  & node .\node_modules\next\dist\bin\next dev --webpack --hostname 0.0.0.0 --port 3000
  \$exitCode = \$LASTEXITCODE
  \$endedAt = Get-Date -Format o

  Add-Content -LiteralPath \$logPath -Value ('[EXIT] nextjs ' + \$endedAt + ' code=' + \$exitCode)
  Write-Host ('[nextjs] exited at ' + \$endedAt + ' with code ' + \$exitCode) -ForegroundColor Yellow
  Write-Host ('[nextjs] restarting in 2 seconds. Log: ' + \$logPath) -ForegroundColor DarkYellow
  Start-Sleep -Seconds 2
}
"@

Start-Process powershell.exe -WorkingDirectory $projectRoot -ArgumentList @(
  "-NoExit",
  "-Command",
  $watchCommand
)

Write-Host "Opened a watchdog PowerShell window for the nextjs dev server."
Write-Host "If it exits, the window will log the exit code and restart automatically."
Write-Host ("Log file: " + $logPath)
