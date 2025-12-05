const { test, expect } = require('@playwright/test');
const { capturePage, sortHackerNewsArticles} = require('../index.js');
const ERROR_MESSAGES = require('../errors');
const {readFileSync} = require('fs');
const CONFIG_VALUES = require("../constants.js");


test('has title', async ({ page }) => {
  await page.goto(CONFIG_VALUES.TARGET_URL);

  await expect(page).toHaveTitle(CONFIG_VALUES.PAGE_TITLE);
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
});

// test.describe('Test using scraped page', () => {
  // test.beforeEach(async ({ page }) => {
  //   // Probably not necessary to wipe it to nothing first but JIC
  //   await page.setContent('');
  //   const webpage = readFileSync(CONFIG_VALUES.MOCK_URL, 'utf-8');
  //   await page.setContent(webpage);
  // });

//   test('the dateList is not null and Array type', async ({page}) => {
//     expect(await sortHackerNewsArticles()).toEqual(true);
//   });
// });

// Test TODO - 