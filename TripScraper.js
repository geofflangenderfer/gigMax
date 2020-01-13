#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs'); 


const selectors = {
  pickupTime: "#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dx.dy > div > div.e7 > div.dg > div.e8.cr.cn.co",
  pickupLocation: "#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dx.dy > div > div.e7 > div.dg > div:nth-child(2)",
  dropoffTime: "#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dx.dy > div > div.e7 > div:nth-child(2) > div.e8.cr.cn.co",
  dropoffLocation: "#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dx.dy > div > div.e7 > div:nth-child(2) > div:nth-child(2)",
};
const STATEMENTS_URL = "https://drivers.uber.com/p3/payments/statements";

(async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-notifications']
    });
    const page = await getUserLoggedInPage(browser);

    // scrape data
    //await safelyNavigate(page, STATEMENTS_URL);
    //await clickDownloadCSVButtons(page);
    await saveTripHtmlContent(page);

    await browser.close();

  } catch(error) {
    console.error(error);
  }
})();

async function saveTripHtmlContent(page) {
  // pull urls from csv files
  // build trip urls
  // visit each url and save html content
  const tripUrls = deriveTripUrls();
  for (let url of tripUrls) {
    await safelyNavigate(page, url);
    var html = await page.content();
    fs.writeFileSync(`./data/raw/tripHTML/${url}.html`, html);
  }

}

//async function deriveTripUrls() {
//  
////https://stackoverflow.com/questions/24296325/how-to-safely-mix-sync-and-async-code
//}

//async function scrapeTripPage(page) {
//  let locTimeData = await page.evaluate(selectors => {
//    pickupTime: document.querySelector(selectors.pickupTime),
//    pickupLocation: document.querySelector(selectors.pickupLocation),
//    dropoffTime: document.querySelector(selectors.dropoffTime),
//    dropoffLocation: document.querySelector(selectors.dropoffLocation),
//
//  }, selectors);
//
//  return locTimeData;
//}

async function getUserLoggedInPage(browser) {
  const page = await browser.newPage();
  await page.goto('http://partners.uber.com');
  //waits til user has manually logged in
  await page.waitForFunction(() => {
    const url = document.location.hostname;

    return url == "drivers.uber.com";
  }, 0);

  return page;
}

async function safelyNavigate(page, url) {
  await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './data/raw/statementCSVs'});
  await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});
}
async function getAllStatementURLs(page) {
  // scrape hrefs
  // click next
  // if nothing happens after 30s --> done
  var urls = [];
  do {
    var pageStatementURLs = await getPageStatementURLs(page);
    urls.concat(pageStatementURLs);
    try {
      await Promise.all([
        page.click("#root > div > div > div > div > div:nth-child(2) > div > div.c3.c9.c4.du.fc > div.c3.dv > button:nth-child(4)"),
        page.waitForNavigation({timeout: 15}),
      ]);
    }catch(error) {
      console.error(error); 
      return urls;
    }
    
  } while (isAnotherPage(pageStatementURLs));

  return urls;
}

function isAnotherPage(urls) {
  return urls.length < 25; 
}


async function clickDownloadCSVButtons(page) {
  var numTableRows = await page.evaluate(() => {
    return document.getElementsByTagName("table")[0].rows.length
  });
  //if (isUpToDate()) {
  //  console.log("Data is up to date!");
  //  return;
  //}
  // the 1st row is a table header, so we skip 0
  for (var i = 1; i < numTableRows; i++) {
    var downloadCSVSelector = `#root > div > div > div > div > div:nth-child(2) > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5) > button`
    await page.click(downloadCSVSelector)
    await page.waitFor(10 * 1000);
  }
  await page.waitFor(30 * 1000);
}

// collect all statement urls then navigate to them later, which triggers download
async function getPageStatementURLs(page) {
  var urls = await page.evaluate(() => {
    var urls = [];
    let numTableRows = document.getElementsByTagName("table")[0].rows.length
    // the 1st row is a table header, so we skip 0
    for (var i = 1; i < numTableRows; i++) {
      var statementURLSelector = `#root > div > div > div > div > div:nth-child(2) > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5) > button > a`
      var url = document.querySelector(statementURLSelector).href
      urls.push(url)
    }

    return urls;
  });

  return urls
  
}

async function downloadCSVs(page, urls) {
  for (let url of urls) {
    console.log(url);
    await Promise.all([
      page.goto(url),
      page.waitForNavigation({waitUntil: 'networkidle0'}),
    ]);
  }
}
