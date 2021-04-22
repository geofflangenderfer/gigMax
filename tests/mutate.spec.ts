#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
// refactor to mutate.func_name() to reduce lines used here
const { 
  getJSON, 
  mergeAddlDataIntoTrip,
  getFilePathsArray,
  isMatch,
  getTripIndex,
  getPageDataPathFromTripID,
  stripBom,
  saveCsvToJson,
  handleFailedScrape,
  handleSuccessfulScrape,
  extractPageDataSync, 
  getCsvJsonFilePath,
  //getIncompleteTrips,
  isFailedScrape, 
  getIDFromFilePath, 
  getStatementTripIDs,
  CSVsToJSONs,
} = require('../src/mutate.ts');
const { 
  JSON_STATEMENT_DIR,
  INCOMPLETE_TRIP_IDS,
  JSON_PAGE_DATA_DIR
} = require('../src/uriStore.js');

const INIT_TEST_STATEMENT = './mockData/merge/initial_statement.json';
const TEST_STATEMENT_NO_BOM = './mockData/merge/expected_statement.json';
const TEST_ADDL_DATA = './mockData/merge/36fafc62-bfed-46db-b4b0-ce3f3fc7427e.json';
const TEST_STATEMENT_EXPECTED = './mockData/merge/mergedTripExpected.js';

import { expect } from 'chai';
import 'mocha';

describe('mergeAddlDataIntoTrip', () => {
  it('should add additional fields to a trip object', () => {
    let statement: object[] = stripBom(getJSON( INIT_TEST_STATEMENT ));
    let tripID = '36fafc62-bfed-46db-b4b0-ce3f3fc7427e';
    let tripIndex: number = getTripIndex(tripID, statement);
    let addlData: object = getJSON(TEST_ADDL_DATA);
    let { mergedTripExpected } = require(TEST_STATEMENT_EXPECTED);

    let mergedTripActual = mergeAddlDataIntoTrip(addlData, statement[tripIndex]);
    expect(mergedTripActual).to.deep.equal(mergedTripExpected);
  });
});

