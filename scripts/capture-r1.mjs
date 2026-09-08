import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const base=process.env.R1_BASE_URL||'http://127.0.0.1:4173';const out='artifacts/screenshots/r1';await fs.mkdir(out,{recursive:true});const browser=await chromium.launch({headless:true});
async function fresh(){const context=await browser.newContext({viewport:{width:1600,height:1000},deviceScaleFactor:1});const page=await context.newPage();return{context,page}}
async function shot(name,fn){const {context,page}=await fresh();await page.goto(`${base}/projects/SOL-2026-0184/consumption`,{waitUntil:'networkidle'});await fn(page);await page.screenshot({path:`${out}/${name}.png`,fullPage:false});await context.close()}
await shot('consumption-manual',async()=>{});
await shot('consumption-validation',async page=>{const rows=page.locator('.entry-row');await rows.first().locator('input').nth(1).fill('0');await page.waitForTimeout(150)});
await shot('consumption-csv',async page=>{await page.getByRole('button',{name:'CSV import'}).click();await page.waitForTimeout(100)});
await shot('consumption-commercial',async page=>{await page.locator('.r1-controlbar select').selectOption('GDMTH');await page.waitForTimeout(150)});
await shot('sizing-scenarios',async page=>{await page.getByRole('button',{name:'Sizing'}).click();await page.waitForTimeout(100)});
for(const [name,route] of [['workspace-r1','/projects/SOL-2026-0184'],['designer-handoff','/projects/SOL-2026-0184/design']]){const {context,page}=await fresh();await page.goto(`${base}${route}`,{waitUntil:'networkidle'});await page.screenshot({path:`${out}/${name}.png`,fullPage:false});await context.close()}
await browser.close();console.log('Captured R1 browser validation screenshots.');
