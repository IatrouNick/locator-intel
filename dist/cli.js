"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const playwright_1 = require("playwright");
const chalk_1 = __importDefault(require("chalk"));
const analyzer_1 = require("./src/analyzer");
const url = process.argv[2];
if (!url) {
    console.error('❌ Please provide a URL.\nUsage: locator-intel https://example.com');
    process.exit(1);
}
(async () => {
    const browser = await playwright_1.chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    const locators = await (0, analyzer_1.analyzeLocators)(page);
    for (const l of locators.slice(0, 20)) {
        console.log(`${chalk_1.default.green(l.locator)}\n${chalk_1.default.gray(l.reason)}\n${chalk_1.default.yellow(l.element)}\n`);
    }
    await page.evaluate((locators) => {
        for (const l of locators) {
            // Skip invalid selectors like ">> text=..."
            if (l.locator.includes('>>') || l.locator.startsWith('text='))
                continue;
            try {
                const el = document.querySelector(l.locator);
                if (!el)
                    continue;
                el.style.outline = '3px solid red';
                el.style.position = 'relative';
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
            }
            catch (e) {
                // Invalid selector, just skip
                continue;
            }
        }
    }, locators);
    await page.screenshot({ path: 'locators-visual.png', fullPage: true });
    console.log('📸 Screenshot with locators saved as locators-visual.png');
    await browser.close();
})();
