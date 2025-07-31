# PowerShell script to setup and run the repository
param(
    [string]$Environment = "development",
    [string]$TestSuite = "all",
    [switch]$Headed = $false,
    [switch]$SetupOnly = $false
)

Write-Host "🎭 Azure Blue Playwright Test Repository Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Setup environment
Write-Host "`n🔧 Setting up environment..." -ForegroundColor Yellow

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file from template" -ForegroundColor Green
    Write-Host "⚠️  Please update .env file with your actual credentials" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
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

# Setup complete
Write-Host "`n🎯 Setup complete!" -ForegroundColor Green

if ($SetupOnly) {
    Write-Host "`nSetup completed. Use the following commands to run tests:" -ForegroundColor Cyan
    Write-Host "  npm test                    - Run all tests" -ForegroundColor White
    Write-Host "  npm run test:login          - Run login tests" -ForegroundColor White
    Write-Host "  npm run test:dashboard      - Run dashboard tests" -ForegroundColor White
    Write-Host "  npm run test:headed         - Run tests with browser visible" -ForegroundColor White
    Write-Host "  npm run test:ui             - Run tests in UI mode" -ForegroundColor White
    exit 0
}

# Run tests based on parameters
Write-Host "`n🚀 Running tests..." -ForegroundColor Yellow

$testCommand = "npx playwright test"

# Add specific test suite
switch ($TestSuite.ToLower()) {
    "login" { $testCommand += " tests/login" }
    "dashboard" { $testCommand += " tests/dashboard" }
    "all" { } # Run all tests
    default { $testCommand += " tests/$TestSuite" }
}

# Add headed mode if requested
if ($Headed) {
    $testCommand += " --headed"
}

# Set environment
$env:NODE_ENV = $Environment

Write-Host "Executing: $testCommand" -ForegroundColor Gray
Invoke-Expression $testCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Tests completed successfully!" -ForegroundColor Green
    Write-Host "`n📊 View reports with: npm run report" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Some tests failed. Check the reports for details." -ForegroundColor Red
    Write-Host "`n📊 View reports with: npm run report" -ForegroundColor Cyan
}

Write-Host "`n📁 Test artifacts saved in:" -ForegroundColor Yellow
Write-Host "  - playwright-report/    (HTML reports)" -ForegroundColor White
Write-Host "  - test-results/         (Screenshots, videos, traces)" -ForegroundColor White
Write-Host "  - screenshots/          (Custom screenshots)" -ForegroundColor White
