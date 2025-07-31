# Git Setup and Push Script
# This script initializes git repository and pushes code to GitHub

Write-Host "🚀 Git Repository Setup and Push" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Repository URL
$repoUrl = "https://github.com/Deepa555/playwrights_test_claims.git"
Write-Host "📡 Target repository: $repoUrl" -ForegroundColor Yellow

# Check if .git directory exists
if (Test-Path ".git") {
    Write-Host "ℹ️ Git repository already initialized" -ForegroundColor Blue
} else {
    Write-Host "🔧 Initializing Git repository..." -ForegroundColor Yellow
    git init
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git repository initialized" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to initialize Git repository" -ForegroundColor Red
        exit 1
    }
}

# Add remote origin if it doesn't exist
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔗 Adding remote origin..." -ForegroundColor Yellow
    git remote add origin $repoUrl
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Remote origin added" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to add remote origin" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ℹ️ Remote origin already exists: $remoteExists" -ForegroundColor Blue
    
    # Update remote URL if different
    if ($remoteExists -ne $repoUrl) {
        Write-Host "🔄 Updating remote origin URL..." -ForegroundColor Yellow
        git remote set-url origin $repoUrl
    }
}

# Create .gitignore if it doesn't exist (it should already exist)
if (-not (Test-Path ".gitignore")) {
    Write-Host "📝 Creating .gitignore..." -ForegroundColor Yellow
    @"
# Node modules
node_modules/

# Test results
test-results/
playwright-report/
blob-report/
playwright/.cache/

# Screenshots and videos
screenshots/
*.png
*.jpg
*.jpeg
*.gif
*.mp4

# Environment files
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/

# Logs
*.log
npm-debug.log*
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✅ .gitignore created" -ForegroundColor Green
} else {
    Write-Host "ℹ️ .gitignore already exists" -ForegroundColor Blue
}

# Stage all files
Write-Host "📦 Staging files..." -ForegroundColor Yellow
git add .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Files staged successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to stage files" -ForegroundColor Red
    exit 1
}

# Show what will be committed
Write-Host "`n📋 Files to be committed:" -ForegroundColor Cyan
git status --porcelain

# Commit changes
$commitMessage = "Initial commit: Playwright test automation for Azure Blue claims testing

- Complete test automation framework setup
- Login and dashboard test suites
- Helper classes for maintainable code
- CI/CD pipeline configuration (Azure DevOps + GitHub Actions)
- Cross-browser testing support
- Environment configuration management
- Comprehensive documentation and setup guides"

Write-Host "`n💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes committed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to commit changes" -ForegroundColor Red
    exit 1
}

# Set default branch to main
Write-Host "🌿 Setting default branch to main..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  You may be prompted for GitHub credentials" -ForegroundColor Yellow

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code pushed successfully to GitHub!" -ForegroundColor Green
    Write-Host "`n🎉 Repository is now available at:" -ForegroundColor Cyan
    Write-Host "   $repoUrl" -ForegroundColor White
    
    Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to the GitHub repository" -ForegroundColor White
    Write-Host "2. Set up repository secrets for CI/CD:" -ForegroundColor White
    Write-Host "   - LOGIN_USERNAME" -ForegroundColor Gray
    Write-Host "   - LOGIN_PASSWORD" -ForegroundColor Gray
    Write-Host "   - BASE_URL" -ForegroundColor Gray
    Write-Host "3. GitHub Actions pipeline will automatically run" -ForegroundColor White
    Write-Host "4. Check Actions tab for test execution results" -ForegroundColor White
    
} else {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "`n🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Verify GitHub repository exists and you have access" -ForegroundColor White
    Write-Host "2. Check your GitHub credentials" -ForegroundColor White
    Write-Host "3. Ensure you have push permissions to the repository" -ForegroundColor White
    Write-Host "4. Try: git push --set-upstream origin main" -ForegroundColor White
    
    exit 1
}

Write-Host "`n✨ Git setup and push completed!" -ForegroundColor Green
