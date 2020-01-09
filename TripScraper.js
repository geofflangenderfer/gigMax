#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs'); // write urls to file

//(async () => {
//  const browser = await puppeteer.launch({headless: false});
//  const page = await browser.newPage();
//  await page.goto('http://partners.uber.com');
//  await page.waitForFunction(() => {
//    const url = document.location.hostname;
//
//    return url == "partners.uber.com";
//  }, 0);
//
//  await browser.close();
//})();


(async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-notifications']
    });
    const page = await getUserLoggedInPage(browser);

    const statementsURL = "https://drivers.uber.com/p3/payments/statements";
    //await page._client.send(
    //  'Page.setDownloadBehavior', 
    //  {behavior: 'allow', downloadPath: './statements'}
    //);
    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './'});
    await navigateTo(page, statementsURL);
    //let statementURLs = await getAllStatementURLs(page);
    await clickDownloadCSVButtons(page);
    page.on('dialog', async dialog => {
    	console.log(dialog.accept());
    });

    await browser.close();

  } catch(error) {
    console.error(error);
  }
})();

async function getUserLoggedInPage(browser) {
  const page = await browser.newPage();
  //page.setDownloadBehavior('allow');
  //avoids a 'download multiple files' permission request
  await page.goto('http://partners.uber.com');
  //waits til user has manually logged in
  await page.waitForFunction(() => {
    const url = document.location.hostname;

    return url == "drivers.uber.com";
  }, 0);

  return page;
}


async function navigateTo(page, url) {
  const options = {
    timeout: 0,
    waitUntil: 'networkidle0',
  };
  await page.goto(url, options);
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


// click all 'download csv' buttons
async function clickDownloadCSVButtons(page) {
  var numTableRows = await page.evaluate(() => {
    return document.getElementsByTagName("table")[0].rows.length
  });
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
