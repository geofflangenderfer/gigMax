const { 
  getJSON, 
  mergeAddlDataWithStatement,
  getFilePathsArray,
  isMatch,
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
//  it('should take a tripID and return the ( relative/absolute ) pageDataPath', () => {
//  });
//});
describe('isMatch', () => {
  let tripID = '57ced820-2b0b-4d0b-8c2a-e6ac7c0a6301.json';
  let pageDataPath = '/home/geoff/work/gigMax/data/intermediate/pageData/57ced820-2b0b-4d0b-8c2a-e6ac7c0a6301.json';

  it('should return true when tripID in pageDataPath', () => {
    let check = isMatch(tripID, pageDataPath); 
    expect(check).to.equal(true);
  });
  it('should return false when tripID not in pageDataPath', () => {
    let differentTripID = '36fafc62-bfed-46db-b4b0-ce3f3fc7427e.json';
    let check = isMatch(differentTripID, pageDataPath); 
    expect(check).to.equal(false);
  });
  it('should return false when tripID equals ""', () => {
    let emptyTripID = '';
    let check = isMatch(emptyTripID, pageDataPath); 
    expect(check).to.equal(false);
  });
});
//describe('', () => {
//  it('', () => {
//  });
//});
//describe('', () => {
//  it('', () => {
//  });
//});
