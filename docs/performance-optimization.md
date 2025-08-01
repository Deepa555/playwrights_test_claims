# Playwright Performance Optimization Guide

## Worker Configuration

### Fast Execution Commands

```bash
# Use 4 workers (recommended for most systems)
npm run test:fast

# Use maximum available CPU cores
npm run test:max

# Single worker (for debugging)
npm run test:single

# Default configuration (75% of CPU cores)
npm test
```

### Worker Settings Explained

- **`workers: '75%'`** - Uses 75% of available CPU cores (recommended for local development)
- **`workers: 4`** - Fixed 4 parallel workers (good for most systems)
- **`workers: '100%'`** - Uses all available CPU cores (maximum speed but may freeze system)
- **`workers: 1`** - Single worker (best for debugging, slowest execution)

## Performance Tips

### 1. Optimize Your Tests
```javascript
// Use parallel execution within test files
test.describe.parallel('Dashboard Tests', () => {
  // Tests run in parallel
});

// Share browser context between tests
test.describe.serial('Login Flow', () => {
  // Tests run in sequence but share context
});
```

### 2. Browser Context Optimization
```javascript
// Reuse browser context
const context = await browser.newContext({
  // Cache settings for faster page loads
  recordVideo: process.env.CI ? 'on' : 'off',
  recordHar: process.env.DEBUG ? 'on' : 'off'
});
```

### 3. Selector Optimization
```javascript
// Fast selectors (use data-testid)
await page.locator('[data-testid="login-button"]').click();

// Avoid complex CSS selectors
// Slow: await page.locator('div.container > ul > li:nth-child(3) > a').click();
// Fast: await page.locator('[aria-label="Submit"]').click();
```

## Recommended Worker Configurations

### Local Development
```javascript
// playwright.config.js
workers: process.env.CI ? 2 : '75%'
```

### CI/CD Pipeline
```javascript
// For GitHub Actions/Azure DevOps
workers: process.env.CI ? 2 : '75%'
```

### Development Machine Specs
- **2-4 CPU cores**: `workers: 2`
- **4-8 CPU cores**: `workers: 4` or `'75%'`
- **8+ CPU cores**: `workers: 6` or `'75%'`

## Execution Time Comparison

| Configuration | Estimated Time (10 tests) |
|---------------|---------------------------|
| 1 worker      | ~60 seconds              |
| 2 workers     | ~30 seconds              |
| 4 workers     | ~15 seconds              |
| 75% workers   | ~10-15 seconds           |
| 100% workers  | ~8-12 seconds            |

## System Resource Monitoring

### Check CPU Usage
```bash
# Windows
Get-WmiObject -Class Win32_Processor | Select-Object LoadPercentage

# Monitor during test execution
npm run test:fast
```

### Memory Optimization
- Each worker uses ~100-200MB RAM
- Monitor memory usage during parallel execution
- Reduce workers if system becomes unresponsive

## Advanced Configuration

### Dynamic Worker Assignment
```javascript
// playwright.config.js
const os = require('os');
const cpuCount = os.cpus().length;

export default defineConfig({
  workers: process.env.CI ? 
    Math.min(cpuCount, 4) : // CI: max 4 workers
    Math.max(1, Math.floor(cpuCount * 0.75)) // Local: 75% of CPUs
});
```

### Environment-Specific Settings
```javascript
// Different settings per environment
workers: {
  development: '75%',
  staging: 2,
  production: 4
}[process.env.NODE_ENV] || 2
```

## Troubleshooting

### Tests Failing in Parallel
- Reduce worker count: `npm run test:single`
- Check for shared state between tests
- Use test isolation

### System Freezing
- Reduce worker count to 50%: `workers: '50%'`
- Monitor RAM usage
- Close other applications during testing

### Inconsistent Results
- Add wait strategies
- Use proper selectors
- Implement retry mechanisms
