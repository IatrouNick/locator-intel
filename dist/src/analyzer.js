"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeLocators = analyzeLocators;
async function analyzeLocators(page) {
    const handles = await page.$$('body *');
    const results = [];
    for (const handle of handles) {
        const tag = await handle.evaluate((el) => el.tagName.toLowerCase());
        const text = await handle.evaluate((el) => el.textContent?.trim() || '');
        const id = await handle.getAttribute('id');
        const dataTestId = await handle.getAttribute('data-testid');
        const ariaLabel = await handle.getAttribute('aria-label');
        const role = await handle.getAttribute('role');
        const classes = await handle.getAttribute('class');
        let locator = '';
        let score = 0;
        let reason = '';
        if (dataTestId) {
            locator = `[data-testid="${dataTestId}"]`;
            score = 10;
            reason = 'Uses data-testid';
        }
        else if (id) {
            locator = `#${id}`;
            score = 8;
            reason = 'Uses element ID';
        }
        else if (ariaLabel) {
            locator = `[aria-label="${ariaLabel}"]`;
            score = 7;
            reason = 'Uses ARIA label';
        }
        else if (role && text) {
            locator = `${tag}[role="${role}"] >> text="${text}"`;
            score = 6;
            reason = 'Uses role + visible text';
        }
        else if (text && text.length < 50) {
            locator = `text="${text}"`;
            score = 4;
            reason = 'Uses visible text (may be fragile)';
        }
        else {
            locator = await handle.evaluate((el) => el.outerHTML.split('\n')[0]);
            score = 2;
            reason = 'No stable attribute, fallback to outerHTML';
        }
        results.push({
            element: `<${tag}${id ? ` id="${id}"` : ''}${classes ? ` class="${classes}"` : ''}>`,
            locator,
            score,
            reason,
        });
    }
    return results.sort((a, b) => b.score - a.score);
}
