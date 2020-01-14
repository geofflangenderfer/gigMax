const fs = require('fs');
const path = require('path');

const STATEMENT_JSON_DIR = "../../data/intermediate/statementJSONs";

function getFilePaths(directory) {
  const files = fs.readdirSync(directory);
  let paths = [];
  for (let file of files) {
    let thisPath = path.join(directory, file);
    paths.push(thisPath);
  }
  return paths;
}
function getStatementJSONs() {
  let filePaths = getFilePaths(STATEMENT_JSON_DIR);
  let statementJSONs = [];
  for (let filePath of filePaths) {
    let statementJSON = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    statementJSONs.push(statementJSON);
  }
  return statementJSONs
}
function getTripURLs(json) {
  
}
module.exports = {
  getFilePaths,
  getStatementJSONs,
};
