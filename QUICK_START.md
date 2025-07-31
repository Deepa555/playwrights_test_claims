# Quick Start Guide

This is a quick reference for getting started with the Azure Blue Playwright test repository.

## Prerequisites
- Node.js (v16 or later)
- Git
- PowerShell (Windows) or Bash (Linux/Mac)

## Quick Setup

### 1. Clone and Setup
```bash
git clone <repository-url>
cd playwright-azure-blue-tests
```

### 2. Run Setup Script (Windows)
```powershell
.\run-tests.ps1 -SetupOnly
```

### 3. Manual Setup (Alternative)
```bash
npm install
npx playwright install
cp .env.example .env
# Edit .env file with your credentials
```

## Running Tests

### Quick Commands
```bash
# Run all tests
npm test

# Run with browser visible
npm run test:headed

# Run specific test suites
npm run test:login
npm run test:dashboard

# Run in interactive UI mode
npm run test:ui

# Run on specific browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### PowerShell Commands (Windows)
```powershell
# Setup and run all tests
.\run-tests.ps1

# Run specific test suite with browser visible
.\run-tests.ps1 -TestSuite "login" -Headed

# Setup only (no test execution)
.\run-tests.ps1 -SetupOnly
```

## Project Structure
```
tests/
├── login/          # Login functionality tests
├── dashboard/      # Dashboard tests
└── utils/          # Helper classes and utilities

config/             # Environment configurations
test-data/          # Test data and mock data
azure-pipelines/    # CI/CD pipeline configuration
```

## Key Features
- ✅ Cross-browser testing (Chrome, Firefox, Safari)
- ✅ Mobile responsive testing
- ✅ CI/CD ready (Azure DevOps + GitHub Actions)
- ✅ Screenshot and video capture on failures
- ✅ Detailed HTML reports
- ✅ Helper classes for maintainable tests
- ✅ Environment-based configuration

## Environment Variables
Create a `.env` file with:
```env
LOGIN_USERNAME=your_username
LOGIN_PASSWORD=your_password
BASE_URL=https://employer.modoff.secure.azblue.com
```

## CI/CD Integration
- **Azure DevOps**: Use `azure-pipelines/azure-pipelines.yml`
- **GitHub Actions**: Use `.github/workflows/playwright.yml`

## Troubleshooting
- Check `.env` file has correct credentials
- Ensure all browsers are installed: `npx playwright install`
- View detailed reports: `npm run report`
- Debug failed tests: `npm run test:debug`

## Support
- Check test reports for detailed failure information
- Review helper classes in `tests/utils/` for reusable functions
- Examine `playwright.config.js` for configuration options
