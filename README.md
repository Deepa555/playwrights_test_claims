# Azure Blue Playwright Test Automation

This repository contains end-to-end test automation for the Azure Blue employer portal using Playwright.

## 🎯 Project Overview

- **Target Application**: Azure Blue Employer Portal
- **Testing Framework**: Playwright
- **Languages**: JavaScript/TypeScript
- **CI/CD**: Azure DevOps Pipelines
- **Browsers**: Chromium, Firefox, WebKit

## 📁 Repository Structure

```
playwright-claim-testing/
├── .github/workflows/          # GitHub Actions (if needed)
├── .vscode/                    # VS Code settings
├── azure-pipelines/            # Azure DevOps pipeline files
├── tests/                      # Test files
│   ├── login/                  # Login related tests
│   ├── dashboard/              # Dashboard tests
│   ├── employee/               # Employee management tests
│   └── utils/                  # Test utilities and helpers
├── test-data/                  # Test data files
├── config/                     # Configuration files
├── screenshots/                # Test screenshots (gitignored)
├── test-results/               # Test results (gitignored)
├── playwright.config.js        # Playwright configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright-claim-testing
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (browser visible)
npm run test:headed

# Run specific test suite
npm run test:login
npm run test:dashboard

# Run tests in debug mode
npm run test:debug

# Generate and view reports
npm run report
```

## Test Coverage

### Login Tests (`azure-blue-login.spec.js`)
1. **Basic Page Load Test** - Verifies the login page loads successfully
2. **Form Elements Test** - Checks for presence of login form elements
3. **Validation Test** - Tests form validation with empty submission
4. **Login Attempt Test** - Tests login with provided credentials
5. **Security Test** - Verifies HTTPS and security headers
6. **Responsive Test** - Tests mobile responsiveness
7. **Network Test** - Tests handling of network interruptions

### Dashboard Feature Tests (`dashboard-features.spec.js`)
1. **Welcome Message Test** - Verifies dashboard welcome and account info
2. **Employee Search Test** - Tests employee search functionality
3. **Pay Bill Test** - Verifies pay bill section and features
4. **Order ID Card Test** - Tests ID card ordering functionality
5. **Add New Employee Test** - Verifies employee addition features
6. **Notifications Test** - Tests notification banner handling
7. **Layout Test** - Verifies responsive dashboard layout
8. **Navigation Test** - Tests page navigation and URL changes
9. **Performance Test** - Measures page load performance

### Comprehensive Post-Login Tests (`dashboard-post-login.spec.js`)
1. **Dashboard Navigation** - Full navigation testing
2. **Session Management** - Session timeout and maintenance
3. **User Profile Tests** - Profile and logout functionality
4. **Responsive Design** - Multi-viewport testing
5. **Error Handling** - Network and error scenarios

### Demo Tests (`demo-with-credentials.spec.js`)
- **Complete Flow Demo** - Full login to dashboard flow with screenshots
- **Quick Verification** - Fast login verification for presentations

## Demo Meeting Highlights

### Key Features Demonstrated:

- **Cross-browser testing** (Chrome, Firefox, Safari)
- **Mobile responsiveness testing**
- **Security validation** (HTTPS, headers)
- **Form validation testing**
- **Network resilience testing**
- **Detailed reporting** with screenshots and videos on failure
- **Trace viewer** for debugging failed tests

### Test Results Features:

- Automatic screenshots on test failure
- Video recording for failed tests
- Detailed HTML reports
- Trace files for step-by-step debugging

## Customization Notes

The test selectors are generic and may need adjustment based on the actual page structure:

- Username field selectors: `input[type="text"], input[type="email"], input[name*="user"]`
- Password field selectors: `input[type="password"]`
- Login button selectors: `button[type="submit"], button:has-text("log in")`

## Important Security Note

This is a demo test suite. Never commit real credentials to version control. For actual testing, use:
- Environment variables for credentials
- Separate test accounts
- Proper secret management

## Troubleshooting

If tests fail:

1. Check if the website is accessible
2. Verify selectors match the actual page elements
3. Check network connectivity
4. Review test reports and screenshots
5. Use debug mode to step through tests

## Files Structure

```
playwright-demo-tests/
├── tests/
│   └── azure-blue-login.spec.js    # Main test file
├── playwright.config.js            # Playwright configuration
├── package.json                     # Project dependencies
└── README.md                       # This file
```
