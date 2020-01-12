#!/usr/bin/env node

const fs = require('fs');
const papaParse = require('papaparse');
const path = require('path');

const CSV_DIR = '../data/raw/statementCSVs';
const JSON_DIR = '../data/statementJSONs';

(function main() {
  const csvPaths = getCSVPaths();
  for (let csvPath of csvPaths) {
    saveCsvToJson(csvPath);
  }
  // pretty print saved json
  //https://gist.github.com/collingo/6700069
  //let csvPath = 'data/raw/statementsCSVs/statement_0d8685db-1640-5a11-9691-68b3363cac12_date_12_16_2019.csv';
  //let jsonPath = csvFilePathToJsonFilePath(csvPath);
  //console.log(jsonPath);
})();
function getCSVPaths() {
  const files = getFileNames(CSV_DIR);
  let paths = [];
  for (let file of files) {
    let thisPath = path.join(CSV_DIR, file);
    paths.push(thisPath);

  }

  return paths;
}
function getFileNames(dir) {
  return fs.readdirSync(dir); 
}
function saveCsvToJson(csvFilePath) {
  let contents = fs.readFileSync(csvFilePath, 'utf8');
  let jsonFilePath = csvFilePathToJsonFilePath(csvFilePath);
  papaParse.parse(contents, {
    header: true,
    //dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => ( 
      fs.writeFileSync(jsonFilePath, JSON.stringify( results.data ), 4) 
    )
  });
}
function csvFilePathToJsonFilePath(csvFilePath) {
  let splitPath = csvFilePath.split("/");
  let jsonPart = splitPath[splitPath.length - 1].split(".")[0] + ".json";
  return path.join(JSON_DIR, jsonPart); 
}
