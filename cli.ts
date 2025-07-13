import { chromium } from 'playwright';
import chalk from 'chalk';
import { analyzeLocators } from './src/analyzer';

const url = process.argv[2];
if (!url) {
  console.error('❌ Please provide a URL.\nUsage: locator-intel https://example.com');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const locators = await analyzeLocators(page);

  for (const l of locators.slice(0, 20)) {
    console.log(`${chalk.green(l.locator)}\n${chalk.gray(l.reason)}\n${chalk.yellow(l.element)}\n`);
  }

  await page.evaluate((locators) => {
  for (const l of locators) {
    // Skip invalid selectors like ">> text=..."
    if (l.locator.includes('>>') || l.locator.startsWith('text=')) continue;

    try {
      const el = document.querySelector(l.locator);
      if (!el) continue;

      (el as HTMLElement).style.outline = '3px solid red';
      (el as HTMLElement).style.position = 'relative';

      const label = document.createElement('div');
      label.textContent = l.locator;
      label.style.position = 'absolute';
      label.style.top = '0';
      label.style.left = '0';
      label.style.background = 'rgba(255, 0, 0, 0.7)';
      label.style.color = 'white';
      label.style.fontSize = '10px';
      label.style.padding = '2px';
      label.style.zIndex = '9999';
      el.appendChild(label);
    } catch (e) {
      // Invalid selector, just skip
      continue;
    }
  }
}, locators);


  await page.screenshot({ path: 'locators-visual.png', fullPage: true });
  console.log('📸 Screenshot with locators saved as locators-visual.png');

  await browser.close();
})();
