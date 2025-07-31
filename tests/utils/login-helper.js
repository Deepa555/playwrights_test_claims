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
    
    // Wait for either redirect or error
    await this.page.waitForTimeout(3000);
    
    const currentUrl = this.page.url();
    if (currentUrl.includes('/home')) {
      console.log('✅ Login successful - redirected to dashboard');
      return { success: true, url: currentUrl };
    } else if (currentUrl.includes('log-in')) {
      console.log('❌ Login failed - still on login page');
      const errorText = await this.getErrorMessage();
      return { success: false, error: errorText };
    }
    
    return { success: false, error: 'Unknown login state' };
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
    // Check if redirected to dashboard
    await expect(this.page).toHaveURL(/\/home/);
    
    // Check for welcome message
    const welcomeMessage = this.page.locator('text=Welcome');
    await expect(welcomeMessage).toBeVisible();
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
