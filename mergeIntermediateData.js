// for each statement
//  gather all trip IDs
//  for each trip ID
//    find pageData file
//    merge pageData into statement
//    save complete statement in final/statements/{tripID}.json
const { getFilePathsArray } = require('./TripScraper.js');

(function main() {
  let statements = getFilePathsArray();

})();
