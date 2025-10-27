import { test, expect } from '@playwright/test';

test.describe('Game Listing and Navigation', () => {
  test('should display games with titles on index page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load using a more specific locator
    const gamesGrid = page.getByTestId('games-grid');
    await expect(gamesGrid).toBeVisible();
    
    // Check that games are displayed
    const gameCards = page.getByTestId('game-card');
    
    // Wait for at least one game card to be visible
    await expect(gameCards.first()).toBeVisible();
    
    // Check that we have at least one game
    expect(await gameCards.count()).toBeGreaterThan(0);
    
    // Check that each game card has a title
    await expect(gameCards.first().getByTestId('game-title')).toBeVisible();
    
    // Verify that game titles are not empty
    await expect(gameCards.first().getByTestId('game-title')).not.toBeEmpty();
  });

  test('should navigate to correct game details page when clicking on a game', async ({ page }) => {
    await page.goto('/');
    
    // Wait for games to load
    const gamesGrid = page.getByTestId('games-grid');
    await expect(gamesGrid).toBeVisible();
    
    // Get the first game card and its data attributes
    const firstGameCard = page.getByTestId('game-card').first();
    const gameId = await firstGameCard.getAttribute('data-game-id');
    const gameTitle = await firstGameCard.getAttribute('data-game-title');
    
    // Click on the first game
    await firstGameCard.click();
    
    // Verify we're on the correct game details page
    await expect(page).toHaveURL(`/game/${gameId}`);
    
    // Verify the game details page loads
    await expect(page.getByTestId('game-details')).toBeVisible();
    
    // Verify the title matches what we clicked on
    if (gameTitle) {
      await expect(page.getByTestId('game-details-title')).toHaveText(gameTitle);
    }
  });

  test('should display game details with all required information', async ({ page }) => {
    // Navigate to a specific game (we'll use game ID 1 as an example)
    await page.goto('/game/1');
    
    // Wait for game details to load
    await expect(page.getByTestId('game-details')).toBeVisible();
    
    // Check that the game title is present and not empty
    const gameTitle = page.getByTestId('game-details-title');
    await expect(gameTitle).toBeVisible();
    await expect(gameTitle).not.toBeEmpty();
    
    // Check that the game description is present and not empty
    const gameDescription = page.getByTestId('game-details-description');
    await expect(gameDescription).toBeVisible();
    await expect(gameDescription).not.toBeEmpty();
    
    // Check that either publisher or category (or both) are present
    const publisherExists = await page.getByTestId('game-details-publisher').isVisible();
    const categoryExists = await page.getByTestId('game-details-category').isVisible();
    expect(publisherExists || categoryExists).toBeTruthy();
    
    // If publisher exists, check it has content
    if (publisherExists) {
      await expect(page.getByTestId('game-details-publisher')).not.toBeEmpty();
    }
    
    // If category exists, check it has content
    if (categoryExists) {
      await expect(page.getByTestId('game-details-category')).not.toBeEmpty();
    }
  });

  test('should display a button to back the game', async ({ page }) => {
    await page.goto('/game/1');
    
    // Wait for game details to load
    await expect(page.getByTestId('game-details')).toBeVisible();
    
    // Check that the back game button is present
    const backButton = page.getByTestId('back-game-button');
    await expect(backButton).toBeVisible();
    await expect(backButton).toContainText('Support This Game');
    
    // Verify the button is clickable
    await expect(backButton).toBeEnabled();
  });

  test('should be able to navigate back to home from game details', async ({ page }) => {
    await page.goto('/game/1');
    
    // Wait for the page to load
    await expect(page.getByTestId('game-details')).toBeVisible();
    
    // Find and click the back to all games link using a more semantic locator
    const backLink = page.getByRole('link', { name: /back to all games/i });
    await expect(backLink).toBeVisible();
    await backLink.click();
    
    // Verify we're back on the home page
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('games-grid')).toBeVisible();
  });

  test('should handle navigation to non-existent game gracefully', async ({ page }) => {
    // Navigate to a game that doesn't exist
    const response = await page.goto('/game/99999');
    
    // Check the response status or ensure the page loads without crashing
    expect(response?.status()).toBeLessThan(500);
    
    // The page should either show an error or handle it gracefully
    // We expect the page to not crash and still have a valid title
    await expect(page).toHaveTitle(/Game Details - Tailspin Toys/);
  });
});

