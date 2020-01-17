#!/usr/bin/env node
// for each statement
//  gather all trip IDs
//  for each trip ID
//    find pageData file
//    merge pageData into statement
//    save complete statement in final/statementPaths/{statementID}.json
const { getFilePathsArray } = require('./TripScraper.js');
const {
  JSON_STATEMENT_DIR,
  getStatementTripIDs,
  getJSON,
} = require('./uriStore.js');

(function main() {
  let statementPaths = getFilePathsArray(JSON_STATEMENT_DIR);
  for (let path of statementPaths) {
    let tripIDs = getStatementTripIDs(path);
    for (let id of tripIDs) {
      let idPath = getPathFromTripID(id);
      let idPageDataJSON = getJSON(idPath);
    }

  }
})();
