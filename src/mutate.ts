#!/usr/bin/env node

const cheerio = require('cheerio');
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
  INCOMPLETE_TRIP_IDS,
  JSON_MERGED_DIR,
} = require('./uriStore.js');
const { SELECTORS } = require('./scraper/cssSelectors.js');

(function buildCompleteTripRecord() {
  //extractDownloadedPageData();
  //combineExtractedAndCSVData();
  //showIncompleteTrips();
})();
function extractDownloadedPageData() {
  let htmlFilePaths: string[] = getFilePathsArray(TRIP_HTML_DIR);
  for (let path of htmlFilePaths) {
    let pageDataObject: object = extractPageDataSync(path);
    if (isFailedScrape(pageDataObject)) { 
      fs.appendFileSync(INCOMPLETE_TRIP_IDS, path);
      continue;
    }
    let tripID: string = getIDFromFilePath(path);
    let jsonFilePath = `${JSON_PAGE_DATA_DIR}/${tripID}.json`;
    fs.writeFileSync(jsonFilePath, JSON.stringify(pageDataObject, null, 4)) 
  }
}
function combineExtractedAndCSVData() {
  CSVsToJSONs();
  let statementFilePaths: string[] = getFilePathsArray(JSON_STATEMENT_DIR);
  for (let statementFilePath of statementFilePaths) {
    let tripIDs: string[] = getStatementTripIDs(statementFilePath);
    let statement: object[] = getJSON(statementFilePath);
    for (let id of tripIDs) {
      // need to find matching trip within statement
      let addlDataPath: string = getPageDataPathFromTripID(id, JSON_PAGE_DATA_DIR);
      let addlData: object = getJSON(addlDataPath); 
      let tripIndex: number = getTripIndex(id, statement);
      statement[tripIndex] = mergeAddlDataIntoTrip(addlData, statement[tripIndex]);
    }
    let fileName: string = JSON_MERGED_DIR + `${path.basename(statementFilePath)}`;
    fs.writeFileSync(fileName, JSON.stringify(statement, null, 4));
  }
}
function showIncompleteTrips() {
  console.log("Failed to Scrape tripIDs:\n", getIncompleteTrips());
}
function getIncompleteTrips() {
  
}
function getTripIndex(tripID: string, statement: object[]): number {
  let tripIndex = -1;
  for (let i = 0; i < statement.length ; i++) {
    if (statement[i]['Trip ID'] == tripID) {
      tripIndex = i;
      break;
    }
  }
  return tripIndex;
}
function mergeAddlDataIntoTrip(addlData: object, parentTrip: object ): object {
  for (let key in addlData) {
    parentTrip[key] = addlData[key];
  }
  return parentTrip;
}
function getPageDataPathFromTripID(tripID: string, dir: string): string {
  let pageDataPaths = getFilePathsArray(dir); 
  let matchingPath = '';
  for (let pageDataPath of pageDataPaths) {
    if (isMatch(tripID, pageDataPath)) {
      matchingPath = pageDataPath;
      break;
    }
  }
  return matchingPath;
}
function isInStatement(tripID: string): boolean {
  return true;
}
function isMatch(tripID: string, pageDataPath: string): boolean {
  let regex = new RegExp(tripID);
  let stringMatch = pageDataPath.match(regex);
  return stringMatch != null && stringMatch[0] != '';
}
function getFilePathsArray(directory: string): string[] {
  const files = fs.readdirSync(directory);
  let paths = [];
  for (let file of files) {
    let thisPath = path.join(directory, file);
    paths.push(thisPath);
  }
  return paths;
}
function extractPageDataSync(filePath: string): object {
  let html = fs.readFileSync(filePath, 'utf8');
  let json = {};
  for (let selector in SELECTORS) {
    json[selector] = extractPageDataWithSelector(html, SELECTORS[selector]);
  }
  return json;
}
function isFailedScrape(json: object): boolean  {
  let keysCondition: boolean = Object.keys(json).length == 7;
  let valuesCondition: boolean = Object.values(json)
    .filter(value => value === '')
    .length == 7;
  return keysCondition && valuesCondition;
}
function extractPageDataWithSelector(html: string, selectors: string[]): string {
  let $ = cheerio.load(html);
  let data = '';
  for (let selector of selectors) {
    data = $(selector).text();
    if (data != '') break;
  }
  return data;
}
function getIDFromFilePath(filePath: string): string {
  let bySlash = filePath.split('/');
  let byPeriod = bySlash[bySlash.length-1].split('.')[0];
  return byPeriod;
}

function CSVsToJSONs(): void {
  const csvFilePaths = getFilePathsArray(CSV_DIR);
  for (let csvFilePath of csvFilePaths) {
    saveCsvToJson(
      csvFilePath, 
      csvFilePathToJsonFilePath(csvFilePath)
    );
  }
}
function saveCsvToJson(csvFilePath: string, saveLocation: string): void {
  let csvFileNames = fs.readFileSync(csvFilePath, 'utf8');
  papaParse.parse(csvFileNames, {
    header: true,
    //dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => ( 
      fs.writeFileSync(
        saveLocation,
        JSON.stringify(stripBom(results.data), null, 4)
      ) 
    )
  });
}
function stripBom(json: object[]): object[] {
  for (let trip of json) {
    for (let key of Object.keys(trip)) {
      if (key.charCodeAt(0) === 0xFEFF) {
        trip[key.slice(1)] = trip[key];
        delete trip[key];
      }
    }  
  }
  return json;
}
function csvFilePathToJsonFilePath(csvFilePath: string): string {
  let splitPath = csvFilePath.split("/");
  let jsonPart = splitPath[splitPath.length - 1].split(".")[0] + ".json";
  return path.join(JSON_STATEMENT_DIR, jsonPart); 
}
function getAllTripIDsArray() {
  let statementJSONs = getStatementJSONs();
  let tripIDs = [];
  // for some reason the first element is an empty array, so we skip
  for (let i = 1; i < statementJSONs.length; i++) {
    for (let trip of statementJSONs[i]) {
      tripIDs.push(trip['Trip ID']);
    }
  }
  return tripIDs;
}
function getStatementTripIDs(statementPath: string): string[] {
  let statementJSON: object[] = getJSON(statementPath);
  let tripIDs = [];
  for (let trip of statementJSON) {
    tripIDs.push(trip['Trip ID']);
  }
  return tripIDs;
}
function getStatementJSONs() {
  let statementJSONs = getFilePathsArray(JSON_STATEMENT_DIR).map(filePath => (
    getJSON(filePath)
  ));
  return statementJSONs;
}
function getJSON(jsonPath: string): object[] {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

module.exports = {
  CSVsToJSONs,
  getStatementJSONs,
  getAllTripIDsArray,
  mergeAddlDataIntoTrip,
  getJSON,
  getFilePathsArray,
  isMatch,
  getPageDataPathFromTripID,
  getTripIndex,
  extractPageDataSync,
  isFailedScrape,
  getIncompleteTrips,
  getIDFromFilePath,
  getStatementTripIDs,
  saveCsvToJson,
  csvFilePathToJsonFilePath,
  stripBom,
};


