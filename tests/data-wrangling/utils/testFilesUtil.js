const fs = require('fs');
const assert = require('assert');
const { getFilePaths, getStatementsJSONs } = require('../../data-wrangling/utils/files.js');
const { getFilePathsExpected } = require('./getFilePathsExpected.js');

(function main() {
  testGetFilePaths();
  //testGetStatementJSONs();
}
)();
function testGetFilePaths() {
  let actual = getFilePaths('./testJSONFiles');
  try {
    for (var i = 0; i < actual.length ; i++) {
      assert(actual[i] == getFilePathsExpected[i]);
    }
  } catch (e) {
    console.error(e);
  }
}
