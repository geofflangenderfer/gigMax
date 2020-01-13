#!/usr/bin/env node

const fs = require('fs');
const { getFilePaths } = require('./utils/files.js');

const JSON_DIR = '../data.bak/intermediate/statementJSONs';

(function main() {
  const jsonFilePaths = getFilePaths(JSON_DIR);
  for (let jsonFilePath of jsonFilePaths) {
    setTripURLField(jsonFilePath);
  }
})();
function getJSONFilePaths() {
  const jsonFileNames = fs.readdirSync(JSON_DIR);
  
}
function setTripURLField(jsonFileName) {
  //if (!itExists(jsonFileName)) {
  //  csvToJson(jsonFileName);
  //}

  let json = JSON.parse( fs.readFileSync(jsonFileName, 'utf8') );
  console.log(json);
}

//function itExists(jsonFileName) {
//  
//}

  // add tripURL field to json files
  //  check if json built
  //  extract trip id
  //  build tripURL
  //  add tripURL field to json
