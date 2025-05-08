import { test, expect } from '@playwright/test';

test.describe('Game List Responsive and Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for games to load
    await expect(page.getByTestId('loading-skeleton')).not.toBeVisible();
    await expect(page.getByTestId('games-grid')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions
    
    // Check if the grid adapts to mobile layout
    const gamesGrid = page.getByTestId('games-grid');
    await expect(gamesGrid).toBeVisible();
    
    // Check if the game cards stack vertically on mobile
    const firstGameCard = page.getByTestId(/^game-card-/).first();
    await expect(firstGameCard).toBeVisible();
    
    // On mobile, the width of the game card should be close to the width of the container
    const containerBounds = await gamesGrid.boundingBox();
    const cardBounds = await firstGameCard.boundingBox();
    
    if (containerBounds && cardBounds) {
      // The card should take up most of the container width on mobile
      expect(cardBounds.width).toBeGreaterThan(containerBounds.width * 0.9);
    }
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad dimensions
    
    // Wait for layout to adjust
    await page.waitForTimeout(500);
    
    const gamesGrid = page.getByTestId('games-grid');
    await expect(gamesGrid).toBeVisible();
    
    // On tablet, we should have a 2-column layout
    // First, ensure we have at least 2 cards for testing
    const gameCards = page.getByTestId(/^game-card-/);
    const count = await gameCards.count();
    
    if (count >= 2) {
      const firstCardBounds = await gameCards.nth(0).boundingBox();
      const secondCardBounds = await gameCards.nth(1).boundingBox();
      
      if (firstCardBounds && secondCardBounds) {
        // In a 2-column layout, the second card should either be to the right or below the first
        const isMultiColumn = secondCardBounds.x > firstCardBounds.x + firstCardBounds.width/2;
        expect(isMultiColumn).toBeTruthy();
      }
    }
  });

  test('should be responsive on desktop viewport', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Wait for layout to adjust
    await page.waitForTimeout(500);
    
    const gamesGrid = page.getByTestId('games-grid');
    await expect(gamesGrid).toBeVisible();
    
    // On desktop, we should have a 3-column layout
    // We need at least 3 cards to test this properly
    const gameCards = page.getByTestId(/^game-card-/);
    const count = await gameCards.count();
    
    if (count >= 3) {
      const firstCardBounds = await gameCards.nth(0).boundingBox();
      const secondCardBounds = await gameCards.nth(1).boundingBox();
      const thirdCardBounds = await gameCards.nth(2).boundingBox();
      
      if (firstCardBounds && secondCardBounds && thirdCardBounds) {
        // Check that the third card is not below the first one (indicating 3 columns)
        // In a 3-column layout with enough cards, the third card should be on the same row
        const isThreeColumn = thirdCardBounds.y < firstCardBounds.y + firstCardBounds.height;
        expect(isThreeColumn).toBeTruthy();
      }
    }
  });

  test('should have accessible link text', async ({ page }) => {
    // Check if each game card link has proper accessibility attributes
    const gameCards = page.getByTestId(/^game-card-/);
    const count = await gameCards.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) { // Test up to 3 cards
      const card = gameCards.nth(i);
      
      // Each card should have visible text for screen readers
      const titleElement = card.getByTestId(/^game-title-/);
      await expect(titleElement).toBeVisible();
      
      // The title text should be non-empty
      const titleText = await titleElement.textContent();
      expect(titleText?.trim().length).toBeGreaterThan(0);
      
      // The "View details" text should also be present for clarity
      const viewDetailsText = card.getByText('View details');
      await expect(viewDetailsText).toBeVisible();
    }
  });

  test('should ensure game cards are clickable', async ({ page }) => {
    // Check that game cards are sufficiently large targets for clicking
    const firstGameCard = page.getByTestId(/^game-card-/).first();
    
    const boundingBox = await firstGameCard.boundingBox();
    if (boundingBox) {
      // Cards should be reasonably sized for touch interaction
      // W3C recommends touch targets of at least 44x44px
      expect(boundingBox.width).toBeGreaterThan(44);
      expect(boundingBox.height).toBeGreaterThan(44);
    }
    
    // Verify the card is clickable by checking its cursor style
    const cursorStyle = await firstGameCard.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    
    // For links, the cursor should be a pointer
    expect(cursorStyle).toBe('pointer');
  });
});
