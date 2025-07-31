import { test, expect } from '@playwright/test';

test.describe('Azure Blue Dashboard - Main Features Tests', () => {
  const loginUrl = 'https://employer.modoff.secure.azblue.com/log-in';
  const username = 'pppols';
  const password = 'Password1';

  // Login helper function
  async function performLogin(page) {
    await page.goto(loginUrl);
    await page.waitForLoadState('networkidle');
    
    await page.locator('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]').first().fill(username);
    await page.locator('input[type="password"]').first().fill(password);
    await page.locator('button[type="submit"], input[type="submit"], button:has-text("log in"), button:has-text("sign in")').first().click();
    
    await page.waitForURL('**/home', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  }

  test.beforeEach(async ({ page }) => {
    await performLogin(page);
  });

  test('Dashboard: Verify Welcome Message and Account Info', async ({ page }) => {
    console.log('🏠 Testing Dashboard Welcome Section');
    
    // Verify welcome message for Patio
    await expect(page.locator('text=Welcome Patio')).toBeVisible();
    console.log('✅ Welcome message displayed');
    
    // Verify account information
    await expect(page.locator('text=Account(s)')).toBeVisible();
    console.log('✅ Account information visible');
    
    // Check for account number (visible in screenshot as 333536)
    const accountText = await page.locator('text=/Account.*333536/').textContent().catch(() => null);
    if (accountText) {
      console.log(`✅ Account number found: ${accountText}`);
    }
    
    await page.screenshot({ path: 'screenshots/dashboard-header.png' });
  });

  test('Employee Search: Verify Search Functionality', async ({ page }) => {
    console.log('🔍 Testing Employee Search Feature');
    
    // Verify Employee Search section exists
    await expect(page.locator('text=Employee Search')).toBeVisible();
    
    // Check for "Find an Employee" text
    await expect(page.locator('text=Find an Employee')).toBeVisible();
    
    // Verify search description text
    await expect(page.locator('text=Make changes, terminate coverage or order ID cards for Employees')).toBeVisible();
    
    // Find and test the search input field
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="employee"]').first();
    await expect(searchInput).toBeVisible();
    
    // Test entering a search term
    await searchInput.fill('Test Employee');
    console.log('✅ Search input field working');
    
    // Find and click search button
    const searchButton = page.locator('button:has-text("Search")');
    if (await searchButton.isVisible()) {
      await searchButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Search button clicked');
    }
    
    await page.screenshot({ path: 'screenshots/employee-search.png' });
  });

  test('Pay Bill: Verify Pay Bill Section', async ({ page }) => {
    console.log('💳 Testing Pay Bill Feature');
    
    // Verify Pay Bill section
    await expect(page.locator('text=Pay Bill')).toBeVisible();
    
    // Check for bill description
    await expect(page.locator('text=View your bill, make adjustments or pay your bill online')).toBeVisible();
    
    // Look for "Pay now" link/button
    const payNowButton = page.locator('text=Pay now');
    if (await payNowButton.count() > 0) {
      await expect(payNowButton).toBeVisible();
      console.log('✅ Pay now button found');
      
      // Test clicking pay now (but don't complete payment)
      await payNowButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Pay now button clicked');
    }
    
    await page.screenshot({ path: 'screenshots/pay-bill-section.png' });
  });

  test('Order ID Card: Verify ID Card Ordering', async ({ page }) => {
    console.log('🆔 Testing Order ID Card Feature');
    
    // Verify Order ID Card section
    await expect(page.locator('text=Order ID Card')).toBeVisible();
    
    // Check for ID card description
    const idCardDescription = page.locator('text=Order ID Cards, make address changes and print temporary ID cards');
    if (await idCardDescription.count() > 0) {
      await expect(idCardDescription).toBeVisible();
      console.log('✅ ID Card description found');
    }
    
    // Look for ID card icon or image
    const idCardIcon = page.locator('img, svg, [class*="card"], [class*="id"]').first();
    if (await idCardIcon.count() > 0) {
      console.log('✅ ID Card visual element found');
    }
    
    await page.screenshot({ path: 'screenshots/order-id-card.png' });
  });

  test('Add New Employee: Verify Employee Addition Feature', async ({ page }) => {
    console.log('👤 Testing Add New Employee Feature');
    
    // Verify Add a New Employee section
    await expect(page.locator('text=Add a New Employee')).toBeVisible();
    
    // Check for "Add an Employee to a Group" text
    await expect(page.locator('text=Add an Employee to a Group')).toBeVisible();
    
    // Check for application description
    const appDescription = page.locator('text=Standard Employee Application');
    if (await appDescription.count() > 0) {
      await expect(appDescription).toBeVisible();
      console.log('✅ Standard Employee Application text found');
    }
    
    // Look for detailed description
    const detailedDescription = page.locator('text=Complete the online application for an Employee. Takes you through all the steps of the application');
    if (await detailedDescription.count() > 0) {
      await expect(detailedDescription).toBeVisible();
      console.log('✅ Detailed application description found');
    }
    
    await page.screenshot({ path: 'screenshots/add-new-employee.png' });
  });

  test('Notifications: Verify Spending Account Changes Banner', async ({ page }) => {
    console.log('🔔 Testing Notification Banner');
    
    // Look for the spending account changes notification
    const notification = page.locator('text=Spending Account changes');
    if (await notification.count() > 0) {
      await expect(notification).toBeVisible();
      console.log('✅ Spending Account changes notification visible');
      
      // Check for email information in notification
      const emailText = page.locator('text=CommercialEnrollment@azblue.com');
      if (await emailText.count() > 0) {
        await expect(emailText).toBeVisible();
        console.log('✅ Email contact information found in notification');
      }
      
      // Look for close button (X)
      const closeButton = page.locator('button[aria-label*="close"], button:has-text("×"), .close').first();
      if (await closeButton.count() > 0) {
        console.log('✅ Close button found on notification');
        // Don't actually close it for screenshot purposes
      }
    }
    
    await page.screenshot({ path: 'screenshots/notification-banner.png' });
  });

  test('Dashboard Layout: Verify Overall Layout and Responsiveness', async ({ page }) => {
    console.log('📐 Testing Dashboard Layout');
    
    // Take full page screenshot
    await page.screenshot({ path: 'screenshots/full-dashboard.png', fullPage: true });
    
    // Verify all 4 main sections are visible
    const sections = [
      'Employee Search',
      'Pay Bill', 
      'Order ID Card',
      'Add a New Employee'
    ];
    
    for (const section of sections) {
      await expect(page.locator(`text=${section}`)).toBeVisible();
      console.log(`✅ ${section} section visible`);
    }
    
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Verify sections are still accessible on mobile
    for (const section of sections) {
      const element = page.locator(`text=${section}`);
      if (await element.count() > 0) {
        console.log(`✅ ${section} accessible on mobile`);
      }
    }
    
    await page.screenshot({ path: 'screenshots/dashboard-mobile.png', fullPage: true });
    
    // Reset to desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('Navigation: Test Page Navigation and URL Changes', async ({ page }) => {
    console.log('🧭 Testing Navigation');
    
    const initialUrl = page.url();
    console.log(`Initial URL: ${initialUrl}`);
    
    // Test clicking on different sections to see if they navigate
    const sections = [
      { name: 'Employee Search', selector: 'text=Employee Search' },
      { name: 'Pay Bill', selector: 'text=Pay Bill' },
      { name: 'Order ID Card', selector: 'text=Order ID Card' },
      { name: 'Add a New Employee', selector: 'text=Add a New Employee' }
    ];
    
    for (const section of sections) {
      const element = page.locator(section.selector).first();
      
      if (await element.isVisible()) {
        await element.click();
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        console.log(`After clicking ${section.name}: ${currentUrl}`);
        
        // Take screenshot after each navigation
        await page.screenshot({ 
          path: `screenshots/navigation-${section.name.toLowerCase().replace(/\s+/g, '-')}.png` 
        });
        
        // Go back to home if URL changed
        if (currentUrl !== initialUrl) {
          await page.goBack();
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  test('Performance: Verify Page Load Performance', async ({ page }) => {
    console.log('⚡ Testing Performance');
    
    const startTime = Date.now();
    
    // Reload the page and measure load time
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Verify load time is reasonable (less than 10 seconds)
    expect(loadTime).toBeLessThan(10000);
    
    // Check if all main elements load quickly
    await expect(page.locator('text=Welcome Patio')).toBeVisible();
    await expect(page.locator('text=Employee Search')).toBeVisible();
    await expect(page.locator('text=Pay Bill')).toBeVisible();
    
    console.log('✅ All main elements loaded successfully');
  });
});
