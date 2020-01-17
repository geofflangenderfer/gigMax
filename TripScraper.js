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
} = require('./uriStore.js');
const { SELECTORS } = require('./selectors.js');


(async function main() {
  try {
    //const browser = await puppeteer.launch({
    //  headless: false,
    //  args: ['--disable-notifications']
    //});
    //const page = await getUserLoggedInPage(browser);

    //await downloadCSVs(page);
    //CSVsToJSONs();
    //await downloadTripPageHTML(page);
    //eventually, save only the data I need, which will reduce required storage
    //await extractDownloadedPageData(page);
    //combineCsvJsons();
    //extractDownloadedPageData();

    //await browser.close();

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
  return path.join(JSON_STATEMENT_DIR, jsonPart); 
}
async function downloadTripPageHTML(page) {
    // for each statement
    //   get trip urls
    //   for each url
    //    visit url
    //    extract pickup/dropoff time/location
    //    save it
  await setDownloadPath(page, TRIP_HTML_DIR);
  const tripIDs = getTripIDsArray();
  for (let id of tripIDs) {
    let url = BASE_TRIP_URL + id;
    await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});
    await page.waitFor(10 * 1000);
    let html = await page.content();
    fs.writeFileSync(TRIP_HTML_DIR + `${id}.html`, html);
  }
}
async function extractPageDataAsync(page) {
  
}
function extractDownloadedPageData() {
  let htmls = getFilePathsArray(TRIP_HTML_DIR);
  for (let html of htmls) {
    let pageDataObject = extractPageDataSync(html);
    if (isEmpty(pageDataObject)) { saveIncompletePageDataPath(html) };
    let tripID = getIDFromFilePath(html);
    let jsonFilePath = `${JSON_PAGE_DATA_DIR}/${tripID}.json`;
    fs.writeFileSync(jsonFilePath, JSON.stringify(pageDataObject, null, 4)) 
  }
}
function getIDFromFilePath(filePath) {
  let bySlash = filePath.split('/');
  let byPeriod = bySlash[bySlash.length-1].split('.')[0];
  return byPeriod;
}
function isEmpty(json) {
  let keysCondition = Object.keys(json).length == 7;
  let valuesCondition = Object.values(json)
    .filter(value => value == '')
    .length == 7;
  return keysCondition && valuesCondition;
}
function saveIncompletePageDataPath(filePath) {
  fs.appendFileSync(JSON_PAGE_DATA_DIR + '/incompleteFiles.csv', filePath);
}
function extractPageDataSync(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let json = {};
  for (selector in SELECTORS) {
    json[selector] = extractPageDataWithSelector(html, SELECTORS[ selector ]);
  }
  return json;
}
function extractPageDataWithSelector(html, selectors) {
  let $ = cheerio.load(html);
  let data = '';
  for (let selector of selectors) {
    data = $(selector).text();
    if (data != '') break;
  }
  return data;
}
function getTripIDsArray() {
  let statementJSONs = getStatementJSONs();
  let tripIDs = [];
  //console.log(statementJSONs[1][0]['Trip ID']);
  // for some reason the first element is an empty array, so we skip
  for (let i = 1; i < statementJSONs.length; i++) {
    for (let trip of statementJSONs[i]) {
      tripIDs.push(trip['Trip ID']);
    }
  }
  return tripIDs;
}
function getStatementJSONs() {
  let statementJSONs = getFilePathsArray(JSON_STATEMENT_DIR).map(filePath => (
    JSON.parse(fs.readFileSync(filePath, 'utf8'))
  ));
  return statementJSONs;
}
async function setDownloadPath(page, downloadPath) {
  await page._client.send(
    'Page.setDownloadBehavior', 
    {behavior: 'allow', downloadPath: downloadPath}
  );
}

module.exports = {
  getFilePathsArray,
};
