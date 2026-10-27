import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = fileURLToPath(new URL('..', import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

let server, browser, base;

before(async () => {
  server = http.createServer(async (req, res) => {
    const path = req.url.split('?')[0];
    const file = normalize(join(root, path === '/' ? 'index.html' : path));
    if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}/`;
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
});

after(async () => { await browser?.close(); server?.close(); });

async function open(width, height = 800) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(base);
  return page;
}

test('page has required sections, one h1, and alt text', async () => {
  const page = await open(1280);
  for (const id of ['top', 'services', 'benefits', 'process', 'faq', 'contact']) {
    assert.equal(await page.locator(`#${id}`).count(), 1, `missing #${id}`);
  }
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('img:not([alt])').count(), 0);
  assert.ok((await page.locator('a[href="#contact"]').count()) >= 3, 'needs several quote CTAs');
  await page.close();
});

for (const width of [375, 768, 1280]) {
  test(`no horizontal overflow at ${width}px`, async () => {
    const page = await open(width);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `overflow of ${overflow}px`);
    await page.close();
  });
}

test('mobile menu opens and closes with Escape', async () => {
  const page = await open(375);
  const toggle = page.locator('.nav-toggle');
  assert.equal(await page.locator('#site-nav').isVisible(), false);
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('#site-nav').isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  await page.close();
});

test('form validates and clearly says nothing was sent', async () => {
  const page = await open(1280);
  await page.click('#quote-form button[type=submit]');
  assert.equal(await page.locator('#name-error').isVisible(), true);
  await page.fill('#name', 'Test User');
  await page.fill('#email', 'test@example.com');
  await page.selectOption('#service', 'Deep Cleaning');
  await page.click('#quote-form button[type=submit]');
  assert.match(await page.locator('#form-status').innerText(), /nothing was sent/i);
  await page.close();
});
