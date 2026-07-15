# fix-azure-login.ps1
# Replaces the flaky publish-profile/basic-auth deployment method with a
# proper Azure service principal, which GitHub Actions uses via azure/login.
# This avoids the "Publish profile is invalid" problem entirely, since it
# doesn't depend on Basic Auth / Kudu credentials at all.

$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$rg = "sunil-app-rg"
$spName = "sunil-app-deploy-sp"

Write-Host "Looking up your Azure subscription..."
$subId = az account show --query id -o tsv
if ($LASTEXITCODE -ne 0) {
    Write-Host "Could not read your Azure subscription - are you logged in? Run 'az login' first." -ForegroundColor Red
    exit 1
}

Write-Host "Creating a service principal scoped to resource group '$rg'..."
$spJson = az ad sp create-for-rbac --name $spName --role contributor --scopes "/subscriptions/$subId/resourceGroups/$rg" --query "{clientId:appId,clientSecret:password,tenantId:tenant}" -o json
if ($LASTEXITCODE -ne 0) {
    Write-Host "Could not create the service principal. See the error above." -ForegroundColor Red
    exit 1
}

$sp = $spJson | ConvertFrom-Json
$creds = @{
    clientId       = $sp.clientId
    clientSecret   = $sp.clientSecret
    subscriptionId = $subId
    tenantId       = $sp.tenantId
} | ConvertTo-Json -Compress

$creds | gh secret set AZURE_CREDENTIALS
if ($LASTEXITCODE -ne 0) {
    Write-Host "Could not set the GitHub secret - are you logged into GitHub CLI?" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Done. AZURE_CREDENTIALS secret is set." -ForegroundColor Green
Write-Host "The workflow file has already been updated to use this instead of the publish profile."
Write-Host "Commit and push it, then re-run the backend workflow on GitHub:"
Write-Host ""
Write-Host "  git add -A"
Write-Host "  git commit -m 'Switch backend deploy to service principal auth'"
Write-Host "  git push"
