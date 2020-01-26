#!/usr/bin/env node

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const papaParse = require('papaparse');
const path = require('path');
const fs = require('fs'); 

const {
  BASE_TRIP_URL,
  STATEMENTS_URL,
  TRIP_HTML_DIR,
  CSV_DIR,
  JSON_STATEMENT_DIR,
  JSON_PAGE_DATA_DIR,
  INCOMPLETE_TRIP_HTML_FILE,
} = require('./uriStore.js');
const { SELECTORS } = require('./cssSelectors.js');
const {
  CSVsToJSONs,
  getStatementJSONs,
  getAllTripIDsArray
} = require('./etl.js');


(async function main() {
  //input is manual login by user
  //output is statementCSVs, and statement JSON files, {tripID}.html files
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-notifications']
    });
    const page = await getUserLoggedInPage(browser);

    await downloadCSVs(page);
    CSVsToJSONs();
    await downloadTripPageHTML(page);

    await browser.close();
  } catch(error) {
    console.error(error);
  }
})();
async function getUserLoggedInPage(browser) {
  const page = await browser.newPage();
  await page.goto('http://drivers.uber.com');
  //uber initially directs you to an auth.uber.com url. We arrive at 
  //drivers.uber.com after completing auth
  await page.waitForFunction(() => {
    const url = document.location.hostname;
    return url == "drivers.uber.com";
  }, {timeout: 0 });
  return page;
}
async function downloadCSVs(page) {
  await page.goto(STATEMENTS_URL, {timeout: 0, waitUntil: 'networkidle0'});
  await clickDownloadCSVButtons(page);
}
async function clickDownloadCSVButtons(page) {
  await setDownloadPath(page, CSV_DIR);
  let numTableRows = await page.evaluate(() => {
    return document.getElementsByTagName("table")[0].rows.length
  });
  //if (isUpToDate()) {
  //  console.log("Data is up to date!");
  //  return;
  //}
  // the 1st row is a table header, so we skip 0
  // https://csv.thephpleague.com/8.0/bom/ (I think this is another, unrelated error)
  for (let i = 1; i < numTableRows; i++) {
    let downloadCSVSelector = `#root > div > div > div > div > div:nth-child(2) > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5) > button`
    await page.click(downloadCSVSelector)
    await page.waitFor(10 * 1000);
  }
  await page.waitFor(30 * 1000);
}
async function setDownloadPath(page, downloadPath) {
  await page._client.send(
    'Page.setDownloadBehavior', 
    {behavior: 'allow', downloadPath: downloadPath}
  );
}
async function extractPageDataAsync(page) {
  // use css selectors while online/on page instead of offline merge
  // this will replace downloading html then merging parts offline
  // should reduce space needed, not sure about time
}
async function downloadTripPageHTML(page) {
    // for each statement
    //   get trip urls and add to queue
    //   while urls in queue
    //    visit url
    //    try to extract/save data, push url to back of queue if unsuccessful
  await setDownloadPath(page, TRIP_HTML_DIR);
  let tripIDs = getAllTripIDsArray();
  while (tripIDs) {
    let id = tripIDs.shift();
    let url = BASE_TRIP_URL + id;
    await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});
    await page.waitFor(10 * 1000);
    try {
      let html = await page.content();
      fs.writeFileSync(TRIP_HTML_DIR + `${id}.html`, html);
    } catch (e) {
      console.log(`${id} didn't load. Adding to the back of queue`);
      console.error(e);
      console.log("Here's what html looks like:\n", html);
      tripIDs.push(id);
    }
  }
}

//module.exports = {
//  TripScraper,
//};
