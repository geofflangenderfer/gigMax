#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
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
  extractPageDataSync, 
  isEmpty, 
  getIDFromFilePath, 
  getStatementTripIDs,
  CSVsToJSONs,
} = require('/home/geoff/work/gigMax/src/mutate.ts');

const INIT_TEST_STATEMENT = '/home/geoff/work/gigMax/tests/mockData/merge/initial_statement.json';
const TEST_STATEMENT_NO_BOM = '/home/geoff/work/gigMax/tests/mockData/merge/expected_statement.json';
const TEST_ADDL_DATA = '/home/geoff/work/gigMax/tests/mockData/merge/36fafc62-bfed-46db-b4b0-ce3f3fc7427e.json';
const TEST_STATEMENT_EXPECTED = '/home/geoff/work/gigMax/tests/mockData/merge/mergedTripExpected.js';

import { expect } from 'chai';
import 'mocha';

//describe('mergeAddlDataIntoTrip', () => {
//  it('should add additional fields to a trip object', () => {
//    //let statement: object[] = stripBom(INIT_TEST_STATEMENT);
//    let tripID = '36fafc62-bfed-46db-b4b0-ce3f3fc7427e';
//    let tripIndex: number = getTripIndex(tripID, statement);
//    let addlData: object = getJSON(TEST_ADDL_DATA);
//    let { mergedTripExpected } = require(TEST_STATEMENT_EXPECTED);
//
//    let mergedTripActual = mergeAddlDataIntoTrip(addlData, statement[tripIndex]);
//    expect(mergedTripActual).to.deep.equal(mergedTripExpected);
//  });
//});

describe('getTripIndex', () => {
  let statement: object[] = getJSON(INIT_TEST_STATEMENT);
  let tripID = '36fafc62-bfed-46db-b4b0-ce3f3fc7427e';
  it('should return the array index for the associated trip id', () => {
    let expected = 0;
    let actual = getTripIndex(tripID, statement);
    expect(actual).to.equal(expected);
  });
});
//describe('isInStatement', () => {
//  it('should return true if tripID is in statement', () => {
//  });
//  it('should return false if tripID is not in statement', () => {
//  });
//});
describe('getPageDataPathFromTripID', () => {
  let tripID = '0f00bace-ca58-4e03-9296-8e07549deb9e';
  let dir = '/home/geoff/work/gigMax/tests/mockData/pageData/';//'./mockData/pageData/';
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
  let dir = '/home/geoff/work/gigMax/tests/mockData/pageData';//'./mockData/pageData/';
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
describe.only('stripBom', () => {
  // need to reconcile stripBom's json path input and need for object input
  //https://stackoverflow.com/search?q=byte+order+mark
  it('should return trips after stripping BOM', () => {
    expect(stripBom()).to.deep.equal(getJSON(TEST_STATEMENT_NO_BOM))
  });
});
//describe('extractPageDataSync', () => {
//  it('', () => {
//  });
//});
//describe('isEmpty', () => {
//  it('', () => {
//  });
//});
//describe('getIDFromFilePath', () => {
//  it('', () => {
//  });
//});
//describe('getStatementTripIDs', () => {
//  it('', () => {
//  });
//});
//describe('getJSON', () => {
//  it('', () => {
//  });
//});
//describe('CSVsToJSONs', () => {
//  it('', () => {
//  });
//});
//describe('saveCsvToJson', () => {
//  it('', () => {
//  });
//});
//describe('', () => {
//  it('', () => {
//  });
//});
