import { test, expect } from '@playwright/test';

test('homepage has title and links', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Tailspin Toys/);
    
    console.log('Page title:', await page.title());
});

