// Minimal smoke test using puppeteer.
// Usage: install puppeteer as dev dep then run `node scripts/smoke.js` while dev server is running.
import puppeteer from 'puppeteer';

async function run() {
  const url = process.env.URL || 'http://localhost:5174/';
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.setDefaultTimeout(60000);
  try {
    // ensure a clean state by loading the app and clearing its localStorage then reloading
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    try { await page.evaluate(() => localStorage.clear()); } catch (err) { /* ignore */ }
    await page.reload({ waitUntil: 'networkidle0' });
    console.log('Opened', url, '(clean state)');
    // try login as client
    await page.waitForSelector('input.form-input[type=email]', { timeout: 40000 });
    await page.type('input.form-input[type=email]', 'ana@bellasboutique.com');
    await page.type('input.form-input[type=password]', 'Password123!');
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
