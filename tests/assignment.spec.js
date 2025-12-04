import { test, expect } from '@playwright/test';
import {capturePage, sortHackerNewsArticles} from '../index.js';
import { ERROR_MESSAGES } from '../errors';
import { readFileSync } from 'fs';
import { CONFIG_VALUES } from '../constants.js';

import { vi } from 'vitest';

const mockPage = {
  setContent: vi.fn(),
  locator: vi.fn(() => ({toHaveText: vi.fn()}))
};

const mockContext = {
  newPage: vi.fn(() => mockPage) 
}

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("mocks page", async ({page}) => {

});

test.describe('Sorting Hacker News Articles', () => {
test('the dateList is not null and Array type', async () => {
  expect(await sortHackerNewsArticles()).toEqual(true);
});
}, 15000);

test.describe('Scrape page for mocking locally', () => {
  test('page downloads content without error', async () => {
    try {
      var result = await capturePage();
    } catch (error) {
      throw error;
    }
    expect(result).toBeTruthy();
  });
  test('load mock HTML without error', async ({ page }) => {
    const webpage = readFileSync(CONFIG_VALUES.MOCK_URL, 'utf-8');
    await page.setContent(webpage);
    expect(await page.locator('div.hname:has(a:has-text("Hacker News"))'));
  });

  test('the dateList is not null and Array type', async () => {
    expect(await sortHackerNewsArticles()).toEqual(true);
  });
});