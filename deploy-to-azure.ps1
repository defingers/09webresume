# deploy-to-azure.ps1
#
# Run this in PowerShell from C:\Sunil_app\Sunil_app (right-click the folder in
# File Explorer -> "Open in Terminal", or `cd` there in an existing PowerShell window).
#
# What it does, start to finish:
#   1. git init + first commit (local)
#   2. Creates a GitHub repo and pushes to it (via GitHub CLI)
#   3. Logs into Azure and creates the backend App Service + frontend Static Web App
#   4. Wires up the app settings, startup command, and GitHub Actions secrets
#   5. Pushes again to trigger the two deployment workflows
#
# You will see TWO browser sign-in prompts during this (one for GitHub, one for
# Azure) - that's expected and is the secure way to authenticate; this script
# never sees or stores your passwords.
#
# Prerequisites (install these first if you don't have them):
#   - Git            https://git-scm.com/download/win
#   - GitHub CLI     https://cli.github.com/  (winget install --id GitHub.cli)
#   - Azure CLI      https://aka.ms/installazurecliwindows

$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

function Require-Command($name, $hint) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        Write-Host "Missing required tool: $name" -ForegroundColor Red
        Write-Host "Install it from: $hint"
        exit 1
    }
}

function Stop-IfFailed($message) {
    if ($LASTEXITCODE -ne 0) {
        Write-Host $message -ForegroundColor Red
        exit 1
    }
}

Write-Host "== Checking prerequisites ==" -ForegroundColor Cyan
Require-Command "git" "https://git-scm.com/download/win"
Require-Command "gh"  "https://cli.github.com/"
Require-Command "az"  "https://aka.ms/installazurecliwindows"

# ---------------------------------------------------------------------------
# 1. Local git repo
# ---------------------------------------------------------------------------
Write-Host "`n== Step 1: Git init + commit ==" -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    git init | Out-Null
    Write-Host "Initialized git repo."
} else {
    Write-Host "Git repo already exists here."
}
git branch -M main 2>$null | Out-Null

# Make sure git has an identity to commit with - if the user has never set this
# globally, commits fail silently otherwise. Only sets it for THIS repo (--local),
# and only if nothing is configured yet.
$existingName = git config user.name 2>$null
if ([string]::IsNullOrWhiteSpace($existingName)) {
    git config user.name "RK"
    git config user.email "rathna.kn21@gmail.com"
    Write-Host "Set local git identity (name: RK) for this repo."
}

git add -A
git rev-parse --verify HEAD 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    git commit -m "Initial commit"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "git commit failed - see the error above." -ForegroundColor Red
        exit 1
    }
    Write-Host "Created initial commit."
} else {
    git commit -m "Update" 2>$null | Out-Null
    Write-Host "Repo already has commits (added any new changes)."
}

# ---------------------------------------------------------------------------
# 2. GitHub: auth, create repo, push
# ---------------------------------------------------------------------------
Write-Host "`n== Step 2: GitHub ==" -ForegroundColor Cyan
gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Opening browser to sign in to GitHub..."
    gh auth login -w
}

$existingRemote = git remote 2>$null
if (-not $existingRemote) {
    $suffix = Get-Random -Minimum 1000 -Maximum 9999
    $defaultRepoName = "sunil-portfolio-$suffix"
    $repoName = Read-Host "GitHub repo name to create [$defaultRepoName]"
    if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = $defaultRepoName }
    gh repo create $repoName --private --source=. --remote=origin --push
    Stop-IfFailed "Could not create the GitHub repo. Check the message above and try again."
} else {
    Write-Host "Git remote 'origin' already configured, skipping repo creation."
    git push -u origin main 2>$null
}

$ghUser = gh api user --jq ".login"
$repoNameOnly = (git remote get-url origin) -replace '.*/', '' -replace '\.git$', ''
Write-Host "Repo: https://github.com/$ghUser/$repoNameOnly"

# ---------------------------------------------------------------------------
# 3. Azure: login
# ---------------------------------------------------------------------------
Write-Host "`n== Step 3: Azure login ==" -ForegroundColor Cyan
az account show 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Opening browser to sign in to Azure..."
    az login | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Azure sign-in did not complete (cancelled or the browser window was closed early)." -ForegroundColor Red
        Write-Host "Run the script again and make sure to fully select your account and finish the sign-in page."
        exit 1
    }
}

$suffix = Get-Random -Minimum 1000 -Maximum 9999
$rg = "sunil-app-rg"
$defaultLocation = "centralindia"
$location = Read-Host "Azure region to deploy to [$defaultLocation]"
if ([string]::IsNullOrWhiteSpace($location)) { $location = $defaultLocation }

$rgExists = az group exists --name $rg
if ($rgExists -eq "true") {
    Write-Host "Resource group '$rg' already exists (from an earlier attempt) - reusing it as-is. This doesn't affect which region individual resources use."
} else {
    Write-Host "Creating resource group '$rg' in '$location'."
    az group create --name $rg --location $location --output none
    Stop-IfFailed "Could not create the resource group."
}

