$projectRoot = Split-Path -Parent $PSScriptRoot

while ($true) {
  $startedAt = Get-Date -Format o
  Write-Host ("[nextjs] start " + $startedAt)
  node .\node_modules\next\dist\bin\next dev --webpack --hostname 0.0.0.0 --port 3000
  $exitCode = $LASTEXITCODE
  $endedAt = Get-Date -Format o
  Write-Host ("[nextjs] exit " + $endedAt + " code=" + $exitCode) -ForegroundColor Yellow
  Start-Sleep -Seconds 2
}
