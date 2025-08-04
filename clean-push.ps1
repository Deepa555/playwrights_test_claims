# Clean Git Push Script - No Hardcoded Tokens
Write-Host "🚀 Pushing Playwright Test Framework to GitHub" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Get token securely
$token = if ($env:GITHUB_TOKEN) { 
    $env:GITHUB_TOKEN 
} else { 
    Read-Host "Enter GitHub Personal Access Token" -AsSecureString | ConvertFrom-SecureString -AsPlainText 
}

# Repository details
$repoUrl = "https://github.com/Deepa555/playwrights_test_claims.git"
$username = "Deepa555"
$authUrl = "https://${username}:${token}@github.com/Deepa555/playwrights_test_claims.git"

Write-Host "📡 Target repository: $repoUrl" -ForegroundColor Yellow

# Check git status
if (-not (Test-Path ".git")) {
    Write-Host "🔧 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git config user.name "Deepa555"
    git config user.email "deepa555@example.com"
}

# Set up remote
Write-Host "🔗 Setting up remote origin..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $authUrl

# Stage files
Write-Host "📦 Staging files..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Add Playwright test automation framework with Azure Blue login tests and CI/CD pipeline configuration"

# Set main branch
git branch -M main

# Push
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "🌐 Repository: https://github.com/Deepa555/playwrights_test_claims" -ForegroundColor Yellow
    Write-Host "`n🔧 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Visit your repository on GitHub" -ForegroundColor White
    Write-Host "2. Set up GitHub Actions secrets for CI/CD" -ForegroundColor White
    Write-Host "3. Check the Actions tab for automated test runs" -ForegroundColor White
} else {
    Write-Host "`n❌ Push failed. Please check your token and repository permissions." -ForegroundColor Red
}

# Clean up - remove token from remote for security
Write-Host "`n🔐 Cleaning up authentication..." -ForegroundColor Yellow
git remote set-url origin $repoUrl
Write-Host "✅ Token removed from git configuration" -ForegroundColor Green
