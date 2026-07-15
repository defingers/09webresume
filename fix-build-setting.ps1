# fix-build-setting.ps1
# Azure App Service doesn't automatically run "pip install" on deployed code -
# it needs SCM_DO_BUILD_DURING_DEPLOYMENT=true so Oryx builds a virtual env
# with the packages from requirements.txt. Without it, gunicorn/uvicorn are
# "installed" as far as the zip goes, but never actually pip-installed, so the
# app crashes with ModuleNotFoundError on startup.

$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$backendAppName = "sunil-backend-8594"
$rg = "sunil-app-rg"

Write-Host "Enabling build-during-deployment for $backendAppName..."
az webapp config appsettings set --name $backendAppName --resource-group $rg --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true --output none
if ($LASTEXITCODE -ne 0) {
    Write-Host "Could not update the app setting - are you logged into Azure CLI? Run 'az login' first." -ForegroundColor Red
    exit 1
}

Write-Host "Setting updated. Restarting the app and triggering a fresh deployment from the last GitHub Actions run..."
az webapp restart --name $backendAppName --resource-group $rg --output none

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "Now go to GitHub Actions, open the last 'Deploy backend to Azure App Service' run, and click 'Re-run all jobs' so it redeploys with the new setting in place."
