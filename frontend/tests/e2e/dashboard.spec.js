const { test, expect } = require('@playwright/test');

test.describe('Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/v1/districts*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          districts: [
            { id: 'test1', name_en: 'Test District 1', name_hi: 'टेस्ट 1' }
          ]
        })
      });
    });

    await page.route('**/api/v1/districts/*/summary*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          district_id: 'test1',
          district_name: 'Test District 1',
          metrics: {
            people_benefited: 1000,
            expenditure: 5000000,
            persondays: 5000,
            works_completed: 10
          }
        })
      });
    });
  });

  test('should load homepage and display district selector', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await expect(page.locator('text=Select Your District')).toBeVisible();
  });

  test('should select district and show dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Select district
    await page.fill('input[placeholder*="district"]', 'Test District 1');
    await page.click('text=Test District 1');
    
    // Wait for dashboard
    await expect(page.locator('text=Test District 1')).toBeVisible();
    await expect(page.locator('text=People Who Got Work')).toBeVisible();
  });

  test('should toggle language', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click language toggle
    await page.click('button:has-text("हिंदी")');
    
    // Check if Hindi text appears
    await expect(page.locator('text=अपना जिला चुनें')).toBeVisible();
  });
});

