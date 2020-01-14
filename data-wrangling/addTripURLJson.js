#!/usr/bin/env node

const fs = require('fs');
const { getFilePaths } = require('./utils/files.js');

const JSON_DIR = '../data/intermediate/statementJSONs';

(function main() {
  const jsonFilePaths = getFilePaths(JSON_DIR);
  setTripURLField(jsonFilePaths[0]);
  //for (let jsonFilePath of jsonFilePaths) {
  //  setTripURLField(jsonFilePath);
  //}
})();
function setTripURLField(jsonFilePath) {
  //if (!itExists(jsonFilePath)) {
  //  csvToJson(jsonFilePath);
  //}

  let json = JSON.parse( fs.readFileSync(jsonFilePath, 'utf8') );
  json['Trip URL'] = getTripURL();
}

//function itExists(jsonFilePath) {
//  
//}

  // add tripURL field to json files
  //  check if json built
  //  extract trip id
  //  build tripURL
  //  add tripURL field to json
