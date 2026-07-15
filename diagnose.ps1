# diagnose.ps1
# Captures backend startup logs into a plain text file (diagnostic-log.txt)
# so they can be read directly, without needing to copy-paste terminal output.

$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$backendAppName = "sunil-backend-8594"
$rg = "sunil-app-rg"
$outFile = Join-Path $PSScriptRoot "diagnostic-log.txt"

Write-Host "Starting log capture for $backendAppName..."

$job = Start-Job -ScriptBlock {
    param($name, $group)
    az webapp log tail --name $name --resource-group $group
} -ArgumentList $backendAppName, $rg

Start-Sleep -Seconds 3

Write-Host "Pinging the app to trigger startup / a fresh log line..."
try {
    Invoke-WebRequest -Uri "https://$backendAppName.azurewebsites.net/api/health" -UseBasicParsing -TimeoutSec 15 | Out-Null
} catch {
    # expected to possibly fail (that's the whole problem) - we just want it to hit the app
}

Write-Host "Collecting logs for 15 seconds..."
Start-Sleep -Seconds 15

Stop-Job $job | Out-Null
$logLines = Receive-Job $job
Remove-Job $job -Force | Out-Null

if (-not $logLines -or $logLines.Count -eq 0) {
    "No log output was captured. The app may not be receiving traffic, or logging isn't enabled yet." | Set-Content -Path $outFile -Encoding utf8
} else {
    $logLines | Set-Content -Path $outFile -Encoding utf8
}

Write-Host ""
Write-Host "Done. Saved to: $outFile" -ForegroundColor Green
Write-Host "Let Claude know it's ready to read."
