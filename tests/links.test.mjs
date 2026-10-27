import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { startServer, launchBrowser, root } from './helpers.mjs';

let server, browser, base;
before(async () => { ({ server, base } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

test('every in-page link points to an existing id', async () => {
  const page = await browser.newPage();
  await page.goto(base);
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute('href').slice(1))
      .filter((id) => id && !document.getElementById(id)));
  assert.deepEqual(missing, []);
  await page.close();
});

test('every local asset referenced by the page exists', async () => {
  const page = await browser.newPage();
  await page.goto(base);
  const refs = await page.evaluate(() =>
    [...document.querySelectorAll('[src],link[href]')]
      .map((el) => el.getAttribute('src') || el.getAttribute('href'))
      .filter((u) => u && !/^(https?:|data:|#)/.test(u)));
  for (const ref of refs) await access(join(root, ref)).catch(() => assert.fail(`missing file: ${ref}`));
  await page.close();
});
