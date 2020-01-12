#!/usr/bin/env node

const fs = require('fs');
const pp = require('papaparse');
const path = require('path');


const CSV_DIR = './data/raw/statementCSVs';
const JSON_DIR = './data/statementJSONs';
(() => {

  const csvPaths = getCSVPaths();
  console.log(csvPaths);
  //const csvPaths = [ 'data/raw/statementCSVs/statement_ff94ed72-3bc1-5e9e-a8e2-70a83fc0a15a_date_11_04_2019.csv'
 // ]  
  //const tripIds = getTripIds(csvPaths);
  // check there is json file 
  // grab ids from json
  //console.log(tripIds);
  //console.log(tripIds);
  //const tripUrls = buildUrls(tripIds);

})();

function getCSVPaths() {
  const files = getFileNames(CSV_DIR);
  let paths = [];
  for (let file of files) {
    let thisPath = path.join('data', 'raw', 'statementCSVs', file);
    paths.push(thisPath);

  }

  return paths;
  
}

function getFileNames(dir) {
  return fs.readdirSync(dir); 
}

//function getTripIds(paths) {
//  var tripIds = [];
//  for (let onePath of paths) {
//    ids = getTripIdsFromCsv(onePath);
//    tripIds.push(ids);
//  }
//
//  return tripIds;
//}
//
//function getTripIdsFromCsv(filePath) {
//  if (!hasJSONFile(filePath)) {
//    saveToJson(results, filePath)
//  }
//}

function hasJSONFile(filePath) {
  
}

function saveToJson(papaParseResults, filePath) {
  // extract row data
  // get save file path
  // save as json
  let contents = fs.readFileSync(filePath, 'utf8');
  pp.parse(contents, {
    header: true,
    //dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => fs.writeFileSync()
  });

  let tripIds = [];
  for (let row of papaParseResults.data) {
    let tripId = row['Trip ID'];
    tripIds.push(tripId);
  }

  return tripIds;
}
//function buildUrls(tripIds) {
//  
//}
