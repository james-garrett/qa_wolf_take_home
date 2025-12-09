const { test, expect } = require('@playwright/test');
const ERROR_MESSAGES = require('../errors');
const TEST_DATA = require('../testData.js');
const {readFileSync} = require('fs');
const CONFIG_VALUES = require("../constants.js");
const jest = require('jest-mock');
// const {sortHackerNewsArticles, } = require('../index.js');
const { assignmentModule, sortHackerNewsArticles} = require('../index.js');

const mockLocator = {
  click: jest.fn()
};

const mockPage = {
  goto: jest.fn(),
  locator: jest.fn().mockReturnValue(mockLocator),
  waitForSelector: jest.fn(),
  evaluate: jest.fn()
};

// const mockCollectDateList = {
//   collectDateList: () => {}
// };

test('has title', async ({ page }) => {
  await page.goto(CONFIG_VALUES.TARGET_URL);

  await expect(page).toHaveTitle(CONFIG_VALUES.PAGE_TITLE);
});

test.describe('Sorting Hacker News Articles E2E', async () => {
  test('Hacker news is sorted correctly', async () => {
    expect(await sortHackerNewsArticles()).toEqual(true);
  });
});

test.describe('Valide Date Order', () => {
  test.beforeEach(() => {
    // mockCollectDateList.mockReset();
    jest.resetAllMocks();
    jest.spyOn(assignmentModule, 'collectDateList').mockImplementation(() => TEST_DATA.DATELIST);
  });

  test('the dateList is not null and Array type', async () => {
    // mock page
    // jest.spyOn(assignmentModule, 'collectDateList').mockReturnValue(TEST_DATA.DATELIST);
    const isValidDateOrder = await assignmentModule.validateDateOrder(mockPage);
    expect(isValidDateOrder).toBeTruthy();
    // expect(await sortHackerNewsArticles()).toEqual(true);
  });

  // test('the dateList is null and throws error', async () => {
    // expect(await sortHackerNewsArticles()).toEqual(true);
  // });
  
  // test('the dateList is not sorted correctly', async () => {
    // invert data list to be ascending
    // let testDataAsc = testdata.DATELIST.sort((dateA, dateB) => new Date(dateA) - new Date(dateB));
    
    // Set up interceptor for collectDateList 
    
    // expect(await assignmentModule.validateDateOrder(mockPage)).toEqual(true);
    // expect(await sortHackerNewsArticles()).toEqual(false);

    // randomize data list order

    // expect(await sortHackerNewsArticles()).toEqual(true);
  // });
  // test('the dateList does not have the required number of entries', async () => {
    // expect(await sortHackerNewsArticles()).toEqual(true);
  // });
}, 15000);

test.describe('Scrape page for mocking locally', () => {
  test('page downloads content without error', async () => {
    try {
      var result = await assignmentModule.capturePage();
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

/**
 * Testing TODO - test for false positives
 *              - maybe see if we can limit number of exported functions and do a lot more mocks?
 *              -- This could honestly be far too much effort  
 * */ 