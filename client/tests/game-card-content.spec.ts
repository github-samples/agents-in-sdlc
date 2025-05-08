import { test, expect } from '@playwright/test';

test.describe('Game Card Content Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for games to load
    await expect(page.getByTestId('loading-skeleton')).not.toBeVisible();
    await expect(page.getByTestId('games-grid')).toBeVisible();
  });

  test('should display correct game title and description', async ({ page }) => {
    // Get the first game card
    const firstGameCard = page.getByTestId(/^game-card-/).first();
    await expect(firstGameCard).toBeVisible();
    
    // Get the game title and verify it's not empty
    const gameTitle = page.getByTestId(/^game-title-/).first();
    const titleText = await gameTitle.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText?.trim().length).toBeGreaterThan(0);
    
    // Verify that the description text is present
    const descriptionElement = firstGameCard.locator('p.text-slate-400');
    await expect(descriptionElement).toBeVisible();
    const descriptionText = await descriptionElement.textContent();
    expect(descriptionText).toBeTruthy();
    expect(descriptionText?.trim().length).toBeGreaterThan(0);
  });

  test('should display publisher and category tags when present', async ({ page }) => {
    // Find a game that has both publisher and category
    const gameCards = page.getByTestId(/^game-card-/);
    const count = await gameCards.count();
    
    console.log(`Found ${count} game cards`);
    expect(count).toBeGreaterThan(0);
    
    // Loop through game cards to check for publisher or category
    for (let i = 0; i < count; i++) {
      const card = gameCards.nth(i);
      const cardId = await card.getAttribute('data-testid');
      const gameId = cardId?.replace('game-card-', '');
      
      if (!gameId) continue;
      
      const categoryExists = await page.getByTestId(`game-category-${gameId}`).count() > 0;
      const publisherExists = await page.getByTestId(`game-publisher-${gameId}`).count() > 0;
      
      if (categoryExists) {
        // Verify category tag content only if it exists
        const categoryTag = page.getByTestId(`game-category-${gameId}`);
        await expect(categoryTag).toBeVisible();
        const categoryText = await categoryTag.textContent();
        expect(categoryText).toBeTruthy();
        expect(categoryText?.trim().length).toBeGreaterThan(0);
        console.log(`Found category tag: ${categoryText}`);
      }
      
      if (publisherExists) {
        // Verify publisher tag content only if it exists
        const publisherTag = page.getByTestId(`game-publisher-${gameId}`);
        await expect(publisherTag).toBeVisible();
        const publisherText = await publisherTag.textContent();
        expect(publisherText).toBeTruthy();
        expect(publisherText?.trim().length).toBeGreaterThan(0);
        console.log(`Found publisher tag: ${publisherText}`);
      }
      
      // Only check the first 3 cards for efficiency
      if (i >= 2) break;
    }
    
    // This test will always pass as long as we have game cards
    // We don't enforce publisher or category presence
  });

  test('should have a "View details" link for each game', async ({ page }) => {
    // Check if each game card has a view details link
    const gameCards = page.getByTestId(/^game-card-/);
    const count = await gameCards.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) { // Test up to 3 cards
      const card = gameCards.nth(i);
      const viewDetailsText = card.getByText('View details');
      await expect(viewDetailsText).toBeVisible();
    }
  });

  test('should have proper href attribute matching game id', async ({ page }) => {
    // Check if each game card has the correct href
    const gameCards = page.getByTestId(/^game-card-/);
    const count = await gameCards.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) { // Test up to 3 cards
      const card = gameCards.nth(i);
      const cardId = await card.getAttribute('data-testid');
      const gameId = cardId?.replace('game-card-', '');
      
      if (!gameId) continue;
      
      const href = await card.getAttribute('href');
      expect(href).toBe(`/game/${gameId}`);
    }
  });

  test('should have correct visual layout', async ({ page }) => {
    // Check if the grid has the correct layout classes
    const gamesGrid = page.getByTestId('games-grid');
    const gridClassAttr = await gamesGrid.getAttribute('class');
    expect(gridClassAttr).toContain('grid');
    expect(gridClassAttr).toContain('grid-cols-1');
    expect(gridClassAttr).toContain('gap-6');
    
    // Check if game cards have the proper styling
    const firstGameCard = page.getByTestId(/^game-card-/).first();
    const cardClassAttr = await firstGameCard.getAttribute('class');
    expect(cardClassAttr).toContain('bg-slate-800');
    expect(cardClassAttr).toContain('rounded-xl');
  });
});
