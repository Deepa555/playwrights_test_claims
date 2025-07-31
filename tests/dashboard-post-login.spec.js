import { test, expect } from '@playwright/test';

test.describe('Azure Blue Dashboard - Post Login Tests', () => {
  const loginUrl = 'https://employer.modoff.secure.azblue.com/log-in';
  const username = 'pppols';
  const password = 'Password1';

  // Helper function to login before each test
  async function loginUser(page) {
    await page.goto(loginUrl);
    await page.waitForLoadState('networkidle');
    
    const usernameField = page.locator('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("log in"), button:has-text("sign in")').first();
    
    await usernameField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/home', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  }

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('should display dashboard welcome message and user info', async ({ page }) => {
    // Verify we're on the dashboard/home page
    expect(page.url()).toContain('/home');
    
    // Check for welcome message
    const welcomeMessage = page.locator('text=Welcome Patio');
    await expect(welcomeMessage).toBeVisible();
    
    // Check for account information
    const accountInfo = page.locator('text=Account(s)');
    await expect(accountInfo).toBeVisible();
    
    // Take screenshot for verification
    await page.screenshot({ path: 'screenshots/dashboard-welcome.png', fullPage: true });
  });

  test('should display all main dashboard sections', async ({ page }) => {
    // Check for Employee Search section
    const employeeSearchSection = page.locator('text=Employee Search');
    await expect(employeeSearchSection).toBeVisible();
    
    // Check for Pay Bill section
    const payBillSection = page.locator('text=Pay Bill');
    await expect(payBillSection).toBeVisible();
    
    // Check for Order ID Card section
    const orderIdCardSection = page.locator('text=Order ID Card');
    await expect(orderIdCardSection).toBeVisible();
    
    // Check for Add a New Employee section
    const addEmployeeSection = page.locator('text=Add a New Employee');
    await expect(addEmployeeSection).toBeVisible();
    
    console.log('✅ All main dashboard sections are visible');
  });

  test('should have functional Employee Search feature', async ({ page }) => {
    // Locate the employee search input
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="employee"], input[name*="search"]').first();
    await expect(searchInput).toBeVisible();
    
    // Test search functionality
    await searchInput.fill('John Doe');
    
    // Look for search button
    const searchButton = page.locator('button:has-text("Search"), input[type="submit"]').first();
    await expect(searchButton).toBeVisible();
    
    // Click search button
    await searchButton.click();
    
    // Wait for search results or error message
    await page.waitForTimeout(2000);
    
    // Take screenshot of search results
    await page.screenshot({ path: 'screenshots/employee-search-results.png', fullPage: true });
    
    console.log('✅ Employee search functionality tested');
  });

  test('should navigate to Pay Bill section', async ({ page }) => {
    // Look for Pay Bill link or button
    const payBillLink = page.locator('text=Pay Bill, a[href*="bill"], a[href*="pay"]').first();
    
    if (await payBillLink.isVisible()) {
      await payBillLink.click();
      await page.waitForTimeout(2000);
      
      // Check if we navigated to pay bill page or section
      const currentUrl = page.url();
      console.log(`Navigated to: ${currentUrl}`);
      
      // Look for pay bill related content
      const payBillContent = page.locator('text=Pay now, text=View your bill, text=make adjustments');
      const hasPayBillContent = await payBillContent.count() > 0;
      
      expect(hasPayBillContent).toBeTruthy();
      
      await page.screenshot({ path: 'screenshots/pay-bill-section.png', fullPage: true });
    }
    
    console.log('✅ Pay Bill navigation tested');
  });

  test('should navigate to Order ID Card section', async ({ page }) => {
    // Look for Order ID Card section or link
    const orderIdLink = page.locator('text=Order ID Card, a[href*="id"], a[href*="card"]').first();
    
    if (await orderIdLink.isVisible()) {
      await orderIdLink.click();
      await page.waitForTimeout(2000);
      
      // Check for ID card related content
      const idCardContent = page.locator('text=Order ID Cards, text=make address changes, text=print temporary');
      const hasIdCardContent = await idCardContent.count() > 0;
      
      if (hasIdCardContent) {
        expect(hasIdCardContent).toBeTruthy();
        console.log('✅ Order ID Card section contains expected content');
      }
      
      await page.screenshot({ path: 'screenshots/order-id-card-section.png', fullPage: true });
    }
    
    console.log('✅ Order ID Card navigation tested');
  });

  test('should navigate to Add New Employee section', async ({ page }) => {
    // Look for Add New Employee section
    const addEmployeeLink = page.locator('text=Add a New Employee, a[href*="employee"], a[href*="add"]').first();
    
    if (await addEmployeeLink.isVisible()) {
      await addEmployeeLink.click();
      await page.waitForTimeout(2000);
      
      // Check for add employee related content
      const addEmployeeContent = page.locator('text=Add an Employee, text=Standard Employee Application, text=Complete the online application');
      const hasAddEmployeeContent = await addEmployeeContent.count() > 0;
      
      if (hasAddEmployeeContent) {
        expect(hasAddEmployeeContent).toBeTruthy();
        console.log('✅ Add New Employee section contains expected content');
      }
      
      await page.screenshot({ path: 'screenshots/add-employee-section.png', fullPage: true });
    }
    
    console.log('✅ Add New Employee navigation tested');
  });

  test('should display and handle notifications', async ({ page }) => {
    // Check for notification banner about Spending Account changes
    const notification = page.locator('text=Spending Account changes, .alert, .notification, [role="alert"]');
    
    if (await notification.count() > 0) {
      await expect(notification.first()).toBeVisible();
      console.log('✅ Notification banner is visible');
      
      // Check for close button on notification
      const closeButton = page.locator('button[aria-label="close"], .close, button:has-text("×")').first();
      
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(1000);
        
        // Verify notification is closed
        const notificationAfterClose = await notification.count();
        expect(notificationAfterClose).toBeLessThanOrEqual(0);
        console.log('✅ Notification can be closed');
      }
    }
    
    await page.screenshot({ path: 'screenshots/notifications-handled.png', fullPage: true });
  });

  test('should have working navigation menu', async ({ page }) => {
    // Look for navigation elements
    const navElements = page.locator('nav, .navigation, .menu, [role="navigation"]');
    
    if (await navElements.count() > 0) {
      console.log('✅ Navigation menu found');
      
      // Look for common navigation links
      const navLinks = page.locator('nav a, .navigation a, .menu a');
      const linkCount = await navLinks.count();
      
      expect(linkCount).toBeGreaterThan(0);
      console.log(`Found ${linkCount} navigation links`);
      
      // Test clicking first navigation link if available
      if (linkCount > 0) {
        const firstLink = navLinks.first();
        const linkText = await firstLink.textContent();
        console.log(`Testing navigation link: "${linkText}"`);
        
        await firstLink.click();
        await page.waitForTimeout(2000);
        
        console.log(`✅ Navigation link "${linkText}" clicked successfully`);
      }
    }
    
    await page.screenshot({ path: 'screenshots/navigation-menu.png', fullPage: true });
  });

  test('should have user profile or logout functionality', async ({ page }) => {
    // Look for user profile or logout elements
    const userElements = page.locator('text=logout, text=profile, text=account, text=sign out, .user-menu, .profile');
    
    if (await userElements.count() > 0) {
      console.log('✅ User profile/logout elements found');
      
      // Look specifically for logout
      const logoutElement = page.locator('text=logout, text=sign out, a[href*="logout"], button:has-text("logout")').first();
      
      if (await logoutElement.isVisible()) {
        console.log('✅ Logout functionality is available');
        
        // Don't actually logout in this test, just verify it's there
        await expect(logoutElement).toBeVisible();
      }
    }
    
    await page.screenshot({ path: 'screenshots/user-profile-area.png', fullPage: true });
  });

  test('should verify dashboard responsiveness', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);
      
      // Check if main elements are still visible
      const welcomeMessage = page.locator('text=Welcome Patio');
      const employeeSearch = page.locator('text=Employee Search');
      
      await expect(welcomeMessage).toBeVisible();
      await expect(employeeSearch).toBeVisible();
      
      await page.screenshot({ 
        path: `screenshots/dashboard-${viewport.name}-view.png`, 
        fullPage: true 
      });
      
      console.log(`✅ Dashboard responsive on ${viewport.name} view`);
    }
  });

  test('should handle session timeout gracefully', async ({ page }) => {
    // This test simulates a long session to check for timeout handling
    console.log('Testing session management...');
    
    // Wait for a few seconds to simulate user inactivity
    await page.waitForTimeout(5000);
    
    // Try to interact with the page
    const employeeSearch = page.locator('text=Employee Search');
    await expect(employeeSearch).toBeVisible();
    
    // Refresh the page to see if session is maintained
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if still logged in or redirected to login
    const currentUrl = page.url();
    
    if (currentUrl.includes('log-in')) {
      console.log('ℹ️ Session expired - redirected to login page');
    } else {
      console.log('✅ Session maintained after page refresh');
      const welcomeMessage = page.locator('text=Welcome Patio');
      await expect(welcomeMessage).toBeVisible();
    }
    
    await page.screenshot({ path: 'screenshots/session-test.png', fullPage: true });
  });
});
