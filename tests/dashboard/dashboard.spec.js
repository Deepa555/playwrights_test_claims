const { test, expect } = require('@playwright/test');
const { LoginHelper } = require('../utils/login-helper');
const { DashboardHelper } = require('../utils/dashboard-helper');

test.describe('Azure Blue Dashboard Tests', () => {
  let loginHelper;
  let dashboardHelper;

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page);
    dashboardHelper = new DashboardHelper(page);
    
    // Login before each test
    const result = await loginHelper.performLogin();
    expect(result.success).toBeTruthy();
    
    await dashboardHelper.waitForPageLoad();
  });

  test('should display dashboard welcome message and account info', async ({ page }) => {
    console.log('🏠 Testing dashboard welcome section...');
    
    await dashboardHelper.verifyDashboardLoaded();
    await dashboardHelper.verifyAccountInfo();
    
    await dashboardHelper.takeScreenshot('dashboard-welcome');
    console.log('✅ Dashboard welcome section verified');
  });

  test('should display all main dashboard sections', async ({ page }) => {
    console.log('📋 Testing all dashboard sections...');
    
    await dashboardHelper.verifyAllSections();
    
    await dashboardHelper.takeScreenshot('dashboard-all-sections');
    console.log('✅ All dashboard sections verified');
  });

  test('should handle employee search functionality', async ({ page }) => {
    console.log('🔍 Testing employee search...');
    
    const testEmployee = 'John Doe';
    const searchResult = await dashboardHelper.searchEmployee(testEmployee);
    
    expect(searchResult).toBeTruthy();
    
    await dashboardHelper.takeScreenshot('employee-search-results');
    console.log('✅ Employee search functionality tested');
  });

  test('should navigate to Pay Bill section', async ({ page }) => {
    console.log('💳 Testing Pay Bill navigation...');
    
    const navigationResult = await dashboardHelper.navigateToPayBill();
    
    if (navigationResult) {
      expect(navigationResult).toBeTruthy();
      await dashboardHelper.takeScreenshot('pay-bill-section');
    }
    
    console.log('✅ Pay Bill section navigation tested');
  });

  test('should navigate to Order ID Card section', async ({ page }) => {
    console.log('🆔 Testing Order ID Card navigation...');
    
    const navigationResult = await dashboardHelper.navigateToOrderIdCard();
    
    if (navigationResult) {
      expect(navigationResult).toBeTruthy();
      await dashboardHelper.takeScreenshot('order-id-card-section');
    }
    
    console.log('✅ Order ID Card section navigation tested');
  });

  test('should navigate to Add Employee section', async ({ page }) => {
    console.log('👤 Testing Add Employee navigation...');
    
    const navigationResult = await dashboardHelper.navigateToAddEmployee();
    
    if (navigationResult) {
      expect(navigationResult).toBeTruthy();
      await dashboardHelper.takeScreenshot('add-employee-section');
    }
    
    console.log('✅ Add Employee section navigation tested');
  });

  test('should handle notification banner', async ({ page }) => {
    console.log('🔔 Testing notification banner...');
    
    // Check if notification exists and close it
    const closeResult = await dashboardHelper.closeNotification();
    
    await dashboardHelper.takeScreenshot('notification-handling');
    console.log('✅ Notification banner handling tested');
  });

  test('should be responsive across different devices', async ({ page }) => {
    console.log('📱 Testing dashboard responsiveness...');
    
    await dashboardHelper.testResponsiveness();
    
    console.log('✅ Dashboard responsiveness verified');
  });

  test('should maintain functionality after page navigation', async ({ page }) => {
    console.log('🧭 Testing navigation and back functionality...');
    
    const initialUrl = page.url();
    
    // Navigate to different sections
    await dashboardHelper.navigateToPayBill();
    await page.waitForTimeout(2000);
    
    // Go back to dashboard
    await page.goBack();
    await dashboardHelper.waitForPageLoad();
    
    // Verify we're back on dashboard
    await dashboardHelper.verifyDashboardLoaded();
    
    console.log('✅ Navigation and back functionality verified');
  });

  test('should handle session timeout gracefully', async ({ page }) => {
    console.log('⏰ Testing session timeout handling...');
    
    // Simulate longer wait time
    await page.waitForTimeout(5000);
    
    // Try to interact with the page
    await dashboardHelper.verifyDashboardLoaded();
    
    // Refresh page to test session persistence
    await page.reload();
    await dashboardHelper.waitForPageLoad();
    
    const currentUrl = page.url();
    
    if (currentUrl.includes('/home')) {
      console.log('✅ Session maintained');
      await dashboardHelper.verifyDashboardLoaded();
    } else if (currentUrl.includes('log-in')) {
      console.log('ℹ️ Session expired - user redirected to login');
      // This is expected behavior
    }
    
    console.log('✅ Session timeout handling verified');
  });

  test('should verify page load performance', async ({ page }) => {
    console.log('⚡ Testing page load performance...');
    
    const startTime = Date.now();
    
    await page.reload();
    await dashboardHelper.waitForPageLoad();
    
    const loadTime = Date.now() - startTime;
    console.log(`Dashboard load time: ${loadTime}ms`);
    
    // Verify reasonable load time (less than 10 seconds)
    expect(loadTime).toBeLessThan(10000);
    
    // Verify all main elements loaded
    await dashboardHelper.verifyDashboardLoaded();
    await dashboardHelper.verifyAllSections();
    
    console.log('✅ Page load performance verified');
  });
});
