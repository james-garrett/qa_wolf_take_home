// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { chromium} from "playwright";
import { ERROR_MESSAGES } from "./errors.js";

export async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
 
  const isValid = valideDateOrder(page);
  // expect(isValid).toBeTruthy();
}

(async () => {
  await sortHackerNewsArticles();
})();

// should see if we can avoid passing page down through multiple functions?
async function validateDateBatch(n, page) {
  // maybe we run it once first
  const moreLink = await page.$$('.morelink');
  // Do we make this first section a method that we can run repeatedly inside the while loop?
  const dateList = await page.$$('.age');
  const batchSize = dateList.count();
  const total = batchSize;
  if (batchSize < n) {
    // while loop + promises a good idea??
    while (total < n) {
      moreLink.click();
        // click "More"
        // run function again
        // add batch checked to total
    }
    // if total > n
    // slice off elements until our total is just 100
    // then we can validate all elements and make sure that they're all in order (validateDateOrder function below?)
  }
}

export async function valideDateOrder(page) {
  // const dateList = await page.$$('.age >> a');
  const dateList = await page.$$('.age');
  if (!dateList || dateList.constructor != Array) {
    throw new Error(ERROR_MESSAGES.DATELIST_INVALID_DATA);
  }
  const dateStrings =await Promise.all(dateList
    .map(async dateItem => await dateItem.getAttribute('title')));

  const dateStringsAsDates = dateStrings.map(isoString => new Date(isoString.split(' ')[0])).slice(0, 100);
  var isDescending = dateArr => dateArr.slice(1).every((date, index) => date < dateArr[index]);
  var validateDatesAreDescending = isDescending(dateStringsAsDates);

  return validateDatesAreDescending;
}

async function validateDateBatch()

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
 * -account for varying batch sizes
 */
