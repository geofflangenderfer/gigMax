const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('http://partners.uber.com');
  await this.page.waitForFunction(() => {
    const url = document.location.hostname;

    return url == "partners.uber.com";
  }, 0);

  await browser.close();
})();


async function getLoggedInPage(url) {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('http://partners.uber.com');
  await this.page.waitForFunction(() => {
    const url = document.location.hostname;

    return url == "partners.uber.com";
  }, 0);

  return page;
  
}
