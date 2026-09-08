# R0 — Product Shell Review

## Scope
R0 is a frontend-only product shell for a professional solar-project platform in Mexico. It was built from scratch for `solar-platform-v2`; no SolarERP code, frontend, assets, or architecture were migrated.

## Implemented screens and routes

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

## What works in R0
- Navigation across all nine requested screens.
- Persistent project context and internal workspace navigation: Overview, Consumption, Design, Equipment, Economics, Proposal.
- New Project three-step UI flow with editable mock fields.
- Consumption energy profile with CFE tariff context, monthly history, chart and a mock bill-upload surface.
- Equipment selector for panels, inverters and batteries with realistic mock specifications and selection state.
- Economics summary with investment, savings, payback, ROI, IRR, NPV and cumulative cash-flow chart.
- Proposal preview with nine document sections and section navigation.
- Solar Designer mock interactions: tool selection, module placement, module selection, Shift multi-select, erase, delete selected, portrait/landscape orientation, obstacles toggle, setbacks toggle, strings toggle, heatmap toggle, zoom, undo and redo.
- Solar Designer bottom metrics react to module count.

## Mock / illustrative behavior
- Authentication is mock-only.
- All project/customer data is mock data.
- CFE bill upload does not parse a document.
- Satellite/map imagery and roof geometry are synthetic CSS/SVG visuals; no map provider is connected.
- Irradiance heatmap, shade loss, roof measurements and string paths are illustrative.
- Equipment catalog is mock data and is not connected to manufacturer APIs/catalog services.
- Energy production, offset, savings, ROI, IRR and NPV are illustrative R0 values, not an engineering or financial calculation engine.
- Proposal is an in-app preview only; PDF export/share buttons are visual placeholders.

## Libraries
- React
- TypeScript
- Vite
- React Router
- Recharts
- Lucide React
- Playwright, used only for R0 visual capture

## UX decisions
- Desktop-first shell designed for approximately 1280–1920 px.
- Projects is the primary global area; future Customers, Equipment and Operations are visible but inactive in R0.
- The project workspace keeps solar-specific context visible instead of behaving like a generic CRM record.
- Solar Designer uses the largest working surface, a compact tool rail, property inspector and persistent engineering metrics.
- Information density is concentrated where useful; large generic dashboard cards and oversized navigation were deliberately avoided.
- Neutral technical palette with restrained green accents keeps status and actions legible without making the interface decorative.

## Limitations / known issues
- R0 has no backend or persistence; browser refresh resets interaction state.
- Designer geometry is not geospatially accurate and does not perform collision/setback/string electrical validation.
- Responsive behavior below ~1280 px is not a target for this milestone.
- Fonts are requested from Google Fonts at runtime; system fallbacks are used if unavailable.
- No R1 features (AI, advanced CRM, automations, WhatsApp, forecasting, Google Solar, complex financial calculations or backend architecture) are included.

## Run locally
```bash
npm install
npm run dev
```
Open the URL printed by Vite (normally `http://localhost:5173`).

For a production build:
```bash
npm run build
npm run preview
```

To reproduce the R0 screenshots after preview is running on port 4173:
```bash
npx playwright install chromium
npm run capture:r0
```
Screenshots are written to `artifacts/screenshots/r0/`.

## R0 stop condition
This repository stops at R0. No R1 work should begin until the nine screenshots have been visually reviewed and the next milestone is explicitly authorized.
