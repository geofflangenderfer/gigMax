#!/usr/bin/env node

const mergeJSON = require('merge-json');
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
  INCOMPLETE_TRIP_IDS,
  JSON_MERGED_DIR,
} = require('./uriStore.js');
const { SELECTORS } = require('./cssSelectors.js');

(function buildCompleteTripRecord() {
  //populates intermediate/pageData/{tripID}.json with add'l data
  //extractDownloadedPageData();
  //combines intermediate/pageData/{tripID}.json 
  //and intermediate/statementsJSON/statements_{tripID}.json
  combineExtractedAndCSVData();
})();
function combineExtractedAndCSVData() {
  //for each statement
  //  load statement
  //  get tripIDS
  //  for each tripID
  //    load add'l page data
  //    for each add'l data point
  //      load into statement
  //  save statement
  let statementFilePaths = getFilePathsArray(JSON_STATEMENT_DIR);
  for (let path of statementFilePaths) {
    let statementJSON = getJSON(path);
    let tripIDs = getStatementTripIDs(path);
    let merged;
    for (let id of tripIDs) {
      let pageDataPath = getPageDataPathFromTripID(id);
      let pageDataJSON = getJSON(pageDataPath);
      let merged = mergeJSON.merge(pageDataJSON, statementJSON);
    }
    fs.writeFileSync(JSON_MERGED_DIR, merged);
  }
}
function getPageDataPathFromTripID(id) {
  let pageDataPaths = getFilePathsArray(JSON_PAGE_DATA_DIR); 
  let path = '';
  for (let onePath of pageDataPaths) {
    if (isMatch(id, onePath)) {
      path = pdPath;
      break;
    }
  }
  return path;
}
function isMatch(littleSpoon, bigSpoon) {
  let regex = new RegExp(littleSpoon);
  let stringMatch = bigSpoon.match(regex)[0];
  return stringMatch != "";
}
function extractDownloadedPageData() {
  let htmlFilePaths = getFilePathsArray(TRIP_HTML_DIR);
  for (let path of htmlFilePaths) {
    let pageDataObject = extractPageDataSync(path);
    if (isEmpty(pageDataObject)) { 
      fs.appendFileSync(INCOMPLETE_TRIP_IDS, path);
    }
    let tripID = getIDFromFilePath(path);
    let jsonFilePath = `${JSON_PAGE_DATA_DIR}/${tripID}.json`;
    fs.writeFileSync(jsonFilePath, JSON.stringify(pageDataObject, null, 4)) 
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
function extractPageDataSync(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let json = {};
  for (selector in SELECTORS) {
    json[selector] = extractPageDataWithSelector(html, SELECTORS[selector]);
  }
  return json;
}
function isEmpty(json) {
  let keysCondition = Object.keys(json).length == 7;
  let valuesCondition = Object.values(json)
    .filter(value => value == '')
    .length == 7;
  return keysCondition && valuesCondition;
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
function getIDFromFilePath(filePath) {
  let bySlash = filePath.split('/');
  let byPeriod = bySlash[bySlash.length-1].split('.')[0];
  return byPeriod;
}
function CSVsToJSONs() {
  const csvFilePaths = getFilePathsArray(CSV_DIR);
  for (let csvFilePath of csvFilePaths) {
    saveCsvToJson(csvFilePath);
  }
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
function getStatementTripIDs(statementPath) {
  let statementJSON = getJSON(statementPath);
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
function getJSON(jsonPath) {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

module.exports = {
  CSVsToJSONs,
  getStatementJSONs,
  getAllTripIDsArray,
};
