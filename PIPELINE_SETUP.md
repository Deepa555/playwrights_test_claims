# Pipeline Setup Guide

This guide explains how to set up CI/CD pipelines for the Playwright test automation project.

## 📁 Pipeline Files Location

- **Azure DevOps Pipeline**: `azure-pipelines/azure-pipelines.yml`
- **GitHub Actions**: `.github/workflows/playwright.yml`

## 🚀 Azure DevOps Pipeline Setup

### Step 1: Prerequisites
- Azure DevOps organization and project
- Repository connected to Azure DevOps
- Playwright test project in repository

### Step 2: Create Pipeline
1. Go to your Azure DevOps project
2. Navigate to **Pipelines** → **New Pipeline**
3. Select your repository source (GitHub, Azure Repos, etc.)
4. Choose **Existing Azure Pipelines YAML file**
5. Select `/azure-pipelines/azure-pipelines.yml`
6. Review and **Save**

### Step 3: Configure Variables
Set these variables in **Pipeline** → **Edit** → **Variables**:
```yaml
LOGIN_USERNAME: your_test_username
LOGIN_PASSWORD: your_test_password  # Mark as secret
BASE_URL: https://employer.modoff.secure.azblue.com
```

### Step 4: Pipeline Features
The Azure DevOps pipeline includes:
- ✅ **Multi-browser testing** (Chromium, Firefox, WebKit)
- ✅ **Parallel execution** across browsers
- ✅ **Scheduled runs** (daily at 6 AM UTC)
- ✅ **Pull request validation**
- ✅ **Test result publishing**
- ✅ **HTML report publishing**
- ✅ **Screenshot/video artifacts**
- ✅ **Trace file collection** for debugging

### Pipeline Triggers
```yaml
# Automatic triggers
- Push to main, develop, or feature/* branches
- Pull requests to main or develop
- Daily scheduled run at 6 AM UTC
```

## 🐙 GitHub Actions Setup

### Step 1: Repository Setup
1. Push your code to GitHub repository
2. Ensure `.github/workflows/playwright.yml` exists
3. The workflow will automatically be available

### Step 2: Configure Secrets
Go to **Settings** → **Secrets and variables** → **Actions**:
```
LOGIN_USERNAME: your_test_username
LOGIN_PASSWORD: your_test_password
BASE_URL: https://employer.modoff.secure.azblue.com
```

### Step 3: GitHub Actions Features
- ✅ **Cross-browser matrix** testing
- ✅ **Artifact upload** (reports, screenshots)
- ✅ **Scheduled runs** (daily)
- ✅ **Pull request checks**
- ✅ **Node.js caching** for faster builds

## 🔧 Pipeline Configuration

### Environment Variables
Both pipelines support these environment variables:
```bash
LOGIN_USERNAME=your_username      # Test account username
LOGIN_PASSWORD=your_password      # Test account password (secret)
BASE_URL=https://app.url          # Application base URL
NODE_ENV=ci                       # Environment (development/staging/production/ci)
TEST_TIMEOUT=60000               # Test timeout in milliseconds
```

### Browser Matrix
Tests run on multiple browsers:
- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)

### Test Reports
Both pipelines generate:
- **JUnit XML** reports for Azure DevOps integration
- **HTML reports** with screenshots and traces
- **JSON reports** for custom processing
- **Video recordings** on test failures
- **Screenshot artifacts** on failures

## 📊 Pipeline Outputs

### Azure DevOps Artifacts
1. **Test Results** - Integrated with Azure DevOps test reporting
2. **HTML Reports** - Published as pipeline artifacts
3. **Screenshots/Videos** - Available as build artifacts
4. **Trace Files** - For debugging failed tests

### GitHub Actions Artifacts
1. **playwright-report-{browser}** - HTML reports per browser
2. **test-results-{browser}** - Screenshots, videos, traces per browser

## 🛠️ Customization Options

### Modify Test Execution
```yaml
# In azure-pipelines.yml or playwright.yml
- script: |
    npx playwright test --project=chromium --grep="@smoke"
  displayName: 'Run Smoke Tests Only'
```

### Add Environment-Specific Testing
```yaml
# Test against different environments
- script: |
    npx playwright test
  env:
    BASE_URL: https://staging.employer.modoff.secure.azblue.com
  displayName: 'Run Staging Tests'
```

### Custom Notification
Add Teams/Slack notifications:
```yaml
- task: InvokeRESTAPI@1
  condition: always()
  inputs:
    connectionType: 'connectedServiceName'
    serviceConnection: 'teams-webhook'
    method: 'POST'
    body: |
      {
        "text": "Playwright tests completed: $(Agent.JobStatus)"
      }
```

## 🚨 Troubleshooting

### Common Issues

1. **Browser Installation Fails**
   ```yaml
   # Add to pipeline
   - script: npx playwright install-deps
     displayName: 'Install system dependencies'
   ```

2. **Tests Timeout**
   ```yaml
   # Increase timeout
   - script: npx playwright test --timeout=60000
   ```

3. **Credentials Not Working**
   - Verify variables are set correctly
   - Check if variables are marked as secrets
   - Ensure no trailing spaces in values

### Debug Failed Tests
1. Download trace artifacts from pipeline
2. Run locally: `npx playwright show-trace trace.zip`
3. Check screenshots in artifacts
4. Review pipeline logs for detailed errors

## 📋 Pipeline Best Practices

### Security
- ✅ Store credentials as pipeline secrets/variables
- ✅ Use different test accounts for each environment
- ✅ Don't commit credentials to repository
- ✅ Rotate test account passwords regularly

### Performance
- ✅ Use parallel execution for faster runs
- ✅ Cache node_modules for faster builds
- ✅ Run smoke tests first, full suite later
- ✅ Use retries for flaky tests

### Maintenance
- ✅ Keep Playwright version updated
- ✅ Review and update test data regularly
- ✅ Monitor pipeline success rates
- ✅ Set up notifications for failures

## 🔄 Advanced Pipeline Scenarios

### Multi-Environment Testing
```yaml
strategy:
  matrix:
    staging:
      ENVIRONMENT: 'staging'
      BASE_URL: 'https://staging.app.com'
    production:
      ENVIRONMENT: 'production'
      BASE_URL: 'https://app.com'
```

### Conditional Test Execution
```yaml
# Only run full suite on main branch
- script: |
    if [ "$BUILD_SOURCEBRANCHNAME" = "main" ]; then
      npx playwright test
    else
      npx playwright test --grep="@smoke"
    fi
```

### Test Result Analysis
```yaml
# Custom test result processing
- script: |
    node scripts/analyze-test-results.js
  condition: always()
```

## 📞 Support

For pipeline setup assistance:
1. Check pipeline logs for detailed error messages
2. Review artifact outputs (screenshots, traces)
3. Verify all environment variables are configured
4. Test locally first: `npm test`
5. Contact DevOps team for pipeline-specific issues
