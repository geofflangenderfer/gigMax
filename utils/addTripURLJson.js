  // add tripURL field to json files
  //  convert csv to json
  //  extract trip id
  //  build tripURL
  //  add tripURL field to json
//
function addTripURL(jsonFileName) {
  if (!itExists(jsonFileName)) {
    csvToJson(jsonFileName);
  }

  let file = loadFile(jsonFileName);
  let tripIds = getTripIds();
}

function itExists(jsonFileName) {
  
}
