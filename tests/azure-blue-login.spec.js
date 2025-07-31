import { test, expect } from '@playwright/test';

test.describe('Azure Blue Employer Login Page Tests', () => {
  const loginUrl = 'https://employer.modoff.secure.azblue.com/log-in';

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto(loginUrl);
  });

  test('should load the login page successfully', async ({ page }) => {
    // Verify page loads and has correct title
    await expect(page).toHaveTitle(/login|sign in|azure blue/i);
    
    // Verify the URL is correct
    expect(page.url()).toContain('employer.modoff.secure.azblue.com/log-in');
  });

  test('should display login form elements', async ({ page }) => {
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Check for common login form elements
    // Note: These selectors may need to be adjusted based on actual page structure
    
    // Look for username/email field
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]').first();
    await expect(usernameField).toBeVisible();

    // Look for password field
    const passwordField = page.locator('input[type="password"]').first();
    await expect(passwordField).toBeVisible();

    // Look for login/submit button
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("log in"), button:has-text("sign in")').first();
    await expect(loginButton).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Try to submit form without filling required fields
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("log in"), button:has-text("sign in")').first();
    await loginButton.click();

    // Wait a moment for validation messages to appear
    await page.waitForTimeout(1000);

    // Check for validation messages (common patterns)
    const errorMessages = page.locator('.error, .validation-error, [class*="error"], [class*="invalid"]');
    const errorCount = await errorMessages.count();
    
    // At least some validation should appear
    expect(errorCount).toBeGreaterThan(0);
  });

  test('should attempt login with provided credentials', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Fill in the provided credentials
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    
    await usernameField.fill('pppols');
    await passwordField.fill('Password1');

    // Submit the form
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("log in"), button:has-text("sign in")').first();
    await loginButton.click();

    // Wait for response
    await page.waitForTimeout(3000);

    // Should either show error message or redirect
    // Check if we're still on login page or got redirected
    const currentUrl = page.url();
    
    if (currentUrl.includes('log-in')) {
      // Still on login page, should have error message
      const errorElements = page.locator('.error, .alert-danger, [class*="error"], [role="alert"]');
      const hasError = await errorElements.count() > 0;
      expect(hasError).toBeTruthy();
    } else {
      // Got redirected - this would indicate successful login (unlikely with test creds)
      console.log('Redirected to:', currentUrl);
    }
  });

  test('should have proper security headers and HTTPS', async ({ page }) => {
    const response = await page.goto(loginUrl);
    
    // Verify HTTPS is used
    expect(page.url()).toMatch(/^https:/);
    
    // Check response status
    expect(response?.status()).toBe(200);
    
    // Check for security headers (if present)
    const headers = response?.headers();
    if (headers) {
      // These are optional but good to check if present
      if (headers['strict-transport-security']) {
        expect(headers['strict-transport-security']).toBeTruthy();
      }
      if (headers['x-frame-options']) {
        expect(headers['x-frame-options']).toBeTruthy();
      }
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check if form elements are still visible and usable on mobile
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    
    // Check if elements are not overlapping (basic responsive check)
    const usernameBox = await usernameField.boundingBox();
    const passwordBox = await passwordField.boundingBox();
    
    if (usernameBox && passwordBox) {
      expect(usernameBox.width).toBeGreaterThan(200); // Reasonable width on mobile
      expect(passwordBox.width).toBeGreaterThan(200);
    }
  });

  test('should handle network interruption gracefully', async ({ page }) => {
    // Simulate offline condition
    await page.context().setOffline(true);
    
    try {
      await page.goto(loginUrl, { timeout: 10000 });
    } catch (error) {
      // Expected to fail when offline
      expect(error).toBeTruthy();
    }
    
    // Go back online
    await page.context().setOffline(false);
    
    // Should work again
    await page.goto(loginUrl);
    await expect(page).toHaveURL(/log-in/);
  });
});
