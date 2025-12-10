const { test, expect } = require('@playwright/test');
const ERROR_MESSAGES = require('../errors');
const TEST_DATA = require('../testData.js');
const {readFileSync} = require('fs');
const CONFIG_VALUES = require("../constants.js");
const jest = require('jest-mock');
const { assignmentModule, sortHackerNewsArticles} = require('../index.js');

const mockLocator = {
  click: jest.fn(),
  getAttribute: jest.fn()
};

const mockPage = {
  goto: jest.fn(),
  locator: jest.fn().mockReturnValue(mockLocator),
  waitForSelector: jest.fn(),
  evaluate: jest.fn(),
  click: jest.fn(),
  waitForURL: jest.fn()
};

const testDatesDescending = TEST_DATA.DATELIST.map(isoString => new Date(isoString));
const testDatesAscending = [...testDatesDescending].sort((dateA, dateB) => dateA.getTime() - dateB.getTime());

/**
 * Fun shuffling program:
 * 1. puts each date into an object with a random number
 * 2. sorts items based on the random number for each date
 * 3. Destructures object to just get value
 */
const testDatesShuffled = testDatesDescending.map(value => ({value, sort: Math.random()}))
                                                .sort((dateA, dateB) => dateA.sort - dateB.sort)
                                                .map(({ value}) => value);

function generateTestBatches(array, batchSize) {
  const result = array.reduce((resultArray, item, index) => { 
    const chunkIndex = Math.floor(index/batchSize)

    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, []);
  return result;
}

function generateBatchGetMocks(testBatch) {
  let mockBatchResponses = [];
  for(let i = 0; i <= testBatch.length; i++) {
      mockBatchResponses.push(jest.spyOn(assignmentModule, 'getNewDateBatch').mockImplementationOnce(() => testBatch[i]));
    };
  return mockBatchResponses;
}

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
  test('succeeds when the dateList is not null and Array type', async () => {
    jest.spyOn(assignmentModule, 'collectDateList').mockImplementation(() => testDatesDescending);
    expect(await assignmentModule.validateDateOrder(mockPage)).toBeTruthy();
  });

  test('throws error when the dateList is null and throws error', async () => {
    jest.spyOn(assignmentModule, 'collectDateList').mockImplementation(() => null);
    expect(assignmentModule.validateDateOrder(mockPage)).rejects.toThrow(ERROR_MESSAGES.DATELIST_INVALID_DATA);
  });
  
  test('returns false when the dateList is ascending', async () => {
    jest.spyOn(assignmentModule, 'collectDateList').mockImplementation(() => testDatesAscending);
    expect(await assignmentModule.validateDateOrder(mockPage)).toBeFalsy();
  });

    test('returns false when the dateList contains inconsistencies in sorting', async () => {
    jest.spyOn(assignmentModule, 'collectDateList').mockImplementation(() => testDatesShuffled);
    expect(await assignmentModule.validateDateOrder(mockPage)).toBeFalsy();
  });
});

test.describe('collectDateList ', () => {
  test('succeeds when receiving the correct number of dates', async () => {

    let testBatch = generateTestBatches(TEST_DATA.DATELIST,30);
    generateBatchGetMocks(testBatch);

    const expected = TEST_DATA.DATELIST.slice(0, 100);
    const dateList = await assignmentModule.collectDateList(CONFIG_VALUES.DATELIST_COUNT_TOTAL, mockPage);
    expect(dateList).toEqual(expected);
  });

  test('throws when the dateList does not have the required number of entries', async () => {
    let testBatch = generateTestBatches(TEST_DATA.DATELIST.slice(0, 1), 30);
    generateBatchGetMocks(testBatch);
    expect(assignmentModule.collectDateList(CONFIG_VALUES.DATELIST_COUNT_TOTAL, mockPage)).rejects.toThrow(ERROR_MESSAGES.DATELIST_WRONG_SIZE);
  });
});
