#!/usr/bin/env node

const puppeteer = require('puppeteer');
const papaParse = require('papaparse');
const path = require('path');
const fs = require('fs'); 

const STATEMENTS_URL = "https://drivers.uber.com/p3/payments/statements";
const TRIP_HTML_DIR = "./data.bak/raw/tripHTML";
const CSV_DIR = "./data.bak/raw/statementCSVs";
const JSON_DIR = './data.bak/intermediate/statementJSONs';

// scraper

(async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-notifications']
    });
    const page = await getUserLoggedInPage(browser);

    await downloadCSVs();
    CSVsToJSONs();
    //await downloadTripPageHTML(page);
    //combineCsvJsons();

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
async function downloadCSVs(page) {
  await page.goto(STATEMENTS_URL, {timeout: 0, waitUntil: 'networkidle0'});
  await clickDownloadCSVButtons(page);
}
async function clickDownloadCSVButtons(page) {
  await setDownloadPath(CSV_DIR);
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
function CSVsToJSONs() {
  const csvFilePaths = getFilePathsArray(CSV_DIR);
  for (let csvFilePath of csvFilePaths) {
    saveCsvToJson(csvFilePath);
  }
}
function getFilePathsArray(directory) {
  const files = fs.readdirSync(directory);
  let paths = [];
  for (let file of files) {
    let thisPath = path.join(directory, file);
    paths.push(thisPath);
  }
  return paths;
}
function saveCsvToJson(csvFilePath) {
  let csvFileNames = fs.readFileSync(csvFilePath, 'utf8');
  let jsonFilePath = csvFilePathToJsonFilePath(csvFilePath);
  papaParse.parse(csvFileNames, {
    header: true,
    //dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => ( 
      fs.writeFileSync(jsonFilePath, JSON.stringify(results.data, null, 4)) 
    )
  });
}
function csvFilePathToJsonFilePath(csvFilePath) {
  let splitPath = csvFilePath.split("/");
  let jsonPart = splitPath[splitPath.length - 1].split(".")[0] + ".json";
  return path.join(JSON_DIR, jsonPart); 
}
async function downloadTripPageHTML(page) {
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

