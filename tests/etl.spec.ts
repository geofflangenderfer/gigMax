const fs = require('fs');
const { 
  getJSON, 
  mergeAddlDataWithStatement,
  getFilePathsArray,
  isMatch,
  getPageDataPathFromTripID,
} = require('/home/geoff/work/gigMax/etl.js');

const TEST_STATEMENT = '/home/geoff/work/gigMax/tests/mockData/statement_27858537-a9aa-5346-ae05-5f8e1a9ad6c2_date_10_28_2019.json';
const TEST_ADDL_DATA = '/home/geoff/work/gigMax/tests/mockData/36fafc62-bfed-46db-b4b0-ce3f3fc7427e.json';
const TEST_STATEMENT_EXPECTED = './mockData/statementExpected.js';

import { expect } from 'chai';
import 'mocha';

//describe('mergeAddlDataWithStatement', () => {
//  it('should add additional fields to a trip object', () => {
//    //const statement: object = getJSON(TEST_STATEMENT);
//    //const addlData: object = getJSON(TEST_ADDL_DATA);
//
//    let statementActual = mergeAddlDataWithStatement(TEST_ADDL_DATA, TEST_STATEMENT);
//
//    const { statementExpected } = require(TEST_STATEMENT_EXPECTED);
//    for (let key in statementExpected) {
//      let checkKey = statementActual.hasOwnProperty(key);  
//      let checkValue = statementActual[ key ] == statementExpected[ key ];
//
//      expect(checkKey).to.equal(true);
//      expect(checkValue).to.equal(true);
//    }
//  });
//});
//describe('getPageDataPathFromTripID', () => {
//  let tripID = '2f00bace-ca58-4e03-9296-8e07549deb9e';
//  let dir = './mockData/pageData/';
//  it('should return the absolute path with a valid tripID', () => {
//    let pageDataPath = getPageDataPathFromTripID(tripID, dir);
//    let expectedPath = dir + tripID + '.json';
//    expect(pageDataPath).to.equal(expectedPath);
//  });
//  //it('should return "" when tripID is "" or not present in data directory', () => {
//  //});
//});
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
  let tripID = '2f00bace-ca58-4e03-9296-8e07549deb9e';
  let dir = '/home/geoff/work/gigMax/tests/mockData/pageData';//'./mockData/pageData/';
  it('should return a string[] with valid input', () => {
    let filePathsActual: string[] = getFilePathsArray(dir)
    expect(typeof filePathsActual).to.equal('object');
    expect(filePathsActual.length).to.equal(52);
  });
  it('should return absolute filepaths with valid input', () => {
    let filePathsActual: string[] = getFilePathsArray(dir)
    for (let path of filePathsActual) {
      let dirPart = path.split(dir)[0];
      let ending = path.split(dir)[1];
      expect(dirPart).to.equal(dir);
    };
  });
});
//describe('', () => {
//  it('', () => {
//  });
//});
