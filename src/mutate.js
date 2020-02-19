#!/usr/bin/env node
var cheerio = require('cheerio');
var papaParse = require('papaparse');
var path = require('path');
var fs = require('fs');
var _a = require('./uriStore.js'), BASE_TRIP_URL = _a.BASE_TRIP_URL, STATEMENTS_URL = _a.STATEMENTS_URL, TRIP_HTML_DIR = _a.TRIP_HTML_DIR, CSV_DIR = _a.CSV_DIR, JSON_STATEMENT_DIR = _a.JSON_STATEMENT_DIR, JSON_PAGE_DATA_DIR = _a.JSON_PAGE_DATA_DIR, INCOMPLETE_TRIP_IDS = _a.INCOMPLETE_TRIP_IDS, JSON_MERGED_DIR = _a.JSON_MERGED_DIR;
var SELECTORS = require('./scraper/cssSelectors.js').SELECTORS;
(function buildCompleteTripRecord() {
    extractDownloadedPageData();
    combineExtractedAndCSVData();
    //showIncompleteTrips();
})();
function extractDownloadedPageData() {
    var htmlFilePaths = getFilePathsArray(TRIP_HTML_DIR);
    for (var _i = 0, htmlFilePaths_1 = htmlFilePaths; _i < htmlFilePaths_1.length; _i++) {
        var path_1 = htmlFilePaths_1[_i];
        var pageDataObject = extractPageDataSync(path_1);
        isFailedScrape(pageDataObject)
            ? handleFailedScrape(path_1)
            : handleSuccessfulScrape(path_1);
    }
}
function combineExtractedAndCSVData() {
    CSVsToJSONs();
    var statementFilePaths = getFilePathsArray(JSON_STATEMENT_DIR);
    for (var _i = 0, statementFilePaths_1 = statementFilePaths; _i < statementFilePaths_1.length; _i++) {
        var statementFilePath = statementFilePaths_1[_i];
        var tripIDs = getStatementTripIDs(statementFilePath);
        var statement = getJSON(statementFilePath);
        for (var _a = 0, tripIDs_1 = tripIDs; _a < tripIDs_1.length; _a++) {
            var id = tripIDs_1[_a];
            // need to find matching trip within statement
            var addlDataPath = getPageDataPathFromTripID(id, JSON_PAGE_DATA_DIR);
            var addlData = getJSON(addlDataPath);
            var tripIndex = getTripIndex(id, statement);
            statement[tripIndex] = mergeAddlDataIntoTrip(addlData, statement[tripIndex]);
        }
        var fileName = JSON_MERGED_DIR + ("" + path.basename(statementFilePath));
        fs.writeFileSync(fileName, JSON.stringify(statement, null, 4));
    }
}
function handleFailedScrape(htmlPath, savePath) {
    if (savePath === void 0) { savePath = INCOMPLETE_TRIP_IDS; }
    var tripID = getIDFromFilePath(htmlPath);
    var incompletes = getJSON(savePath);
    incompletes["tripIDs"].push(tripID);
    fs.writeFileSync(savePath, JSON.stringify(incompletes, null, 4));
}
function handleSuccessfulScrape(path, saveDirectory) {
    if (saveDirectory === void 0) { saveDirectory = JSON_PAGE_DATA_DIR; }
    var pageData = extractPageDataSync(path);
    var tripID = getIDFromFilePath(path);
    var savePath = saveDirectory + (tripID + ".json");
    fs.writeFileSync(savePath, JSON.stringify(pageData, null, 4));
}
//function showIncompleteTrips() {
//  console.log("Failed to Scrape tripIDs:\n", getIncompleteTrips());
//}
//function getIncompleteTrips() {
//  
//}
function getTripIndex(tripID, statement) {
    var tripIndex = -1;
    for (var i = 0; i < statement.length; i++) {
        if (statement[i]['Trip ID'] == tripID) {
            tripIndex = i;
            break;
        }
    }
    return tripIndex;
}
function mergeAddlDataIntoTrip(addlData, parentTrip) {
    for (var key in addlData) {
        parentTrip[key] = addlData[key];
    }
    return parentTrip;
}
function getPageDataPathFromTripID(tripID, dir) {
    var pageDataPaths = getFilePathsArray(dir);
    var matchingPath = '';
    for (var _i = 0, pageDataPaths_1 = pageDataPaths; _i < pageDataPaths_1.length; _i++) {
        var pageDataPath = pageDataPaths_1[_i];
        if (isMatch(tripID, pageDataPath)) {
            matchingPath = pageDataPath;
            break;
        }
    }
    return matchingPath;
}
//function isInStatement(tripID: string): boolean {
//  return true;
//}
function isMatch(tripID, pageDataPath) {
    var regex = new RegExp(tripID);
    var stringMatch = pageDataPath.match(regex);
    return stringMatch != null && stringMatch[0] != '';
}
function getFilePathsArray(directory) {
    var files = fs.readdirSync(directory);
    var paths = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var thisPath = path.join(directory, file);
        paths.push(thisPath);
    }
    return paths;
}
function extractPageDataSync(filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    var json = {};
    for (var selector in SELECTORS) {
        json[selector] = extractPageDataWithSelector(html, SELECTORS[selector]);
    }
    return json;
}
function isFailedScrape(json) {
    var keysCondition = Object.keys(json).length === 7;
    var valuesCondition = Object.values(json)
        .filter(function (value) { return value === ''; })
        .length == 7;
    return keysCondition && valuesCondition;
}
function extractPageDataWithSelector(html, selectors) {
    var $ = cheerio.load(html);
    var data = '';
    for (var _i = 0, selectors_1 = selectors; _i < selectors_1.length; _i++) {
        var selector = selectors_1[_i];
        data = $(selector).text();
        if (data != '')
            break;
    }
    return data;
}
function getIDFromFilePath(filePath) {
    var bySlash = filePath.split('/');
    var byPeriod = bySlash[bySlash.length - 1].split('.')[0];
    return byPeriod;
}
function CSVsToJSONs() {
    var csvFilePaths = getFilePathsArray(CSV_DIR);
    for (var _i = 0, csvFilePaths_1 = csvFilePaths; _i < csvFilePaths_1.length; _i++) {
        var csvFilePath = csvFilePaths_1[_i];
        saveCsvToJson(csvFilePath, getCsvJsonFilePath(csvFilePath));
    }
}
function saveCsvToJson(csvFilePath, saveLocation) {
    var csvFileNames = fs.readFileSync(csvFilePath, 'utf8');
    papaParse.parse(csvFileNames, {
        header: true,
        //dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results) { return (fs.writeFileSync(saveLocation, JSON.stringify(stripBom(results.data), null, 4))); }
    });
}
function stripBom(json) {
    for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
        var trip = json_1[_i];
        for (var _a = 0, _b = Object.keys(trip); _a < _b.length; _a++) {
            var key = _b[_a];
            if (key.charCodeAt(0) === 0xFEFF) {
                trip[key.slice(1)] = trip[key];
                delete trip[key];
            }
        }
    }
    return json;
}
function getCsvJsonFilePath(csvFilePath, saveDirectory) {
    if (saveDirectory === void 0) { saveDirectory = JSON_STATEMENT_DIR; }
    var splitPath = csvFilePath.split("/");
    var jsonPart = splitPath[splitPath.length - 1].split(".")[0] + ".json";
    return path.join(saveDirectory, jsonPart);
}
function getAllTripIDsArray() {
    var statementJSONs = getStatementJSONs();
    var tripIDs = [];
    // for some reason the first element is an empty array, so we skip
    for (var i = 1; i < statementJSONs.length; i++) {
        for (var _i = 0, _a = statementJSONs[i]; _i < _a.length; _i++) {
            var trip = _a[_i];
            tripIDs.push(trip['Trip ID']);
        }
    }
    return tripIDs;
}
function getStatementTripIDs(statementPath) {
    var statementJSON = getJSON(statementPath);
    var tripIDs = [];
    for (var _i = 0, statementJSON_1 = statementJSON; _i < statementJSON_1.length; _i++) {
        var trip = statementJSON_1[_i];
        tripIDs.push(trip['Trip ID']);
    }
    return tripIDs;
}
function getStatementJSONs() {
    var statementJSONs = getFilePathsArray(JSON_STATEMENT_DIR).map(function (filePath) { return (getJSON(filePath)); });
    return statementJSONs;
}
function getJSON(jsonPath) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}
module.exports = {
    CSVsToJSONs: CSVsToJSONs,
    getStatementJSONs: getStatementJSONs,
    getAllTripIDsArray: getAllTripIDsArray,
    mergeAddlDataIntoTrip: mergeAddlDataIntoTrip,
    getJSON: getJSON,
    getFilePathsArray: getFilePathsArray,
    isMatch: isMatch,
    getPageDataPathFromTripID: getPageDataPathFromTripID,
    getTripIndex: getTripIndex,
    extractPageDataSync: extractPageDataSync,
    isFailedScrape: isFailedScrape,
    //getIncompleteTrips,
    getIDFromFilePath: getIDFromFilePath,
    getStatementTripIDs: getStatementTripIDs,
    saveCsvToJson: saveCsvToJson,
    getCsvJsonFilePath: getCsvJsonFilePath,
    handleSuccessfulScrape: handleSuccessfulScrape,
    handleFailedScrape: handleFailedScrape,
    stripBom: stripBom
};
