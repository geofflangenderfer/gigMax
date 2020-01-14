#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs'); 

const STATEMENTS_URL = "https://drivers.uber.com/p3/payments/statements";
const TRIP_HTML_DIR = "./data/raw/tripHTML";
const STATEMENT_CSV_DIR = "./data/raw/statementCSVs";

// scraper

(async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-notifications']
    });
    const page = await getUserLoggedInPage(browser);

    //await page.goto(STATEMENTS_URL, {timeout: 0, waitUntil: 'networkidle0'});
    //await clickDownloadCSVButtons(page);
    await saveTripHtmlContent(page, statement);

    await browser.close();

  } catch(error) {
    console.error(error);
  }
})();
async function getUserLoggedInPage(browser) {
  const page = await browser.newPage();
  await page.goto('http://partners.uber.com');
  //waits til user has manually logged in
  await page.waitForFunction(() => {
    const url = document.location.hostname;

    return url == "drivers.uber.com";
  }, 0);
  return page;
}
async function clickDownloadCSVButtons(page) {
  await setDownloadPath(STATEMENT_CSV_DIR);
  var numTableRows = await page.evaluate(() => {
    return document.getElementsByTagName("table")[0].rows.length
  });
  //if (isUpToDate()) {
  //  console.log("Data is up to date!");
  //  return;
  //}
  // the 1st row is a table header, so we skip 0
  for (var i = 1; i < numTableRows; i++) {
    var downloadCSVSelector = `#root > div > div > div > div > div:nth-child(2) > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5) > button`
    await page.click(downloadCSVSelector)
    await page.waitFor(10 * 1000);
  }
  await page.waitFor(30 * 1000);
}
async function saveTripHtmlContent(page) {
    // for each statement
    //   get trip urls
    //   for each url
    //    visit url
    //    download html content
  await setDownloadPath(TRIP_HTML_DIR);
  const statementJSONs = getStatementJSONs();
  for (let statementJSON of statementJSONs) {
    const tripUrls = getTripURLs(statementJSON);
    for (let url of tripUrls) {
      await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});
      var html = await page.content();
      fs.writeFileSync(`./data/raw/tripHTML/${url}.html`, html);
    }
  }
}

async function setDownloadPath(downloadPath) {
  await page._client.send(
    'Page.setDownloadBehavior', 
    {behavior: 'allow', downloadPath: downloadPath}
  );
}

// data-wrangling

