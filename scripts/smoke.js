// Minimal smoke test using puppeteer.
// Usage: install puppeteer as dev dep then run `node scripts/smoke.js` while dev server is running.
import puppeteer from 'puppeteer';

async function run() {
  const url = process.env.URL || 'http://localhost:5173/';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  try {
    await page.goto(url);
    console.log('Opened', url);
    // try login as client
    await page.waitForSelector('input[type=email]');
    await page.type('input[type=email]', 'cliente@example.com');
    await page.type('input[type=password]', 'password');
    await page.click('button[type=submit]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('Logged in, current url:', page.url());
    // go to catalog
    await page.goto(url + 'catalogo');
    await page.waitForSelector('.card');
    console.log('Catalog reachable');
    console.log('SMOKE OK');
  } catch (err) {
    console.error('SMOKE FAIL', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
}

run();