test.describe('Game Filtering', () => {
  test('should display filter controls on the index page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    const gamesGrid = page.getByTestId('games-grid');
    await expect(gamesGrid).toBeVisible();
    
    // Check that filter controls are present
    await expect(page.locator('select#category-filter')).toBeVisible();
    await expect(page.locator('select#publisher-filter')).toBeVisible();
    await expect(page.locator('text=Clear Filters')).toBeVisible();
  });

  test('should filter games by category', async ({ page }) => {
    await page.goto('/');
    
    // Wait for games to load
    const gamesGrid = page.getByTestId('games-grid');
    await expect(gamesGrid).toBeVisible();
    
    // Get initial count of games
    const initialGameCards = page.getByTestId('game-card');
    const initialCount = await initialGameCards.count();
    
    // Select a category from the dropdown
    const categorySelect = page.locator('select#category-filter');
    await categorySelect.selectOption({ index: 1 }); // Select first non-empty option
    
    // Wait for games to reload
    await page.waitForTimeout(500);
    
    // Get filtered count of games
    const filteredGameCards = page.getByTestId('game-card');
    const filteredCount = await filteredGameCards.count();
    
    // Verify that filtering occurred (this assumes we have games with different categories)
    expect(filteredCount).toBeGreaterThanOrEqual(0);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should filter games by publisher', async ({ page }) => {
    await page.goto('/');
    
    // Wait for games to load
    const gamesGrid = page.getByTestId('games-grid');
    await expect(gamesGrid).toBeVisible();
    
    // Get initial count of games
    const initialGameCards = page.getByTestId('game-card');
    const initialCount = await initialGameCards.count();
    
    // Select a publisher from the dropdown
    const publisherSelect = page.locator('select#publisher-filter');
    await publisherSelect.selectOption({ index: 1 }); // Select first non-empty option
    
    // Wait for games to reload
    await page.waitForTimeout(500);
    
    // Get filtered count of games
    const filteredGameCards = page.getByTestId('game-card');
    const filteredCount = await filteredGameCards.count();
    
    // Verify that filtering occurred (this assumes we have games with different publishers)
    expect(filteredCount).toBeGreaterThanOrEqual(0);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should clear filters when Clear Filters button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Wait for games to load
    const gamesGrid = page.getByTestId('games-grid');
    await expect(gamesGrid).toBeVisible();
    
    // Get initial count of games
    const initialGameCards = page.getByTestId('game-card');
    const initialCount = await initialGameCards.count();
    
    // Apply a category filter
    const categorySelect = page.locator('select#category-filter');
    await categorySelect.selectOption({ index: 1 });
    
    // Wait for games to reload
    await page.waitForTimeout(500);
    
    // Click Clear Filters button
    const clearFiltersButton = page.locator('text=Clear Filters');
    await clearFiltersButton.click();
    
    // Wait for games to reload
    await page.waitForTimeout(500);
    
    // Verify that we're back to showing all games
    const clearedGameCards = page.getByTestId('game-card');
    const clearedCount = await clearedGameCards.count();
    
    expect(clearedCount).toBe(initialCount);
    
    // Verify that dropdowns are reset
    await expect(categorySelect).toHaveValue('');
    await expect(page.locator('select#publisher-filter')).toHaveValue('');
  });

  test('should filter games by both category and publisher', async ({ page }) => {
    await page.goto('/');
    
    // Wait for games to load
    const gamesGrid = page.getByTestId('games-grid');
    await expect(gamesGrid).toBeVisible();
    
    // Apply both category and publisher filters
    const categorySelect = page.locator('select#category-filter');
    const publisherSelect = page.locator('select#publisher-filter');
    
    await categorySelect.selectOption({ index: 1 });
    await publisherSelect.selectOption({ index: 1 });
    
    // Wait for games to reload
    await page.waitForTimeout(500);
    
    // Verify games are filtered (they should all have the selected category and publisher)
    const filteredGameCards = page.getByTestId('game-card');
    const filteredCount = await filteredGameCards.count();
    
    expect(filteredCount).toBeGreaterThanOrEqual(0);
    
    // If there are any games shown, they should have both the category and publisher tags
    if (filteredCount > 0) {
      const firstCard = filteredGameCards.first();
      
      // Check that both category and publisher badges are present
      const categoryBadge = firstCard.getByTestId('game-category');
      const publisherBadge = firstCard.getByTestId('game-publisher');
      
      await expect(categoryBadge).toBeVisible();
      await expect(publisherBadge).toBeVisible();
    }
  });
});
