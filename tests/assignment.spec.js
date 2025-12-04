import { test, expect } from '@playwright/test';
import {sortHackerNewsArticles} from '../index.js';
// import { ERROR_MESSAGES } from '../errors';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test.describe('Sorting Hacker News Articles', () => {
test('the dateList is not null and Array type', async () => {
  expect(await sortHackerNewsArticles()).toEqual(true);
});
}, 15000);