#!/usr/bin/env node

//const getJSON = require('./etl.js');
const fs = require('fs'); 

function getStatementTripIDs(statementFilePath) {
  let statementJSON = getJSON(statementFilePath);
  let tripIDs = [];
  for (let trip of statementJSON) {
    tripIDs.push(trip['Trip ID']);
  }
  return tripIDs;
}
function getJSON(jsonPath) {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}
let statementFilePath = 'data/intermediate/statementJSONs/statement_27858537-a9aa-5346-ae05-5f8e1a9ad6c2_date_10_28_2019.json';
let json = getJSON(statementFilePath);
console.log(Object.keys(json).length);
