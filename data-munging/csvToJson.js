#!/usr/bin/env node

const fs = require('fs');
const papaParse = require('papaparse');
const path = require('path');

const CSV_DIR = '../data/raw/statementCSVs';
const JSON_DIR = '../data/intermediate/statementJSONs';

(function main() {
  const csvPaths = getCSVPaths();
  for (let csvPath of csvPaths) {
    saveCsvToJson(csvPath);
  }
})();
function getCSVPaths() {
  const files = fs.readdirSync(CSV_DIR);
  let paths = [];
  for (let file of files) {
    let thisPath = path.join(CSV_DIR, file);
    paths.push(thisPath);
  }
  return paths;
}
function saveCsvToJson(csvFilePath) {
  let csvFileNames = fs.readFileSync(csvFilePath, 'utf8');
  let jsonFilePath = csvFilePathToJsonFilePath(csvFilePath);
  papaParse.parse(csvFileNames, {
    header: true,
    //dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => ( 
      fs.writeFileSync(jsonFilePath, JSON.stringify(results.data, null, 4)) 
    )
  });
}
function csvFilePathToJsonFilePath(csvFilePath) {
  let splitPath = csvFilePath.split("/");
  let jsonPart = splitPath[splitPath.length - 1].split(".")[0] + ".json";
  return path.join(JSON_DIR, jsonPart); 
}
