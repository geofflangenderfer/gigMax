const fs = require('fs');
const path = require('path');

function getFilePaths(directory) {
  const files = fs.readdirSync(directory);
  let paths = [];
  for (let file of files) {
    let thisPath = path.join(directory, file);
    paths.push(thisPath);
  }
  return paths;
}

module.exports.getFilePaths = getFilePaths;
