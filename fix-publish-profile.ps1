# fix-publish-profile.ps1
# One-off fix: re-fetches the publish profile for the backend App Service and
# re-sets the AZURE_BACKEND_PUBLISH_PROFILE GitHub secret correctly (a bug in
# the original deploy script corrupted this the first time).

$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$backendAppName = "sunil-backend-8594"
$rg = "sunil-app-rg"

Write-Host "Enabling Basic Auth publishing credentials (Azure disables this by default on new App Services, which breaks publish-profile deployment)..."
az resource update --resource-group $rg --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent "sites/$backendAppName" --set properties.allow=true --output none
if ($LASTEXITCODE -ne 0) {
    Write-Host "Could not update the Basic Auth policy - are you logged into Azure CLI? Run 'az login' first." -ForegroundColor Red
    exit 1
}

Write-Host "Fetching publish profile for $backendAppName..."
$publishProfileXml = az webapp deployment list-publishing-profiles --name $backendAppName --resource-group $rg --xml
if ($LASTEXITCODE -ne 0) {
    Write-Host "Could not fetch the publish profile - are you logged into Azure CLI? Run 'az login' first." -ForegroundColor Red
    exit 1
}

$publishProfileXml -join "`n" | gh secret set AZURE_BACKEND_PUBLISH_PROFILE
if ($LASTEXITCODE -ne 0) {
    Write-Host "Could not set the GitHub secret - are you logged into GitHub CLI? Run 'gh auth status' to check." -ForegroundColor Red
    exit 1
}

Write-Host "Done. Secret AZURE_BACKEND_PUBLISH_PROFILE has been refreshed." -ForegroundColor Green
Write-Host "Now re-run the backend workflow: go to the Actions tab on GitHub, open the failed 'Deploy backend to Azure App Service' run, and click 'Re-run all jobs'."
