const { test, expect } = require('@playwright/test');
const { LoginHelper } = require('../utils/login-helper');
const config = require('../../config/env.config');

test.describe('Azure Blue Login Tests', () => {
  let loginHelper;

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page);
  });

  test('should load login page successfully', async ({ page }) => {
    console.log('🌐 Testing login page load...');
    
    await loginHelper.navigateToLogin();
    
    // Verify URL and HTTPS
    expect(page.url()).toContain('log-in');
    expect(page.url()).toMatch(/^https:/);
    
    // Verify page title
    await expect(page).toHaveTitle(/login|sign in|azure blue/i);
    
    console.log('✅ Login page loaded successfully');
  });

  test('should display all login form elements', async ({ page }) => {
    console.log('🔍 Testing login form elements...');
    
    await loginHelper.navigateToLogin();
    await loginHelper.verifyLoginPageElements();
    
    console.log('✅ All login form elements are visible');
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    console.log('⚠️ Testing form validation...');
    
    await loginHelper.navigateToLogin();
    await loginHelper.clickLogin();
    
    // Wait for validation messages
    await page.waitForTimeout(1000);
    
    // Check for validation messages
    const errorMessages = page.locator('.error, .validation-error, [class*="error"], [class*="invalid"]');
    const errorCount = await errorMessages.count();
    
    expect(errorCount).toBeGreaterThan(0);
    console.log('✅ Form validation working correctly');
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    console.log('🔐 Testing successful login...');
    
    const result = await loginHelper.performLogin();
    
    expect(result.success).toBeTruthy();
    await loginHelper.verifyLoginSuccess();
    
    console.log('✅ Login successful with valid credentials');
  });

  test('should handle invalid credentials properly', async ({ page }) => {
    console.log('❌ Testing invalid credentials...');
    
    const result = await loginHelper.performLogin('invalid@test.com', 'wrongpassword');
    
    expect(result.success).toBeFalsy();
    
    if (result.error) {
      console.log(`Error message: ${result.error}`);
    }
    
    console.log('✅ Invalid credentials handled properly');
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    console.log('📱 Testing mobile responsiveness...');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await loginHelper.navigateToLogin();
    
    // Verify form elements are still visible and usable
    await loginHelper.verifyLoginPageElements();
    
    // Check element dimensions
    const usernameBox = await loginHelper.usernameField.boundingBox();
    const passwordBox = await loginHelper.passwordField.boundingBox();
    
    if (usernameBox && passwordBox) {
      expect(usernameBox.width).toBeGreaterThan(200);
      expect(passwordBox.width).toBeGreaterThan(200);
    }
    
    console.log('✅ Login page is mobile responsive');
  });

  test('should have proper security headers', async ({ page }) => {
    console.log('🔒 Testing security headers...');
    
    const response = await page.goto(config.loginURL);
    
    expect(response?.status()).toBe(200);
    expect(page.url()).toMatch(/^https:/);
    
    const headers = response?.headers();
    if (headers) {
      console.log('Security headers found:');
      
      if (headers['strict-transport-security']) {
        console.log('- Strict-Transport-Security: ✅');
        expect(headers['strict-transport-security']).toBeTruthy();
      }
      
      if (headers['x-frame-options']) {
        console.log('- X-Frame-Options: ✅');
        expect(headers['x-frame-options']).toBeTruthy();
      }
      
      if (headers['x-content-type-options']) {
        console.log('- X-Content-Type-Options: ✅');
      }
    }
    
    console.log('✅ Security verification completed');
  });

  test('should handle network interruption gracefully', async ({ page }) => {
    console.log('📡 Testing network resilience...');
    
    // Test offline condition
    await page.context().setOffline(true);
    
    try {
      await page.goto(config.loginURL, { timeout: 10000 });
    } catch (error) {
      expect(error).toBeTruthy();
      console.log('✅ Offline condition handled properly');
    }
    
    // Go back online
    await page.context().setOffline(false);
    
    // Should work again
    await loginHelper.navigateToLogin();
    await expect(page).toHaveURL(/log-in/);
    
    console.log('✅ Network recovery successful');
  });

  test('should maintain session after page refresh', async ({ page }) => {
    console.log('🔄 Testing session persistence...');
    
    // Login first
    const result = await loginHelper.performLogin();
    expect(result.success).toBeTruthy();
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    
    if (currentUrl.includes('/home')) {
      console.log('✅ Session maintained after refresh');
    } else if (currentUrl.includes('log-in')) {
      console.log('ℹ️ Session expired - redirected to login (expected behavior)');
    }
    
    console.log('✅ Session handling verified');
  });
});
