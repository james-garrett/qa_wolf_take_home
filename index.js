// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium} = require("playwright");
const { ERROR_MESSAGES } = require ("./errors.js");
const { writeFileSync } = require('fs');
const path = require('path');
const CONFIG_VALUES = require("./constants.js");

// we should make a struct for browser/context/page so we can pass it between methods without 

export async function sortHackerNewsArticles() {
  // launch browser
  let browser = await chromium.launch({ headless: false });
  let context = await browser.newContext();
  let page = await context.newPage();
  // let sessionData = new SessionData(browser, context, page);

  // go to Hacker News
  await page.goto(CONFIG_VALUES.TARGET_URL);
 
  const isValid = await valideDateOrder(page, context);
  console.log(`Datelist is ascending: ${isValid}`);
  return isValid;
  // expect(isValid).toBeTruthy();
}

(async () => {
  await sortHackerNewsArticles();
})();

// should see if we can avoid passing page down through multiple functions?
export async function collectDateList(n, page, context) {
  try {
    let currentPage = page;
    // maybe we run it once first
    // Do we make this first section a method that we can run repeatedly inside the while loop?
    const dateList = new Array();
    // let moreLink = await page.locator(CONFIG_VALUES.MORELINK_ACCESSOR).getAttribute('href');
    // let dateBatch = await page.$$(CONFIG_VALUES.DATE_ACCESSOR);
    // let dateStringsBatch = await Promise.all(dateBatch
    //   .map(dateItem => dateItem.getAttribute('title'))
    //   .map(isoString => new Date(isoString.split(' ')[0])).slice(0, 100)
    // );
    // let batchSize = dateStringsBatch.length;
    // let total = batchSize;
    let [dateStringsAsISOdates, batchSize, moreLink, total] = await getNewDateBatch(page, 0);
    if (batchSize < n) {
      while (total < n) {
        dateList.push(...dateStringsAsISOdates);
        await Promise.all([
          currentPage.click(CONFIG_VALUES.MORELINK_ACCESSOR),
          // currentPage.waitForLoadState('load')
          currentPage.waitForURL(`**/${moreLink}`)
        ]);

        [dateStringsAsISOdates, batchSize, moreLink, total] = await getNewDateBatch(page, total);
        
        // This might be the repeatable part
          // moreLink = await page.locator(CONFIG_VALUES.MORELINK_ACCESSOR).getAttribute('href')
          // dateBatch = await currentPage.$$(CONFIG_VALUES.DATE_ACCESSOR);
          // total += dateStringsBatch.length;
        // }
      }
      
      dateList.push(...dateStringsAsISOdates.slice(0, dateStringsAsISOdates.length - (total - n)));
      
      // Definitely test this 
      if (dateList.length != n) {
        throw new Error(ERROR_MESSAGES.DATELIST_WRONG_SIZE);
      }
      
      return dateList;
      // then we can validate all elements and make sure that they're all in order (validateDateOrder function below?)
    }
  } catch (error) {
    throw new Error(error);
  }
}

// See if we can use this in collectDateList
async function getNewDateBatch(page, total) {
  let moreLink = await page.locator(CONFIG_VALUES.MORELINK_ACCESSOR).getAttribute('href');
  let dateBatch = await page.$$(CONFIG_VALUES.DATE_ACCESSOR);
  let dateStrings = await Promise.all(dateBatch
    .map(dateItem => dateItem.getAttribute('title'))
  );
  let dateStringsAsISOdates = dateStrings.map(isoString => new Date(isoString.split(' ')[0])).slice(0, 100);
  let batchSize = dateStringsAsISOdates.length;
  return [dateStringsAsISOdates, batchSize, moreLink, total + batchSize];
}

export async function valideDateOrder(page, context) {
  const dateList = await collectDateList(CONFIG_VALUES.DATELIST_COUNT_TOTAL, page, context);
  if (!dateList || dateList.constructor != Array) {
    throw new Error(ERROR_MESSAGES.DATELIST_INVALID_DATA);
  }

  // Definitely test these 3 lines
  var isDescending = dateArr => dateArr.slice(1).every((date, index) => date < dateArr[index]);
  var validateDatesAreDescending = isDescending(dateList);

  return validateDatesAreDescending;
}

export async function capturePage() {
  try {
    const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto(CONFIG_VALUES.TARGET_URL);
  const pageContent = await page.content();
  writeFileSync(path.join(__dirname, CONFIG_VALUES.MOCK_URL), pageContent);
  } catch (error) {
    console.log(`Error thrown: ${error}`);
    throw new Error(error);
  }
  return true;
}

class SessionData {
  constructor(browser, context, page) {
    this.browser = browser;
    this.context = context;
    this.page = page;
  }
}

/**
 * Age categories
 * [minute, minutes, hour, hours]
*/


/**
 * Process notes:
 * -I started by looking at the date class and saw it resembles an ISO datetime format
 * -I found the class and saw that the link string is the date in days/hours/months/years
 * --But I wanted to be thorough and make sure I could see every possible format
 * --I can see that the smallest unit of time is minutes
 * -Installed mocha to test validateDateOrder function with different edge cases
 */

/**
 * Tests todo:
 * -If date list is null
 * -Check that order of date strings in data is ordered correctly in all cases
 * -Check minute vs minutes, hour vs hour, month vs months, year vs years 
 *    -> ALWAYS should have shorter string first in array (e.g. minute not minutes )
 * -Items of same category should have numbers ordered asc
 * -edge case -> "0 minutes ago" will ALWAYS come first, and will come before "1 minute ago"
 * --nothing else will have a 0 in front
 * --Eventually I realized I could use the ISO dates instead of the date text because we have to assume the coding for the strings is consistent
 *    and it's just so much easier
 * -once I got it working for one batch: 
 *  -Get account for varying batch sizes
 * -Can't mock context and browser using vitest because we're using ModuleJS
 * -Switched over to Jest because I really wanted to ensure that we can test our methods locally without needing to access the website everytime and basiscally do an E2E test
 * -Couldn't get jest to work and I didn't want to spend too much time, I'm aware that this is an E2E test and that's not ideal
 * -Hopefully the scraped mock will be enough
 * -used constants to keep it modular and avoid magic strings 
*/
