import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const base = process.env.R1_BASE_URL || 'http://127.0.0.1:4173';
const out = 'artifacts/screenshots/r1';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function fresh() {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(`${base}/projects/SOL-2026-0184/consumption`, { waitUntil: 'networkidle' });
  return { context, page };
}

async function isolatedShot(name, mutate) {
  const { context, page } = await fresh();
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await mutate(page);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: false });
  await context.close();
}

await isolatedShot('consumption-manual', async () => {});

await isolatedShot('consumption-validation', async page => {
  await page.locator('.entry-row').first().locator('input').nth(1).fill('0');
  await page.waitForTimeout(120);
});

await isolatedShot('consumption-csv', async page => {
  await page.getByRole('button', { name: 'CSV import' }).click();
  await page.locator('.csv-panel textarea').fill('period,kwh,amount_mxn\n2026-01,not-a-number,3200');
  await page.getByRole('button', { name: 'Validate & import' }).click();
  await page.waitForTimeout(120);
});

await isolatedShot('consumption-commercial', async page => {
  await page.locator('.r1-controlbar select').selectOption('GDMTH');
  await page.waitForTimeout(120);
});

await isolatedShot('sizing-scenarios', async page => {
  await page.getByRole('button', { name: 'Sizing' }).click();
  await page.getByRole('button', { name: '95%', exact: true }).click();
  await page.locator('.scenario').filter({ hasText: 'RECOMMENDED' }).getByRole('button', { name: 'Select as design basis' }).click();
  await page.waitForTimeout(120);
});

// Use one persisted context to prove the selected sizing basis propagates downstream.
{
  const { context, page } = await fresh();
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Sizing' }).click();
  await page.getByRole('button', { name: '95%', exact: true }).click();
  await page.locator('.scenario').filter({ hasText: 'RECOMMENDED' }).getByRole('button', { name: 'Select as design basis' }).click();
  await page.goto(`${base}/projects/SOL-2026-0184`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/workspace-r1.png`, fullPage: false });
  await page.goto(`${base}/projects/SOL-2026-0184/design`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/designer-handoff.png`, fullPage: false });
  await context.close();
}

await browser.close();
console.log('Captured seven R1 screenshots from real browser states at 1600x1000.');
