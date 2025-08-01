const { expect } = require('@playwright/test');
const config = require('../../config/env.config');
const testData = require('../../test-data/test-accounts.json');

class LoginHelper {
  constructor(page) {
    this.page = page;
    this.loginUrl = config.loginURL;
    this.credentials = testData.testAccounts.validUser;
  }

  // Selectors
  get usernameField() {
    return this.page.locator('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]').first();
  }

  get passwordField() {
    return this.page.locator('input[type="password"]').first();
  }

  get loginButton() {
    return this.page.locator('button[type="submit"], input[type="submit"], button:has-text("log in"), button:has-text("sign in")').first();
  }

  get errorMessage() {
    return this.page.locator('.error, .alert-danger, [class*="error"], [role="alert"]').first();
  }

  // Actions
  async navigateToLogin() {
    await this.page.goto(this.loginUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async fillCredentials(username = this.credentials.username, password = this.credentials.password) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async performLogin(username = this.credentials.username, password = this.credentials.password) {
    console.log('🔐 Performing login...');
    await this.navigateToLogin();
    await this.fillCredentials(username, password);
    await this.clickLogin();
    
    // Wait for navigation with max 10 seconds timeout, but complete early if page loads
    console.log('⏳ Waiting for login response (max 10 seconds)...');
    
    try {
      // Wait for URL change or network to become idle (whichever comes first)
      await Promise.race([
        // Wait for URL to change from login page
        this.page.waitForURL(url => !url.includes('log-in'), { timeout: 10000 }),
        // Or wait for network to become idle (page loaded)
        this.page.waitForLoadState('networkidle', { timeout: 10000 })
      ]);
      console.log('✅ Page navigation completed');
    } catch (timeoutError) {
      console.log('⏰ Timeout reached (10 seconds) - checking current state...');
    }
    
    const currentUrl = this.page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/home') || currentUrl.includes('/dashboard') || !currentUrl.includes('log-in')) {
      console.log('✅ Login successful - redirected to dashboard');
      return { success: true, url: currentUrl };
    } else if (currentUrl.includes('log-in')) {
      console.log('❌ Login failed - still on login page');
      const errorText = await this.getErrorMessage();
      return { success: false, error: errorText || 'Login timeout - no redirect occurred' };
    }
    
    return { success: false, error: 'Unknown login state after timeout' };
  }

  async getErrorMessage() {
    try {
      if (await this.errorMessage.isVisible()) {
        return await this.errorMessage.textContent();
      }
    } catch (e) {
      // No error message found
    }
    return null;
  }

  // Validations
  async verifyLoginPageElements() {
    await expect(this.usernameField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifyLoginSuccess() {
    // Smart wait - wait for page to stabilize but max 5 seconds
    console.log('🔍 Verifying login success...');
    
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    } catch (e) {
      console.log('⏰ DOM content loaded timeout - proceeding with verification');
    }
    
    // Check if redirected to dashboard with more flexible URL matching
    const currentUrl = this.page.url();
    console.log(`Current URL after login: ${currentUrl}`);
    
    // More flexible URL checking
    const isLoggedIn = currentUrl.includes('/home') || 
                      currentUrl.includes('/dashboard') || 
                      currentUrl.includes('/main') ||
                      !currentUrl.includes('log-in');
    
    if (isLoggedIn) {
      console.log('✅ Login verification: URL indicates successful login');
      
      // Try to find welcome message or other success indicators with timeout
      try {
        const welcomeSelectors = [
          'text=Welcome',
          'text=Dashboard',
          'text=Home',
          '[class*="welcome"]',
          '[class*="dashboard"]',
          '.user-menu',
          '.logout',
          'text=Sign Out',
          'text=Logout'
        ];
        
        for (const selector of welcomeSelectors) {
          try {
            const element = this.page.locator(selector).first();
            if (await element.isVisible({ timeout: 1000 })) {
              console.log(`✅ Found success indicator: ${selector}`);
              return;
            }
          } catch (e) {
            // Continue checking other selectors
          }
        }
        
        console.log('⚠️ No specific welcome message found, but URL indicates success');
      } catch (e) {
        console.log('⚠️ Could not verify welcome message, but URL indicates success');
      }
    } else {
      throw new Error(`Login verification failed - still on login page: ${currentUrl}`);
    }
  }

  async logout() {
    console.log('🚪 Performing logout...');
    const logoutButton = this.page.locator('text=logout, text=sign out, a[href*="logout"], button:has-text("logout")').first();
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await this.page.waitForURL(/log-in/, { timeout: 10000 });
      console.log('✅ Logout successful');
      return true;
    }
    
    console.log('⚠️ Logout button not found');
    return false;
  }
}

module.exports = { LoginHelper };
