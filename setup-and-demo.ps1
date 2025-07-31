# Playwright Demo Setup and Run Script
# This script sets up and runs the Playwright tests for demo purposes

Write-Host "🎭 Playwright Test Demo Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Install Playwright browsers
Write-Host "`n🌐 Installing Playwright browsers..." -ForegroundColor Yellow
npx playwright install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Playwright browsers installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install Playwright browsers" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎯 Setup complete! Ready for demo." -ForegroundColor Green
Write-Host "`nAvailable commands:" -ForegroundColor Cyan
Write-Host "  npm test                - Run all tests" -ForegroundColor White
Write-Host "  npm run test:headed     - Run tests with browser visible" -ForegroundColor White
Write-Host "  npm run test:login      - Run login tests only" -ForegroundColor White
Write-Host "  npm run test:dashboard  - Run dashboard feature tests" -ForegroundColor White
Write-Host "  npm run test:post-login - Run comprehensive post-login tests" -ForegroundColor White
Write-Host "  npm run test:demo       - Run credential demo test" -ForegroundColor White
Write-Host "  npm run test:debug      - Run tests in debug mode" -ForegroundColor White
Write-Host "  npm run test:ui         - Run tests in UI mode" -ForegroundColor White
Write-Host "  npm run report          - View test reports" -ForegroundColor White

Write-Host "`n🚀 Running dashboard feature tests..." -ForegroundColor Yellow
npx playwright test tests/dashboard-features.spec.js --headed

Write-Host "`n✨ Demo complete! Check the generated reports and screenshots." -ForegroundColor Green
