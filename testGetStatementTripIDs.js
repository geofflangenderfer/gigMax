#!/usr/bin/env node
const { getJSON, getPageDataPathFromTripID } = require('./etl.js');
const { JSON_PAGE_DATA_DIR } = require('./uriStore.js');


const TEST_STATEMENT = '/home/geoff/work/gigMax/tests/mockData/statement.json';
const test_trip_id = '0f00bace-ca58-4e03-9296-8e07549deb9e.json';
const pageDataPath = getPageDataPathFromTripID(test_trip_id, JSON_PAGE_DATA_DIR);
console.log("Output is: ", pageDataPath);