describe('getTripIndex', () => {
  let statement: object[] = getJSON(INIT_TEST_STATEMENT);
  let tripID = '36fafc62-bfed-46db-b4b0-ce3f3fc7427e';
  it('should return the array index for the associated trip id', () => {
    let expected = 0;
    let actual = getTripIndex(tripID, statement);
    expect(actual).to.equal(expected);
  });
});
describe('getPageDataPathFromTripID', () => {
  let tripID = '0f00bace-ca58-4e03-9296-8e07549deb9e';
  let dir = './mockData/pageData/';//'./mockData/pageData/';
  it('should return the absolute path from a valid tripID', () => {
    let pageDataPath = getPageDataPathFromTripID(tripID, dir);
    let expectedPath = dir + tripID + '.json';
    expect(pageDataPath).to.equal(expectedPath);
  });
  //it('should return "" when tripID is "" or not present in data directory', () => {
  //});
});
describe('isMatch', () => {
  let tripID = '57ced820-2b0b-4d0b-8c2a-e6ac7c0a6301';
  let pageDataPath = '/home/geoff/work/gigMax/data/intermediate/pageData/57ced820-2b0b-4d0b-8c2a-e6ac7c0a6301.json';

  it('should return true when tripID in pageDataPath', () => {
    let check: boolean = isMatch(tripID, pageDataPath); 
    expect(check).to.equal(true);
  });
  it('should return false when pageDataPath tripID != tripID', () => {
    let differentTripID = '36fafc62-bfed-46db-b4b0-ce3f3fc7427e.json';
    let check: boolean = isMatch(differentTripID, pageDataPath); 
    expect(check).to.equal(false);
  });
  it('should return false when tripID equals ""', () => {
    let emptyTripID = '';
    let check: boolean = isMatch(emptyTripID, pageDataPath); 
    expect(check).to.equal(false);
  });
});
describe('getFilePathsArray', () => {
  let dir = './mockData/pageData';
  it('should return absolute filepaths with valid input', () => {
    let returnedPaths: string[] = getFilePathsArray(dir)
    for (let filePath of returnedPaths) {
      let dirname = path.dirname(filePath);
      expect(dirname).to.equal(dir);
    };
  });
  it('should return paths for all files in a directory', () => {
    // 52 files in dummy directory
    let returnedPaths: string[] = getFilePathsArray(dir)
    expect(returnedPaths.length).to.equal(52);
  });
});
describe('stripBom', () => {
  it('should return trips after stripping BOM', () => {
    expect(stripBom(getJSON(INIT_TEST_STATEMENT))).to.deep.equal(getJSON(TEST_STATEMENT_NO_BOM))
  });
});
describe('extractPageDataSync', () => {
  it('should take .html file path and return json with extracted data', () => {
    let htmlPath = './mockData/extractPageDataSync_mock/00a326bd-1806-4292-a8f9-d295ba2bd9b9.html';
    let expectedJsonPath = './mockData/extractPageDataSync_mock/result.json';
    expect(extractPageDataSync(htmlPath)).to.deep.equal(getJSON(expectedJsonPath));
  });
});
describe('isFailedScrape', () => {
  let failedJsonPath = './mockData/isFailedScrape_mock/failed.json';
  let successfulJsonPath = './mockData/isFailedScrape_mock/successful.json';
  let failedJson = getJSON(failedJsonPath);
  let successfulJson = getJSON(successfulJsonPath);

  it("should identify successful scrape", () => {
    expect(isFailedScrape(successfulJson)).to.equal(false);
  });
  it("should identify failed scrape as an object with 7 blank values", () => {
    expect(isFailedScrape(failedJson)).to.equal(true);
  });
});
describe('getIDFromFilePath', () => {
  let htmlPath = './mockData/getIDFromFilePath/00a326bd-1806-4292-a8f9-d295ba2bd9b9.html0';
  let tripID = '00a326bd-1806-4292-a8f9-d295ba2bd9b9';
  it('should return a tripID associated with a html file path', () => {
    expect(getIDFromFilePath(htmlPath)).to.equal(tripID);
  });
});
describe('getStatementTripIDs', () => {
  let statementPath = './mockData/getStatementTripIDs/statement_27858537-a9aa-5346-ae05-5f8e1a9ad6c2_date_10_28_2019.json';
  const { expectedTripIDs } = require('./mockData/getStatementTripIDs/tripIDs.js');
  it('should return the tripIDs for a given statement json path', () => {
    expect(getStatementTripIDs(statementPath)).to.deep.equal(expectedTripIDs);
  });
});
describe('getJSON', () => {
  it('should take a string path and return an array of trip objects', () => {
    let json: object[] = getJSON(INIT_TEST_STATEMENT);
    expect(json instanceof Array).to.equal(true);
    for (let trip of json) {
      expect(trip instanceof Object).to.equal(true);
    }
  });
});
describe('saveCsvToJson', () => {
saveCsvToJson
  let csvFilePath = './mockData/saveCsvToJson/test_statement.csv'

  it('should take a csv file, convert it to json, and write it to disk', () => {
    let saveLocation = './mockData/saveCsvToJson/test_statement.json';

    saveCsvToJson(csvFilePath, saveLocation);
    let json = getJSON(saveLocation);

    expect(json instanceof Object).to.equal(true);
    expect(Object.keys(json).length).to.equal(7);
    expect(json.length).to.equal(7);

    execSync(`rm ${saveLocation}`, { encoding: 'utf-8' });

  });
});
describe('handleFailedScrape', () => {
  let incompleteTripsPath_init = './mockData/handleFailedScrape/incompleteTripIDs_init.json';
  let incompleteTripsPath_actual = './mockData/handleFailedScrape/incompleteTripIDs_actual.json';
  let incompleteTripsPath_expected= './mockData/handleFailedScrape/incompleteTripIDs_expected.json';
  let failedTripPath = '/home/geoff/work/gigMax/data/raw/tripHTML/00a326bd-1806-4292-a8f9-d295ba2bd9b9.html';
  it('should update the incomplete tripIDs store with new ID', () => {
    handleFailedScrape(failedTripPath, incompleteTripsPath_actual);
    //let incompleteTripIDs: object = getJSON(incompleteTripsPath_before);
    //let failedTripID: string = getIDFromFilePath(failedTripPath);
    //incompleteTripIDs["tripIDs"].push(failedTripID);

    let actual = getJSON(incompleteTripsPath_actual);
    let expected = getJSON(incompleteTripsPath_expected);

    expect(actual).to.deep.equal(expected);
    
    //teardown
    execSync(`rm ${incompleteTripsPath_actual}`, { encoding: 'utf-8' });
    fs.writeFileSync(
      incompleteTripsPath_actual,
      JSON.stringify({"tripIDs": []}, null, 4)
    );

    //extract tripID from failedTripPath
    //load incompleteTripIDs json
    //add extracted tripID to incompleteTripIDs object
    //save updated object to savePath (incompleteTripIDs.json default)

  });
});
describe('handleSuccessfulScrape', () => {
  it('should take a page data object and save it as JSON in page data directory', () => {
    //call handleSuccessfulScrape
    //check that contents of saved json file match expectation
    let actualFilePath = './mockData/handleSuccessfulScrape/00a326bd-1806-4292-a8f9-d295ba2bd9b9.json';
    let expectedFilePath = './mockData/handleSuccessfulScrape/expected.json';
    let testHtmlPath = './mockData/handleSuccessfulScrape/00a326bd-1806-4292-a8f9-d295ba2bd9b9.html';
    let actualFilePathDir = './mockData/handleSuccessfulScrape/';

    handleSuccessfulScrape(testHtmlPath, actualFilePathDir);
    let actual: object = getJSON(actualFilePath);
    let expected: object = getJSON(expectedFilePath);
    expect(actual).to.deep.equal(expected);

    execSync(`rm ${actualFilePath}`, { encoding: 'utf-8' });

  });
});
describe('getCsvJsonFilePath', () => {
  it('should take a csv file path and return the path to json directory save location', () => {
    let testCsvPath = './mockData/getCsvJsonFilePath/statement_0d8685db-1640-5a11-9691-68b3363cac12_date_12_16_2019.csv';
    let saveDir = './mockData/getCsvJsonFilePath/';
    let actual: string = getCsvJsonFilePath(
      testCsvPath,
      saveDir
    );
    let expected: string = testCsvPath.split(".")[0] + ".json";
    expect(actual).to.equal(expected);
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
