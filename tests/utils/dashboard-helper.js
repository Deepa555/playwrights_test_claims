const { expect } = require('@playwright/test');
const testData = require('../../test-data/test-accounts.json');

class DashboardHelper {
  constructor(page) {
    this.page = page;
    this.navigationData = testData.navigationData;
  }

  // Selectors
  get welcomeMessage() {
    return this.page.locator('text=Welcome Patio');
  }

  get accountInfo() {
    return this.page.locator('text=Account(s)');
  }

  get employeeSearchSection() {
    return this.page.locator('text=Employee Search');
  }

  get payBillSection() {
    return this.page.locator('text=Pay Bill');
  }

  get orderIdCardSection() {
    return this.page.locator('text=Order ID Card');
  }

  get addEmployeeSection() {
    return this.page.locator('text=Add a New Employee');
  }

  get notificationBanner() {
    return this.page.locator('text=Spending Account changes, .alert, .notification').first();
  }

  get notificationCloseButton() {
    return this.page.locator('button[aria-label*="close"], button:has-text("×"), .close').first();
  }

  // Employee Search Elements
  get employeeSearchInput() {
    return this.page.locator('input[placeholder*="Search"], input[placeholder*="employee"]').first();
  }

  get employeeSearchButton() {
    return this.page.locator('button:has-text("Search")');
  }

  // Pay Bill Elements
  get payNowButton() {
    return this.page.locator('text=Pay now');
  }

  // Actions
  async verifyDashboardLoaded() {
    console.log('🏠 Verifying dashboard loaded...');
    await expect(this.page).toHaveURL(/\/home/);
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.accountInfo).toBeVisible();
    console.log('✅ Dashboard loaded successfully');
  }

  async verifyAllSections() {
    console.log('📋 Verifying all dashboard sections...');
    
    const sections = [
      { name: 'Employee Search', locator: this.employeeSearchSection },
      { name: 'Pay Bill', locator: this.payBillSection },
      { name: 'Order ID Card', locator: this.orderIdCardSection },
      { name: 'Add New Employee', locator: this.addEmployeeSection }
    ];

    for (const section of sections) {
      await expect(section.locator).toBeVisible();
      console.log(`✅ ${section.name} section visible`);
    }
  }

  async searchEmployee(employeeName) {
    console.log(`🔍 Searching for employee: ${employeeName}`);
    
    await expect(this.employeeSearchInput).toBeVisible();
    await this.employeeSearchInput.fill(employeeName);
    
    if (await this.employeeSearchButton.isVisible()) {
      await this.employeeSearchButton.click();
      await this.page.waitForTimeout(2000);
      console.log('✅ Employee search executed');
      return true;
    }
    
    console.log('⚠️ Search button not found');
    return false;
  }

  async navigateToPayBill() {
    console.log('💳 Navigating to Pay Bill...');
    
    if (await this.payBillSection.isVisible()) {
      await this.payBillSection.click();
      await this.page.waitForTimeout(2000);
      
      if (await this.payNowButton.isVisible()) {
        console.log('✅ Pay Bill section accessed');
        return true;
      }
    }
    
    console.log('⚠️ Pay Bill navigation failed');
    return false;
  }

  async navigateToOrderIdCard() {
    console.log('🆔 Navigating to Order ID Card...');
    
    if (await this.orderIdCardSection.isVisible()) {
      await this.orderIdCardSection.click();
      await this.page.waitForTimeout(2000);
      console.log('✅ Order ID Card section accessed');
      return true;
    }
    
    console.log('⚠️ Order ID Card navigation failed');
    return false;
  }

  async navigateToAddEmployee() {
    console.log('👤 Navigating to Add Employee...');
    
    if (await this.addEmployeeSection.isVisible()) {
      await this.addEmployeeSection.click();
      await this.page.waitForTimeout(2000);
      console.log('✅ Add Employee section accessed');
      return true;
    }
    
    console.log('⚠️ Add Employee navigation failed');
    return false;
  }

  async closeNotification() {
    console.log('🔔 Closing notification banner...');
    
    if (await this.notificationBanner.isVisible()) {
      if (await this.notificationCloseButton.isVisible()) {
        await this.notificationCloseButton.click();
        await this.page.waitForTimeout(1000);
        console.log('✅ Notification closed');
        return true;
      }
    }
    
    console.log('ℹ️ No notification to close');
    return false;
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}-${timestamp}.png`;
    await this.page.screenshot({ path: filename, fullPage: true });
    console.log(`📸 Screenshot saved: ${filename}`);
    return filename;
  }

  async testResponsiveness() {
    console.log('📱 Testing responsive design...');
    
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(1000);
      
      // Verify main elements are still visible
      await expect(this.welcomeMessage).toBeVisible();
      await expect(this.employeeSearchSection).toBeVisible();
      
      await this.takeScreenshot(`dashboard-${viewport.name}`);
      console.log(`✅ ${viewport.name} view verified`);
    }

    // Reset to desktop
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async verifyAccountInfo(expectedAccount = '333536') {
    console.log('🏢 Verifying account information...');
    
    const accountText = await this.page.locator(`text=/Account.*${expectedAccount}/`).textContent().catch(() => null);
    
    if (accountText) {
      console.log(`✅ Account information found: ${accountText}`);
      return true;
    }
    
    console.log('⚠️ Account information not found or incorrect');
    return false;
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // Additional wait for dynamic content
  }
}

module.exports = { DashboardHelper };
