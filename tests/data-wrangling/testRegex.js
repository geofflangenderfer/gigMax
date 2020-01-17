#!/usr/bin/env node

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { SELECTORS } = require('./selectors.js');
const { testSet } = require('./testSet.js');

(function main() {
  //let html = fs.readFileSync('./00a326bd-1806-4292-a8f9-d295ba2bd9b9.html', 'utf8');
  //testTimeRegex(html);
  //testLocationRegex(html);
  //testPickupAddressSelector();
  testExtractPageDataSync();
})();
function testExtractPageDataSync() {
  let expected = {
    pickupAddress: 'San Jacinto Blvd #201, Austin, TX 78701',
    dropoffAddress: 'S 3rd St, Austin, Texas',
    pickupTime: '9:22 PM',
    dropoffTime: '10:02 PM',
    duration: '37min 21sec',
    distance: '3.93 mi',
    licensePlate: 'BICYCLE'
  }
  //let filePath = '/home/geoff/work/gigMax/data/raw/tripHTML/08b508ab-4217-4084-9f88-08f77d6eb63a.html';
  //let actual = extractPageDataSync(filePath);
  //for (let key in expected) {
  //  assert(expected.key == actual.key);
  //}

  let problemFiles = [];
  for (let file of testSet) {
    let json = extractPageDataSync(file);
    if (isEmpty(json)) {
      problemFiles.push(file);
    }
  }
  console.log("# of problem files:", problemFiles.length);
  fs.writeFileSync('./problemFiles.csv', problemFiles);
}


function extractPageDataSync(htmlFile) {
  let html = fs.readFileSync(htmlFile, 'utf8');
  let json = {};
  for (selector in SELECTORS) {
    json[selector] = extractPageDataWithSelector(html, SELECTORS[ selector ]);
  }
  console.log(json);
  return json;
}
function isEmpty(json) {
  let keysCondition = Object.keys(json).length == 7;
  let valuesCondition = Object.values(json)
    .filter(value => value == '')
    .length == 7;
  return keysCondition && valuesCondition;
}
function extractPageDataWithSelector(html, selectors) {
  let $ = cheerio.load(html);
  let data = '';
  for (let selector of selectors) {
    data = $(selector).text();
    if (data != '') break;
  }
  return data;
}

function testTimeRegex(string) {
  let re = /([0-1]?[0-9]|2[0-3]):[0-5][0-9] [A|P]M/g;
  let actualTimes = string.match(re);
  let expectedTimes = [ '9:22 PM', '9:22 PM', '10:02 PM' ];
  for (var i = 0; i < actualTimes.length ; i++) {
    assert(actualTimes[i] == expectedTimes[i]);
  }
}

function testLocationRegex(string) {
  let $ = cheerio.load(string);
  let reCityState = /, [A-Z][a-z]+, ([A-Z][A-Z]|[A-Z][a-z]+)/g;
  let cityState = string.match(reCityState);
  let cityStateSet = new Set( cityState );
  //let actualLocations = $(`div:contains(${cityStateSet.entries()[0]})`).text();
  let actualLocations = $('div').filter(() => {
    return $(this).text().indexOf('San Jacinto') > -1;
  });
  //.filter(div => (
  //  typeof div.text().match(re) == 'string'
  //));
  //console.log("cityState:", cityStateUnique);
}

function testPickupAddressSelector() {
  let bakTripHTMLPath = '/home/geoff/work/gigMax/data.bak/raw/tripHTML';
  let tripHTMLPath = '/home/geoff/work/gigMax/data/raw/tripHTML';
  let bakNumPickupAddresses = getPickupAddressesInDirectory(bakTripHTMLPath).length;
  let numPickupAddresses = getPickupAddressesInDirectory(tripHTMLPath).length;

  assert(bakNumPickupAddresses == 305);
  assert(numPickupAddresses == 273);
  
}

function getPickupAddressesInDirectory(dir) {
  // array = []
  // for each html file
  //  use selector to grab pickup address
  //  push to array
  let htmls = getFilePathsArray(dir);
  let pickupAddresses = htmls.map(html => {
    let htmlString = fs.readFileSync(html, 'utf8');
    let $ = cheerio.load(htmlString);
    let pickupAddressSelector = '#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dx.dy > div > div.e7 > div.dg > div:nth-child(2)';
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dx.dy > div > div.e7 > div.dg > div:nth-child(2)'
    let pickupAddress = $(pickupAddressSelector).text();
    return pickupAddress;
  });

  return pickupAddresses;
}
function getFilePathsArray(directory) {
  const files = fs.readdirSync(directory);
  let paths = files.map(file => (
    path.join(directory, file)
  ));
  //let paths = [];
  //for (let file of files) {
  //  let thisPath = path.join(directory, file);
  //  paths.push(thisPath);
  //}
  return paths;
}