# ---------------------------------------------------------------------------
# 4. Backend: App Service
# ---------------------------------------------------------------------------
Write-Host "`n== Step 4: Backend (Azure App Service) ==" -ForegroundColor Cyan
$defaultBackendName = "sunil-backend-$suffix"
$backendAppName = Read-Host "Backend App Service name (must be globally unique) [$defaultBackendName]"
if ([string]::IsNullOrWhiteSpace($backendAppName)) { $backendAppName = $defaultBackendName }

az appservice plan create --name "$backendAppName-plan" --resource-group $rg --location $location --sku F1 --is-linux --output none
Stop-IfFailed "Could not create the App Service plan. If the error above mentions quota/'Current Limit: 0', that region has no free quota on your subscription - run the script again and enter a different region (e.g. centralindia, southindia, westus, northeurope)."
az webapp create --name $backendAppName --resource-group $rg --plan "$backendAppName-plan" --runtime "PYTHON:3.11" --output none
Stop-IfFailed "Could not create the Web App. The name '$backendAppName' might already be taken globally - try running the script again with a different name."

az webapp config set --name $backendAppName --resource-group $rg `
    --startup-file "gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app --bind=0.0.0.0:8000 --timeout 600" `
    --output none

# Azure disables "Basic Auth" publishing credentials by default on new App
# Services, which silently breaks publish-profile-based GitHub Actions deploys
# ("Publish profile is invalid..."). Turn it on so the workflow can deploy.
az resource update --resource-group $rg --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent "sites/$backendAppName" --set properties.allow=true --output none

Write-Host ""
Write-Host "Paste your MongoDB Atlas connection string." -ForegroundColor Yellow
Write-Host "  Find it in Atlas: Database -> Connect -> Drivers."
Write-Host "  Format: mongodb+srv://defing_db_user:<password>@<cluster-host>/?retryWrites=true&w=majority"
Write-Host "  (special characters in the password must be percent-encoded, e.g. @ -> %40)"
$mongoUrl = Read-Host "MONGO_URL"
$recipientEmail = Read-Host "Email address to receive contact-form messages (leave blank to skip for now)"

az webapp config appsettings set --name $backendAppName --resource-group $rg --settings `
    MONGO_URL="$mongoUrl" `
    DB_NAME="test_database" `
    CORS_ORIGINS="*" `
    SENDER_EMAIL="aboutsunin@gmail.com" `
    RECIPIENT_EMAIL="$recipientEmail" `
    SCM_DO_BUILD_DURING_DEPLOYMENT="true" `
    --output none

$publishProfileXml = az webapp deployment list-publishing-profiles --name $backendAppName --resource-group $rg --xml
Stop-IfFailed "Could not fetch the publish profile."
$publishProfileXml -join "`n" | gh secret set AZURE_BACKEND_PUBLISH_PROFILE
Stop-IfFailed "Could not set the AZURE_BACKEND_PUBLISH_PROFILE GitHub secret."

(Get-Content .github/workflows/backend-azure.yml) -replace 'your-backend-app-name', $backendAppName | Set-Content .github/workflows/backend-azure.yml

$backendUrl = "https://$backendAppName.azurewebsites.net"
gh secret set REACT_APP_BACKEND_URL --body $backendUrl

Write-Host "Backend created: $backendUrl"

# ---------------------------------------------------------------------------
# 5. Frontend: Static Web App
# ---------------------------------------------------------------------------
Write-Host "`n== Step 5: Frontend (Azure Static Web Apps) ==" -ForegroundColor Cyan
$defaultFrontendName = "sunil-portfolio-web-$suffix"
$frontendAppName = Read-Host "Frontend Static Web App name [$defaultFrontendName]"
if ([string]::IsNullOrWhiteSpace($frontendAppName)) { $frontendAppName = $defaultFrontendName }

# Static Web Apps only run in a small fixed set of regions (unrelated to the
# backend's region) - centralus/eastus2/westus2/westeurope/eastasia. Using a
# supported one directly avoids an "invalid location" error.
$swaLocation = "eastasia"

az staticwebapp create --name $frontendAppName --resource-group $rg --location $swaLocation --sku Free --output none
Stop-IfFailed "Could not create the Static Web App. The name '$frontendAppName' might already be taken globally - try running the script again with a different name."

$swaToken = az staticwebapp secrets list --name $frontendAppName --resource-group $rg --query "properties.apiKey" -o tsv
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body $swaToken

$frontendHost = az staticwebapp show --name $frontendAppName --resource-group $rg --query "defaultHostname" -o tsv
Write-Host "Frontend created: https://$frontendHost"

# ---------------------------------------------------------------------------
# 6. Commit config + push to trigger both workflows
# ---------------------------------------------------------------------------
Write-Host "`n== Step 6: Deploy ==" -ForegroundColor Cyan
git add -A
git commit -m "Configure Azure app names" 2>$null
git push

Write-Host ""
Write-Host "All done. Watching won't happen automatically - check progress at:" -ForegroundColor Green
Write-Host "  https://github.com/$ghUser/$repoNameOnly/actions"
Write-Host ""
Write-Host "Once green:"
Write-Host "  Backend health check: $backendUrl/api/health"
Write-Host "  Frontend site:        https://$frontendHost"
Write-Host ""
Write-Host "Reminder: rotate your MongoDB and Azure passwords now that setup is done." -ForegroundColor Yellow
