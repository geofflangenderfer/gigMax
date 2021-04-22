#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;
// refactor to mutate.func_name() to reduce lines used here
var _a = require('../src/mutate.ts'), getJSON = _a.getJSON, mergeAddlDataIntoTrip = _a.mergeAddlDataIntoTrip, getFilePathsArray = _a.getFilePathsArray, isMatch = _a.isMatch, getTripIndex = _a.getTripIndex, getPageDataPathFromTripID = _a.getPageDataPathFromTripID, stripBom = _a.stripBom, saveCsvToJson = _a.saveCsvToJson, handleFailedScrape = _a.handleFailedScrape, handleSuccessfulScrape = _a.handleSuccessfulScrape, extractPageDataSync = _a.extractPageDataSync, getCsvJsonFilePath = _a.getCsvJsonFilePath, 
//getIncompleteTrips,
isFailedScrape = _a.isFailedScrape, getIDFromFilePath = _a.getIDFromFilePath, getStatementTripIDs = _a.getStatementTripIDs, CSVsToJSONs = _a.CSVsToJSONs;
var _b = require('../src/uriStore.js'), JSON_STATEMENT_DIR = _b.JSON_STATEMENT_DIR, INCOMPLETE_TRIP_IDS = _b.INCOMPLETE_TRIP_IDS, JSON_PAGE_DATA_DIR = _b.JSON_PAGE_DATA_DIR;
var INIT_TEST_STATEMENT = './mockData/merge/initial_statement.json';
var TEST_STATEMENT_NO_BOM = './mockData/merge/expected_statement.json';
var TEST_ADDL_DATA = './mockData/merge/36fafc62-bfed-46db-b4b0-ce3f3fc7427e.json';
var TEST_STATEMENT_EXPECTED = './mockData/merge/mergedTripExpected.js';
var chai_1 = require("chai");
require("mocha");
describe('mergeAddlDataIntoTrip', function () {
    it('should add additional fields to a trip object', function () {
        var statement = stripBom(getJSON(INIT_TEST_STATEMENT));
        var tripID = '36fafc62-bfed-46db-b4b0-ce3f3fc7427e';
        var tripIndex = getTripIndex(tripID, statement);
        var addlData = getJSON(TEST_ADDL_DATA);
        var mergedTripExpected = require(TEST_STATEMENT_EXPECTED).mergedTripExpected;
        var mergedTripActual = mergeAddlDataIntoTrip(addlData, statement[tripIndex]);
        chai_1.expect(mergedTripActual).to.deep.equal(mergedTripExpected);
    });
});
describe('getTripIndex', function () {
    var statement = getJSON(INIT_TEST_STATEMENT);
    var tripID = '36fafc62-bfed-46db-b4b0-ce3f3fc7427e';
    it('should return the array index for the associated trip id', function () {
        var expected = 0;
        var actual = getTripIndex(tripID, statement);
        chai_1.expect(actual).to.equal(expected);
    });
});
describe('getPageDataPathFromTripID', function () {
    var tripID = '0f00bace-ca58-4e03-9296-8e07549deb9e';
    var dir = './mockData/pageData/'; //'./mockData/pageData/';
    it('should return the absolute path from a valid tripID', function () {
        var pageDataPath = getPageDataPathFromTripID(tripID, dir);
        var expectedPath = dir + tripID + '.json';
        chai_1.expect(pageDataPath).to.equal(expectedPath);
    });
    //it('should return "" when tripID is "" or not present in data directory', () => {
    //});
});
describe('isMatch', function () {
    var tripID = '57ced820-2b0b-4d0b-8c2a-e6ac7c0a6301';
    var pageDataPath = '/home/geoff/work/gigMax/data/intermediate/pageData/57ced820-2b0b-4d0b-8c2a-e6ac7c0a6301.json';
    it('should return true when tripID in pageDataPath', function () {
        var check = isMatch(tripID, pageDataPath);
        chai_1.expect(check).to.equal(true);
    });
    it('should return false when pageDataPath tripID != tripID', function () {
        var differentTripID = '36fafc62-bfed-46db-b4b0-ce3f3fc7427e.json';
        var check = isMatch(differentTripID, pageDataPath);
        chai_1.expect(check).to.equal(false);
    });
    it('should return false when tripID equals ""', function () {
        var emptyTripID = '';
        var check = isMatch(emptyTripID, pageDataPath);
        chai_1.expect(check).to.equal(false);
    });
});
describe('getFilePathsArray', function () {
    var dir = './mockData/pageData';
    it('should return absolute filepaths with valid input', function () {
        var returnedPaths = getFilePathsArray(dir);
        for (var _i = 0, returnedPaths_1 = returnedPaths; _i < returnedPaths_1.length; _i++) {
            var filePath = returnedPaths_1[_i];
            var dirname = path.dirname(filePath);
            chai_1.expect(dirname).to.equal(dir);
        }
        ;
    });
    it('should return paths for all files in a directory', function () {
        // 52 files in dummy directory
        var returnedPaths = getFilePathsArray(dir);
        chai_1.expect(returnedPaths.length).to.equal(52);
    });
});
describe('stripBom', function () {
    it('should return trips after stripping BOM', function () {
        chai_1.expect(stripBom(getJSON(INIT_TEST_STATEMENT))).to.deep.equal(getJSON(TEST_STATEMENT_NO_BOM));
    });
});
describe('extractPageDataSync', function () {
    it('should take .html file path and return json with extracted data', function () {
        var htmlPath = './mockData/extractPageDataSync_mock/00a326bd-1806-4292-a8f9-d295ba2bd9b9.html';
        var expectedJsonPath = './mockData/extractPageDataSync_mock/result.json';
        chai_1.expect(extractPageDataSync(htmlPath)).to.deep.equal(getJSON(expectedJsonPath));
    });
});
describe('isFailedScrape', function () {
    var failedJsonPath = './mockData/isFailedScrape_mock/failed.json';
    var successfulJsonPath = './mockData/isFailedScrape_mock/successful.json';
    var failedJson = getJSON(failedJsonPath);
    var successfulJson = getJSON(successfulJsonPath);
    it("should identify successful scrape", function () {
        chai_1.expect(isFailedScrape(successfulJson)).to.equal(false);
    });
    it("should identify failed scrape as an object with 7 blank values", function () {
        chai_1.expect(isFailedScrape(failedJson)).to.equal(true);
    });
});
describe('getIDFromFilePath', function () {
    var htmlPath = './mockData/getIDFromFilePath/00a326bd-1806-4292-a8f9-d295ba2bd9b9.html0';
    var tripID = '00a326bd-1806-4292-a8f9-d295ba2bd9b9';
    it('should return a tripID associated with a html file path', function () {
        chai_1.expect(getIDFromFilePath(htmlPath)).to.equal(tripID);
    });
});
describe('getStatementTripIDs', function () {
    var statementPath = './mockData/getStatementTripIDs/statement_27858537-a9aa-5346-ae05-5f8e1a9ad6c2_date_10_28_2019.json';
    var expectedTripIDs = require('./mockData/getStatementTripIDs/tripIDs.js').expectedTripIDs;
    it('should return the tripIDs for a given statement json path', function () {
        chai_1.expect(getStatementTripIDs(statementPath)).to.deep.equal(expectedTripIDs);
    });
});
describe('getJSON', function () {
    it('should take a string path and return an array of trip objects', function () {
        var json = getJSON(INIT_TEST_STATEMENT);
        chai_1.expect(json instanceof Array).to.equal(true);
        for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
            var trip = json_1[_i];
            chai_1.expect(trip instanceof Object).to.equal(true);
        }
    });
});
describe('saveCsvToJson', function () {
    saveCsvToJson;
    var csvFilePath = './mockData/saveCsvToJson/test_statement.csv';
    it('should take a csv file, convert it to json, and write it to disk', function () {
        var saveLocation = './mockData/saveCsvToJson/test_statement.json';
        saveCsvToJson(csvFilePath, saveLocation);
        var json = getJSON(saveLocation);
        chai_1.expect(json instanceof Object).to.equal(true);
        chai_1.expect(Object.keys(json).length).to.equal(7);
        chai_1.expect(json.length).to.equal(7);
        execSync("rm " + saveLocation, { encoding: 'utf-8' });
    });
});
describe('handleFailedScrape', function () {
    var incompleteTripsPath_init = './mockData/handleFailedScrape/incompleteTripIDs_init.json';
    var incompleteTripsPath_actual = './mockData/handleFailedScrape/incompleteTripIDs_actual.json';
    var incompleteTripsPath_expected = './mockData/handleFailedScrape/incompleteTripIDs_expected.json';
    var failedTripPath = '/home/geoff/work/gigMax/data/raw/tripHTML/00a326bd-1806-4292-a8f9-d295ba2bd9b9.html';
    it('should update the incomplete tripIDs store with new ID', function () {
        handleFailedScrape(failedTripPath, incompleteTripsPath_actual);
        //let incompleteTripIDs: object = getJSON(incompleteTripsPath_before);
        //let failedTripID: string = getIDFromFilePath(failedTripPath);
        //incompleteTripIDs["tripIDs"].push(failedTripID);
        var actual = getJSON(incompleteTripsPath_actual);
        var expected = getJSON(incompleteTripsPath_expected);
        chai_1.expect(actual).to.deep.equal(expected);
        //teardown
        execSync("rm " + incompleteTripsPath_actual, { encoding: 'utf-8' });
        fs.writeFileSync(incompleteTripsPath_actual, JSON.stringify({ "tripIDs": [] }, null, 4));
        //extract tripID from failedTripPath
        //load incompleteTripIDs json
        //add extracted tripID to incompleteTripIDs object
        //save updated object to savePath (incompleteTripIDs.json default)
    });
});
describe('handleSuccessfulScrape', function () {
    it('should take a page data object and save it as JSON in page data directory', function () {
        //call handleSuccessfulScrape
        //check that contents of saved json file match expectation
        var actualFilePath = './mockData/handleSuccessfulScrape/00a326bd-1806-4292-a8f9-d295ba2bd9b9.json';
        var expectedFilePath = './mockData/handleSuccessfulScrape/expected.json';
        var testHtmlPath = './mockData/handleSuccessfulScrape/00a326bd-1806-4292-a8f9-d295ba2bd9b9.html';
        var actualFilePathDir = './mockData/handleSuccessfulScrape/';
        handleSuccessfulScrape(testHtmlPath, actualFilePathDir);
        var actual = getJSON(actualFilePath);
        var expected = getJSON(expectedFilePath);
        chai_1.expect(actual).to.deep.equal(expected);
        execSync("rm " + actualFilePath, { encoding: 'utf-8' });
    });
});
describe('getCsvJsonFilePath', function () {
    it('should take a csv file path and return the path to json directory save location', function () {
        var testCsvPath = './mockData/getCsvJsonFilePath/statement_0d8685db-1640-5a11-9691-68b3363cac12_date_12_16_2019.csv';
        var saveDir = './mockData/getCsvJsonFilePath/';
        var actual = getCsvJsonFilePath(testCsvPath, saveDir);
        var expected = testCsvPath.split(".")[0] + ".json";
        chai_1.expect(actual).to.equal(expected);
    });
});
//describe('isInStatement', () => {
//  it('should return true if tripID is in statement', () => {
//  });
//  it('should return false if tripID is not in statement', () => {
//  });
//});
//describe('getIncompleteTrips', () => {
//  it('should return a string[] of incomplete tripIDs', () => {
//    let expected = fs.readFileSync( INCOMPLETE_TRIP_IDS, 'utf8')
//  });
//});
//describe('', () => {
//  it('', () => {
//  });
//});
