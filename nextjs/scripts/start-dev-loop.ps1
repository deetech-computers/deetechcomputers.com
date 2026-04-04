$projectRoot = Split-Path -Parent $PSScriptRoot

while ($true) {
  $startedAt = Get-Date -Format o
  Write-Host ("[frontend-next] start " + $startedAt)
  node .\node_modules\next\dist\bin\next dev --webpack --hostname 0.0.0.0 --port 3000
  $exitCode = $LASTEXITCODE
  $endedAt = Get-Date -Format o
  Write-Host ("[frontend-next] exit " + $endedAt + " code=" + $exitCode) -ForegroundColor Yellow
  Start-Sleep -Seconds 2
}
