#!/usr/bin/env node
const { getJSON, getFilePathsArray } = require('./etl.js');
const { JSON_PAGE_DATA_DIR } = require('./uriStore.js');


const TEST_STATEMENT = '/home/geoff/work/gigMax/tests/mockData/statement.json';
const filePaths = getFilePathsArray(JSON_PAGE_DATA_DIR);
console.log(filePaths);
