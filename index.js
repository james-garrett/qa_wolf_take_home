// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { chromium} from "playwright";
import { ERROR_MESSAGES } from "./errors.js";
import { writeFileSync } from 'fs';
import * as path from 'path';
import { CONFIG_VALUES } from "./constants.js";

export async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto(CONFIG_VALUES.TARGET_URL);
 
  const isValid = valideDateOrder(page);
  console.log(`Datelist is ascending: ${isValid}`);
  return isValid;
  // expect(isValid).toBeTruthy();
}

// (async () => {
//   await sortHackerNewsArticles();
// })();

// should see if we can avoid passing page down through multiple functions?
export async function collectDateList(n, page) {
  // maybe we run it once first
  const moreLink = await page.locator(CONFIG_VALUES.DATE_ACCESSOR);
  // Do we make this first section a method that we can run repeatedly inside the while loop?
  const dateList = new Array();
  let dateBatch = await page.$$(CONFIG_VALUES.DATE_ACCESSOR);
  let batchSize = dateBatch.count();
  const total = batchSize;
  if (batchSize < n) {
    // while loop + promises a good idea??
    while (total < n) {
      dateList.push(dateBatch);
      moreLink.click();
      dateBatch = await page.$$(CONFIG_VALUES.DATE_ACCESSOR);
    }
    
    dateBatch.slice(0, total - 100);
    dateList.push(dateBatch);
    
    // Definitely test this 
    if (dateList.lenth() != total) {
      throw new Error(ERROR_MESSAGES.DATELIST_WRONG_SIZE);
    }

    return dateList;
    // then we can validate all elements and make sure that they're all in order (validateDateOrder function below?)
  }
}

// See if we can use this in collectDateList
async function getNewDateBatch(page) {

}

export async function valideDateOrder(page) {
  const dateList = collectDateList(CONFIG_VALUES.DATELIST_COUNT_TOTAL, page);
  if (!dateList || dateList.constructor != Array) {
    throw new Error(ERROR_MESSAGES.DATELIST_INVALID_DATA);
  }
  const dateStrings =await Promise.all(dateList
    .map(async dateItem => await dateItem.getAttribute('title')));

  // Definitely test these 3 lines
  const dateStringsAsDates = dateStrings.map(isoString => new Date(isoString.split(' ')[0])).slice(0, 100);
  var isDescending = dateArr => dateArr.slice(1).every((date, index) => date < dateArr[index]);
  var validateDatesAreDescending = isDescending(dateStringsAsDates);

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
 */
