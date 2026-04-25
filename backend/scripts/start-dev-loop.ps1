$projectRoot = Split-Path -Parent $PSScriptRoot

while ($true) {
  $startedAt = Get-Date -Format o
  Write-Host ("[backend] start " + $startedAt)
  npm run dev
  $exitCode = $LASTEXITCODE
  $endedAt = Get-Date -Format o
  Write-Host ("[backend] exit " + $endedAt + " code=" + $exitCode) -ForegroundColor Yellow
  Start-Sleep -Seconds 2
}
