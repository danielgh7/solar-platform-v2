import { chromium } from 'playwright';

const base = process.env.R1_BASE_URL || 'http://127.0.0.1:4173';
const route = `${base}/projects/SOL-2026-0184/consumption`;
const browser = await chromium.launch({ headless: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function newPage() {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();
  await page.goto(route, { waitUntil: 'networkidle' });
  return { context, page };
}

// Persistence + manual 12–24 month editing.
{
  const { context, page } = await newPage();
  const firstKwh = page.locator('.entry-row').first().locator('input').nth(1);
  await firstKwh.fill('1666');
  await page.reload({ waitUntil: 'networkidle' });
  assert(await page.locator('.entry-row').first().locator('input').nth(1).inputValue() === '1666', 'Persistence failed after refresh');
  for (let i = 0; i < 12; i++) await page.getByRole('button', { name: 'Add month' }).click();
  assert(await page.locator('.entry-row').count() === 24, 'Manual editing did not reach 24 months');
  assert(await page.getByRole('button', { name: 'Add month' }).isDisabled(), '24-month limit not enforced');
  await context.close();
}

// Residential vs demand/PF tariff behavior and Data Quality states.
{
  const { context, page } = await newPage();
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  assert(!(await page.locator('.entry-head').innerText()).includes('Demand kW'), 'Residential tariff unexpectedly shows demand');
  await page.locator('.r1-controlbar select').selectOption('GDMTH');
  const commercialHeader = await page.locator('.entry-head').innerText();
  assert(commercialHeader.includes('Demand kW') && commercialHeader.includes('PF'), 'GDMTH did not expose demand and PF fields');
  assert((await page.locator('.quality-badge').innerText()).includes('Ready for sizing'), 'GDMTH seeded values should remain ready for sizing');
  const firstPf = page.locator('.entry-row').first().locator('input').nth(4);
  await firstPf.fill('1.2');
  assert((await page.locator('.quality-badge').innerText()).includes('Incomplete'), 'Invalid PF did not block sizing');
  await context.close();
}

// CSV invalid + valid import.
{
  const { context, page } = await newPage();
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'CSV import' }).click();
  const textarea = page.locator('.csv-panel textarea');
  await textarea.fill('period,kwh\n2026-01,nope');
  await page.getByRole('button', { name: 'Validate & import' }).click();
  assert(await page.locator('.csv-error').count() > 0, 'Invalid CSV numeric value was not reported');
  const rows = Array.from({ length: 12 }, (_, i) => `2025-${String(i + 1).padStart(2, '0')},${1000 + i * 10},${3000 + i * 20}`).join('\n');
  await textarea.fill(`period,kwh,amount_mxn\n${rows}`);
  await page.getByRole('button', { name: 'Validate & import' }).click();
  assert((await page.locator('.r1-controlbar').innerText()).includes('CSV · validated'), 'Valid CSV did not become validated source');
  await context.close();
}

// Source-document metadata, replace and remove.
{
  const { context, page } = await newPage();
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  const input = page.locator('input[type=file]');
  await input.setInputFiles({ name: 'cfe-septiembre.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 R1 test') });
  assert((await page.locator('.source-document').innerText()).includes('cfe-septiembre.pdf'), 'Source metadata upload failed');
  await input.setInputFiles({ name: 'cfe-octubre.png', mimeType: 'image/png', buffer: Buffer.from('R1 image metadata') });
  assert((await page.locator('.source-document').innerText()).includes('cfe-octubre.png'), 'Source replace failed');
  await page.getByRole('button', { name: 'Remove' }).click();
  assert((await page.locator('.source-document').innerText()).includes('No bill attached'), 'Source remove failed');
  await context.close();
}

// All sizing objectives + scenario selection + Workspace/Designer propagation.
{
  const { context, page } = await newPage();
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Sizing' }).click();
  for (const label of ['50%', '70%', '80%', '90%', '95%', '100%']) {
    await page.getByRole('button', { name: label, exact: true }).click();
    assert(Number(await page.getByLabel('Custom offset').inputValue()) === Number(label.replace('%', '')), `Sizing objective ${label} failed`);
  }
  await page.getByLabel('Custom offset').fill('87');
  assert(await page.getByLabel('Custom offset').inputValue() === '87', 'Custom offset failed');
  await page.getByRole('button', { name: 'Maximize savings*' }).click();
  assert(await page.getByLabel('Custom offset').inputValue() === '100', 'Maximize savings placeholder objective failed');
  await page.getByRole('button', { name: 'Minimize initial size' }).click();
  assert(await page.getByLabel('Custom offset').inputValue() === '50', 'Minimize size objective failed');
  await page.getByRole('button', { name: '95%', exact: true }).click();
  await page.locator('.scenario').filter({ hasText: 'RECOMMENDED' }).getByRole('button', { name: 'Select as design basis' }).click();
  assert((await page.locator('.scenario.selected').innerText()).includes('Current Design Basis'), 'Scenario selection failed');
  await page.goto(`${base}/projects/SOL-2026-0184`, { waitUntil: 'networkidle' });
  assert((await page.locator('.cockpit-summary').innerText()).includes('TARGET DC'), 'Workspace did not receive R1 basis');
  assert((await page.locator('.engineering-checklist').innerText()).includes('Sizing basis'), 'Workspace sizing basis missing');
  await page.goto(`${base}/projects/SOL-2026-0184/design`, { waitUntil: 'networkidle' });
  const banner = await page.locator('.design-basis-banner').innerText();
  assert(banner.includes('640 W') && banner.includes('target 95% offset'), 'Designer handoff basis missing');
  await page.reload({ waitUntil: 'networkidle' });
  assert((await page.locator('.design-basis-banner').innerText()).includes('target 95% offset'), 'Selected design basis did not survive refresh');
  await context.close();
}

await browser.close();
console.log('R1 browser completion validation passed: persistence, tariffs, 12–24 months, CSV, source metadata, data quality, sizing objectives, scenario propagation and Designer handoff.');
