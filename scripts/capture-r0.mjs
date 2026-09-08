import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const base = process.env.R0_BASE_URL || 'http://127.0.0.1:4173';
const out = 'artifacts/screenshots/r0';
await fs.mkdir(out, { recursive: true });

const shots = [
  ['01-login', '/login'],
  ['02-projects', '/projects'],
  ['03-new-project', '/projects/new'],
  ['04-workspace', '/projects/SOL-2026-0184'],
  ['05-consumption', '/projects/SOL-2026-0184/consumption'],
  ['06-solar-designer', '/projects/SOL-2026-0184/design'],
  ['07-equipment', '/projects/SOL-2026-0184/equipment'],
  ['08-economics', '/projects/SOL-2026-0184/economics'],
  ['09-proposal', '/projects/SOL-2026-0184/proposal'],
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
for (const [name, route] of shots) {
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: false });
}
await browser.close();
console.log(`Captured ${shots.length} R0 screenshots in ${out}`);
