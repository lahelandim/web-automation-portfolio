import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { startServer, launchBrowser } from './helpers.mjs';

const require = createRequire(import.meta.url);
const { AxeBuilder } = require('@axe-core/playwright');

let server, browser, base;
before(async () => { ({ server, base } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

for (const width of [375, 1280]) {
  test(`no automated accessibility violations at ${width}px`, async () => {
    const context = await browser.newContext({ viewport: { width, height: 800 } });
    const page = await context.newPage();
    await page.goto(base);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
    assert.deepEqual(summary, []);
    await context.close();
  });
}
