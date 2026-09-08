# R0 / R0.1 — Product Shell Review

## Scope
R0.1 is a frontend-only visual/product-quality refinement of the R0 solar-project shell for Mexico. It was built from scratch in `solar-platform-v2`; no SolarERP code, frontend, assets, or architecture were used or migrated. No R1 functionality is included.

## Implemented routes
| Screenshot | Route | Screen |
|---|---|---|
| `01-login.png` | `/login` | Login |
| `02-projects.png` | `/projects` | Projects |
| `03-new-project.png` | `/projects/new` | New Project |
| `04-workspace.png` | `/projects/SOL-2026-0184` | Project Workspace |
| `05-consumption.png` | `/projects/SOL-2026-0184/consumption` | Consumption |
| `06-solar-designer.png` | `/projects/SOL-2026-0184/design` | Solar Designer |
| `07-equipment.png` | `/projects/SOL-2026-0184/equipment` | Equipment |
| `08-economics.png` | `/projects/SOL-2026-0184/economics` | Economics |
| `09-proposal.png` | `/projects/SOL-2026-0184/proposal` | Proposal |

## R0.1 corrections
R0.1 implements Issue #1, **R0.1 — Visual and product-quality corrections before R1**, as a product-polish pass only.

### Global product corrections
- Reworked the visual language around a solar-engineering workflow rather than a generic CRM/SaaS dashboard.
- Increased desktop information density, tightened spacing, reduced generic card treatment, and retained a neutral technical palette with green reserved mainly for state/action emphasis.
- Project context now prioritizes PV size, annual load and energy offset alongside customer/location context.
- Added a persistent engineering workflow strip: **Consumption → Design → Equipment → Economics → Proposal**.
- Refactored the previous monolithic `src/App.tsx` into route/page/component modules. `App.tsx` now only owns routing.
- Extracted shared application shell/navigation, project context/workflow, charts, technical equipment rows, proposal document sections and Solar Designer into separate files.

### 01 Login
- Removed prototype/debug language from the primary hierarchy.
- Kept a restrained 2D solar design preview as a product preview rather than a marketing landing-page hero.
- Kept the screen minimal and premium.

### 02 Projects
- Replaced generic portfolio/pipeline emphasis with a compact installer-oriented engineering table.
- Project rows now surface CFE tariff/site type, design stage, PV size/modules, offset and the next engineering step.

### 03 New Project
- Preserved the three-step flow while reframing it around solar-site creation:
  1. Project/customer identity.
  2. Site, electrical service and address.
  3. CFE tariff, annual consumption/bill and target offset.
- Final CTA opens the Consumption setup to make the transition into engineering explicit.

### 04 Workspace
- Reworked Overview into a solar project cockpit.
- Prominent engineering summary now includes annual consumption, proposed PV size, annual production, coverage and project completeness.
- Added workflow strip, selected technical package and a direct next action into Solar Designer.

### 05 Consumption
- Strengthened CFE-specific hierarchy and made monthly kWh history the dominant visualization.
- Added concise data-source/data-quality state (`Manual / mock`).
- Residential service explicitly shows demand and power factor as not applicable; the screen explains these metrics become relevant for commercial/industrial tariffs.
- CFE bill upload is integrated as a source-document step rather than a generic dropzone.

### 06 Solar Designer — flagship R0.1 screen
- Reduced surrounding chrome and made the 2D canvas dominate the viewport.
- Added compact left engineering tool rail, top design controls, right solar-specific inspector and persistent bottom KPI bar.
- Roof polygon is visually distinct from the site background.
- Modules follow the roof plane angle and placement rather than reading as a detached table/grid.
- Selected module state uses an unmistakable high-contrast outline; Shift multi-select remains available.
- Portrait/landscape changes visibly alter selected module geometry.
- Obstacles, setbacks, strings and irradiance/shading layer use distinct visual encodings.
- String paths are labeled by string/MPPT with separate path colors.
- Irradiance layer is expressed as an uneven solar-exposure field rather than a purely decorative gradient.
- Tool feedback is shown for select, module placement, erase, roof, obstruction, measure and string states.
- Zoom controls, pan nudge, undo, redo and delete selected remain interactive.
- Bottom metrics update from module count and include modules, DC kWp, annual production, specific yield, offset and shade loss.
- Inspector shows roof azimuth/tilt/area/setback/irradiance or selected-module/string/MPPT properties.
- Remains a polished 2D interactive mock; no fake 3D was introduced.

