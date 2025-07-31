import { test, expect } from '@playwright/test';

// Simple demo test for presentation
test.describe('Quick Demo - Azure Blue Login', () => {
  test('Demo: Basic login page test', async ({ page }) => {
    // Step 1: Navigate to the login page
    console.log('Step 1: Navigating to Azure Blue login page...');
    await page.goto('https://employer.modoff.secure.azblue.com/log-in');
    
    // Step 2: Verify page loaded
    console.log('Step 2: Verifying page loaded...');
    await expect(page).toHaveURL(/log-in/);
    
    // Step 3: Take a screenshot for demo
    console.log('Step 3: Taking screenshot...');
    await page.screenshot({ path: 'demo-login-page.png', fullPage: true });
    
    // Step 4: Check for form elements
    console.log('Step 4: Checking for login form...');
    await page.waitForLoadState('networkidle');
    
    // Look for input fields (this will work with most login forms)
    const inputs = await page.locator('input').count();
    console.log(`Found ${inputs} input fields`);
    
    expect(inputs).toBeGreaterThan(0);
    
    console.log('✅ Demo test completed successfully!');
  });

  test('Demo: Login with credentials', async ({ page }) => {
    // Step 1: Navigate to login page
    console.log('Step 1: Navigating to Azure Blue login page...');
    await page.goto('https://employer.modoff.secure.azblue.com/log-in');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Fill in credentials
    console.log('Step 2: Filling in login credentials...');
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    
    await usernameField.fill('pppols');
    await passwordField.fill('Password1');
    
    // Step 3: Take screenshot before login
    await page.screenshot({ path: 'demo-before-login.png', fullPage: true });
    
    // Step 4: Submit login form
    console.log('Step 3: Submitting login form...');
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("log in"), button:has-text("sign in")').first();
    await loginButton.click();
    
    // Step 5: Wait for response and take screenshot
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'demo-after-login.png', fullPage: true });
    
    console.log('Step 4: Login attempt completed');
    console.log(`Current URL: ${page.url()}`);
    
    // Check if login was successful (redirected away from login page)
    if (!page.url().includes('log-in')) {
      console.log('✅ Login successful - redirected to dashboard/home page');
    } else {
      console.log('ℹ️ Still on login page - check for error messages or validation');
    }
    
    console.log('✅ Demo login test completed!');
  });
});
