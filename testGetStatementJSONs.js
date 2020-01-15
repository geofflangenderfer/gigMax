const path = require('path');
const fs = require('fs'); 

const JSON_DIR = './data.bak/intermediate/statementJSONs';
const BASE_TRIP_URL = "https://drivers.uber.com/p3/payments/trips/"

(
function main() {
  let tripIDs = getTripIDs();
  tripIDs.forEach(id => console.log(BASE_TRIP_URL + id));
}
)();
function getTripIDs() {
  let statementJSONs = getStatementJSONs();
  let tripIDs = [];
  //console.log(statementJSONs[1][0]['Trip ID']);
  // for some reason the first element is an empty array, so we skip
  for (let i = 1; i < statementJSONs.length; i++) {
    for (let trip of statementJSONs[i]) {
      tripIDs.push(trip['Trip ID']);
    }
  }
  return tripIDs;
}
function getStatementJSONs() {
  let statementJSONs = getFilePathsArray(JSON_DIR).map(filePath => (
    JSON.parse(fs.readFileSync(filePath, 'utf8'))
  ));
  return statementJSONs;
  
}
function getFilePathsArray(directory) {
  const files = fs.readdirSync(directory);
  let paths = [];
  for (let file of files) {
    let thisPath = path.join(directory, file);
    paths.push(thisPath);
  }
  return paths;
}