### 07 Equipment
- Selection is explicitly tied to the 12.80 kWp design and current string/module count.
- Selected panel, inverter and storage state are prominent above the catalog.
- Technical rows expose rating, efficiency, Voc/Isc or MPPT/max voltage, storage capacity/power and warranty without consumer-shopping-card styling.

### 08 Economics
- Preserves Investment, Annual Savings, Payback, ROI, IRR, NPV and cumulative cash flow.
- Makes the relationship to the current 12.80 kWp project scenario explicit.
- Added a compact assumptions panel with system size, production, baseline, offset, degradation and analysis horizon.
- Values remain mock; no financial engine was added.

### 09 Proposal
- Reworked preview to read as a professional solar proposal document rather than app cards.
- Includes strong cover, system summary, production, economics, equipment and terms.
- Remains in-app preview only; no PDF generation/export was implemented.

## Code structure after R0.1
- `src/App.tsx` — routes only.
- `src/data.ts` — R0 mock project/catalog/scenario data.
- `src/components/Shell.tsx` — global application shell/navigation.
- `src/components/ProjectContext.tsx` — project context and workflow strip.
- `src/components/Charts.tsx` — consumption and cash-flow charts.
- `src/components/EquipmentCard.tsx` — compact technical equipment row.
- `src/components/ProposalDocument.tsx` — proposal document sections.
- `src/components/SolarDesigner.tsx` — interactive 2D solar design workspace.
- `src/pages/*` — route-level screens.

## What functions in R0.1
- Navigation across all nine requested routes.
- New Project three-step UI with editable mock values.
- Consumption history visualization and CFE source-document workflow surface.
- Solar Designer module placement/selection/multi-selection/erase/delete, portrait-landscape, layers, zoom, pan nudge, undo and redo.
- Equipment tabs and selection state.
- Economics chart and scenario view.
- Proposal section/document preview.

## Mock / illustrative behavior
- Authentication is mock only.
- All project/customer/CFE/equipment/scenario data is mock data.
- CFE bill upload does not parse files.
- Site imagery, roof geometry, setbacks, irradiance/shading and stringing are illustrative 2D visuals; there is no map/geospatial or electrical validation engine.
- Energy production, savings, ROI, IRR and NPV are illustrative R0 values.
- Proposal export/PDF functionality is intentionally not implemented.

## Libraries
- React
- TypeScript
- Vite
- React Router
- Recharts
- Lucide React
- Playwright (R0 visual capture only)

## Visual validation
The R0 visual workflow builds the application, launches Vite preview, opens all nine routes in Chromium and captures every screen at a consistent **1600 × 1000** viewport. Screenshots overwrite/update `artifacts/screenshots/r0/`.

## Run locally
```bash
npm install
npm run dev
```

Production validation:
```bash
npm run build
npm run preview
```

Reproduce screenshots while preview is running on port 4173:
```bash
npx playwright install chromium
npm run capture:r0
```

## Known R0.1 limitations
- No backend or persistence; refresh resets interaction state.
- Designer geometry is illustrative and not geospatially/electrically validated.
- Responsive behavior below approximately 1280 px is outside this desktop-first milestone.
- No R1 capabilities are present: no AI, advanced CRM, automations, WhatsApp, forecasting, Google Solar, complex financial engine or backend architecture.

## Stop condition
R0.1 stops after build + nine-screen browser validation + regenerated screenshots + this review update. Do not begin R1 until explicit authorization is given after visual review.
