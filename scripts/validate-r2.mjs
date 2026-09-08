import {chromium} from 'playwright';
const base=process.env.R2_BASE_URL||'http://127.0.0.1:4173';const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1600,height:1000}});const page=await context.newPage();const url=`${base}/projects/SOL-2026-0184/design`;
const assert=(v,msg)=>{if(!v)throw new Error(msg)};async function reset(){await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.removeItem('solar-platform-v2:r2:site-design:SOL-2026-0184'));await page.reload({waitUntil:'networkidle'})}async function worldClick(x,y){const b=await page.locator('.r2-canvas').boundingBox();if(!b)throw new Error('canvas missing');await page.mouse.click(b.x+b.width*x/30,b.y+b.height*y/20)}
await reset();assert(await page.locator('.r2-roof').count()===1,'default roof missing');assert((await page.locator('.r2-kpis').innerText()).includes('m²'),'geometry KPI missing');
// Roof creation, selection and properties.
await page.getByTitle('Roof').click();await worldClick(2,2);await worldClick(4,2);await worldClick(4,3.5);await worldClick(2,3.5);await page.getByRole('button',{name:/Close roof/}).click();assert(await page.locator('.r2-roof').count()===2,'roof create failed');assert((await page.locator('.r2-inspector').innerText()).includes('Gross area'),'roof inspector missing');
// Undo/redo roof create.
await page.getByRole('button',{name:'Undo'}).click();assert(await page.locator('.r2-roof').count()===1,'undo roof create failed');await page.getByRole('button',{name:'Redo'}).click();assert(await page.locator('.r2-roof').count()===2,'redo roof create failed');
// Select main roof and setback.
await page.locator('.r2-roof').first().click();const setback=page.locator('.r2-properties label').filter({hasText:'Edge setback'}).locator('input');await setback.fill('0.9');await setback.press('Enter');assert(await page.locator('.r2-setback').count()>=1,'setback boundary missing');
// Obstruction and restricted zone tools create real geometry.
await page.getByTitle('Obstacle').click();await worldClick(10,8);assert(await page.locator('.r2-obstruction').count()>=2,'obstruction create failed');await page.getByTitle('Restricted').click();await worldClick(17,10);assert(await page.locator('.r2-zone').count()>=2,'restricted zone create failed');
// Valid manual placement.
await page.getByTitle('Modules').click();const before=await page.locator('.r2-module').count();await worldClick(8,6);assert(await page.locator('.r2-module').count()===before+1,'valid manual module placement failed');
// Invalid placement outside usable roof.
await worldClick(1,1);assert((await page.locator('.designer-top').innerText()).includes('Placement rejected'),'invalid placement feedback missing');
// Auto-layout portrait + undo/redo.
await page.locator('.r2-roof').first().click();await page.getByRole('button',{name:'Auto-fill portrait'}).click();const portraitCount=await page.locator('.r2-module').count();assert(portraitCount>0,'portrait auto-layout empty');await page.getByRole('button',{name:'Undo'}).click();await page.getByRole('button',{name:'Redo'}).click();assert(await page.locator('.r2-module').count()===portraitCount,'auto-layout undo/redo failed');
await page.locator('.r2-roof').first().click();await page.getByRole('button',{name:'Auto-fill landscape'}).click();const landscapeCount=await page.locator('.r2-module').count();assert(landscapeCount>0,'landscape auto-layout empty');
// Target integration visible.
const banner=await page.locator('.design-basis-banner').innerText();assert(banner.includes('R1 design basis')&&banner.includes('640 W'),'R1 target basis missing');assert((await page.locator('.r2-kpis').innerText()).includes('TARGET DELTA'),'target capacity delta missing');
// Persistence exact module count after refresh.
const saved=await page.evaluate(()=>localStorage.getItem('solar-platform-v2:r2:site-design:SOL-2026-0184'));assert(!!saved,'design was not persisted');await page.reload({waitUntil:'networkidle'});assert(await page.locator('.r2-module').count()===landscapeCount,'module layout did not survive refresh');assert(await page.locator('.r2-roof').count()===2,'roof geometry did not survive refresh');
// Multi-select inspector.
const mods=page.locator('.r2-module');if(await mods.count()>1){await mods.nth(0).click();await mods.nth(1).click({modifiers:['Shift']});assert((await page.locator('.r2-inspector').innerText()).includes('Total DC'),'multi-select inspector missing')}
await browser.close();console.log('R2 browser validation passed: roof geometry/editing, setbacks, blocked zones, manual placement, auto-layout, target delta, persistence and undo/redo.');
