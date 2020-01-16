#!/usr/bin/env node

const cheerio = require('cheerio');
const fs = require('fs');
const assert = require('assert');

(function main() {
  let html = fs.readFileSync('./00a326bd-1806-4292-a8f9-d295ba2bd9b9.html', 'utf8');
  //testTimeRegex(html);
  testLocationRegex(html);
})();

function testTimeRegex(string) {
  let re = /([0-1]?[0-9]|2[0-3]):[0-5][0-9] [A|P]M/g;
  let actualTimes = string.match(re);
  let expectedTimes = [ '9:22 PM', '9:22 PM', '10:02 PM' ];
  for (var i = 0; i < actualTimes.length ; i++) {
    assert(actualTimes[i] == expectedTimes[i]);
  }
}

function testLocationRegex(string) {
  //let re = /, [A-Z][a-z]+, [A-Z][a-z]+/g;
  let $ = cheerio.load(string);
  let re = / [A-Z][a-z]+, ([A-Z][A-Z] | [A-Z][a-z]+)/g;
  let actualTimes = $('div');
  //.filter(div => (
  //  typeof div.text().match(re) == 'string'
  //));
  console.log(actualTimes);
  
}
