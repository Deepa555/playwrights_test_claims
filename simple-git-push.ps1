Write-Host "Pushing to GitHub..." -ForegroundColor Cyan

# Use environment variable for token
$token = $env:GITHUB_TOKEN
if (-not $token) {
    Write-Host "Please set GITHUB_TOKEN environment variable" -ForegroundColor Red
    exit 1
}

# Repository setup
$authUrl = "https://Deepa555:$token@github.com/Deepa555/playwrights_test_claims.git"
git remote remove origin 2>$null
git remote add origin $authUrl

# Push changes
git add .
git commit -m "Add Playwright test automation framework"
git branch -M main
git push -u origin main

# Clean up
git remote set-url origin "https://github.com/Deepa555/playwrights_test_claims.git"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "Push failed" -ForegroundColor Red
}
