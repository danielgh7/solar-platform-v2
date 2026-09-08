# R1 — CFE Consumption & Sizing Engine Review

## Milestone scope
R1 implements the first deterministic engineering layer of `solar-platform-v2` for Mexico/CFE workflows:

**Project → CFE consumption → normalized annual profile → sizing objectives → recommended PV scenarios → handoff to Design**

R1 was built from the accepted R0.1 shell. No SolarERP code, assets or architecture were used. No R2 geometry, maps, shading, electrical validation, hourly simulation, batteries, advanced economics, PDF proposal generation, AI/OCR or production backend was added.

## Architecture
`src/App.tsx` remains route-only. R1 calculation and validation logic lives outside JSX.

### Domain layer
- `src/domain/energy/types.ts`
  - typed CFE/project-energy models
  - `ProjectEnergyProfile`
  - `CfeService`
  - `BillingPeriod`
  - `TariffCode`
  - `ConsumptionEntry`
  - `DemandEntry`
  - `PowerFactorEntry`
  - `ConsumptionSource`
  - `ConsumptionValidation`
  - `SizingObjective`
  - `SizingScenario`
- `src/domain/energy/metrics.ts`
  - annual/average/peak/low/seasonality/bill/rate/demand/PF derived metrics
- `src/domain/energy/validation.ts`
  - deterministic data-quality checks
- `src/domain/energy/csv.ts`
  - CSV template and deterministic parser
- `src/domain/energy/sizing.ts`
  - pure annual energy-balance sizing functions and scenario generation
- `src/domain/energy/store.ts`
  - browser `localStorage` persistence and React state adapter

### UI integration
- `src/pages/Consumption.tsx`
  - manual 12–24 month editing
  - tariff-family-aware fields
  - CSV import
  - source-document metadata shell
  - Data Quality
  - real derived metrics/charts
  - sizing objectives and scenarios
- `src/pages/Workspace.tsx`
  - consumes persisted R1 profile and selected scenario
- `src/components/SolarDesigner.tsx`
  - receives the persisted selected design basis; R0.1 roof scene remains illustrative

### Validation tooling
- `src/domain/energy/energy.test.ts` — deterministic unit tests
- `scripts/validate-r1.mjs` — production-preview browser completion validation
- `scripts/capture-r1.mjs` — real browser-state screenshot generation at 1600×1000
- `.github/workflows/r1-validation.yml` — installs, tests, builds, launches preview, browser-validates and captures R1 evidence

## Supported CFE tariffs
Initial workflow support:
- 1
- 1A
- 1B
- 1C
- 1D
- 1E
- 1F
- DAC
- PDBT
- GDBT
- GDMTO
- GDMTH

Tariff-family behavior in R1:
- Residential: energy, billing amount, billing period/service context.
- PDBT/GDBT commercial low-voltage family: energy/billing workflow without demand fields.
- GDMTO/GDMTH demand family: energy plus demand and power-factor fields/trends/context.

R1 intentionally does not reproduce every historical CFE tariff charging rule.

## Consumption entry workflows
### Manual
- Minimum sizing requirement: 12 usable months.
- Up to 24 editable periods.
- Editable `period`, `kWh`, and `amount_mxn`.
- Demand and PF fields appear for GDMTO/GDMTH.
- Totals and validation update from the current state.
- Browser persistence survives refresh through `localStorage`.

### CSV
Documented columns:
- Required: `period`, `kwh`
- Optional/contextual: `amount_mxn`, `demand_kw`, `power_factor`

The app includes a downloadable template and validates before applying imported data. Invalid imports do not silently replace the current profile.

### CFE bill source document
PDF/image upload stores client-side metadata only:
- filename
- MIME type
- size
- upload timestamp
- status

Supported states include `pending manual extraction`, `manually entered`, and `validated`. Upload can be replaced or removed. R1 makes no OCR/AI parsing claim.

## Deterministic Data Quality rules
The current validation layer flags:
- fewer than 12 usable months
- duplicate periods
- unsupported `YYYY-MM` period format
- invalid/negative kWh
- zero-consumption anomaly
- invalid/negative billed amount
- missing chronological periods
- extreme month-to-month jumps
- unusable annual total
- missing demand on GDMTO/GDMTH
- invalid PF outside `(0, 1]`
- low PF warning below 0.90

Issue severities are `error`, `warning`, and `info`.

Overall status:
- **Incomplete** — blocking structural/required-field errors
- **Needs review** — non-blocking warnings/anomalies
- **Ready for sizing** — deterministic checks pass

The UI does not silently treat an invalid profile as complete.

## Derived annual profile metrics
Derived from the entered/imported state:
- annual kWh
- average monthly kWh
- peak month
- lowest month
- seasonality context
- annual billed amount when present
- blended MXN/kWh when amount is present
- peak demand when applicable
- average/minimum PF when applicable

Charts use the current persisted project profile rather than R0 static consumption values.

## Sizing objectives
Selectable R1 objectives:
- 50% offset
- 70% offset
- 80% offset
- 90% offset
- 95% offset
- 100% offset
- Custom offset
- Maximize savings — explicitly implemented in R1 as a **100% annual energy-offset proxy**, not an economics optimizer
- Minimize initial system size — explicitly implemented as the lowest supported R1 objective, **50% annual offset**

These two named objectives are deliberately honest placeholders within the R1 annual-energy model. No hourly/economic optimization is implied.

## Sizing formula
R1 uses transparent annual energy balance.

Given:
- `annualConsumptionKwh`
- `targetOffset`
- `panelWattage`
- `specificYield`
- `lossFactor`
- `designMargin`

The engine calculates:

```text
targetEnergy = annualConsumptionKwh × targetOffset / 100
effectiveYield = specificYield × lossFactor
requiredDcKwp = targetEnergy / effectiveYield
requiredWithMargin = requiredDcKwp × (1 + designMargin / 100)
panelKw = panelWattage / 1000
panelCount = ceil(requiredWithMargin / panelKw)
resultingDcKwp = panelCount × panelKw
annualProduction = resultingDcKwp × effectiveYield
achievedOffset = annualProduction / annualConsumptionKwh × 100
```

Default project assumptions:
- panel wattage: 640 W
- specific yield: 1,632 kWh/kWp/year
- loss factor: 1.00
- design margin: 0%

The UI explicitly states that a `1.00` loss factor means losses are assumed embedded in the specific-yield input so they are not double-counted.

## Sizing scenarios
Three deterministic scenarios are generated from the same profile:
- Conservative
- Recommended
- Maximum coverage

Each displays:
- target offset
- panel count
- DC kWp
- estimated annual production
- achieved offset
- target delta
- assumption context

A scenario can be selected as **Current Design Basis** and is persisted.

## Workspace and Designer handoff
Workspace reads the real R1 state and displays:
- CFE tariff
- annual consumption
- Data Quality status
- selected sizing scenario
- target panel count
- target DC kWp
- target/achieved offset and expected production

Consumption is considered complete for workflow progression only when Data Quality is `Ready for sizing` and a scenario is selected.

Solar Designer receives the selected basis and shows a banner such as:

`Design basis: [panel count] × 640 W · [DC kWp] kWp · target 95% offset`

The handoff is persisted across refresh. Designer geometry remains the R0.1 illustrative 2D scene; no R2 roof-layout logic was added.

## Tests actually run
Final GitHub Actions R1 completion run: `R1 validation` run #8.

### Deterministic unit tests
Command:
```bash
npm test
```
Result:
- 1 test file passed
- **16/16 tests passed**

Coverage includes:
- 12-month annual total
- missing month detection
- duplicate month detection
- invalid PF
- demand-required tariff validation
- valid CSV import
- invalid CSV numeric handling
- sizing at 50/70/80/90/95/100%
- upward panel-count rounding
- recalculation from panel wattage/specific yield changes
- persistence round-trip

### Production build
Command:
```bash
npm run build
```
Result: **success** (`tsc -b && vite build`).

Vite emits a non-blocking bundle-size advisory because the current single application chunk exceeds 500 kB after minification. This does not indicate broken R1 behavior; code-splitting is an optimization concern and was not used to expand this milestone.

### Browser completion validation
Production preview was launched and `scripts/validate-r1.mjs` passed.

Verified in Chromium against the built preview:
- persistence survives refresh
- 12 → 24 month manual editing and 24-month cap
- residential tariff hides demand/PF
- GDMTH exposes demand/PF
- invalid PF blocks sizing readiness
- invalid CSV reports errors
- valid CSV imports as validated source
- source PDF/image metadata upload
- source replace
- source remove
- Data Quality state transitions
- 50/70/80/90/95/100 objectives
- custom offset
- Maximize savings placeholder objective
- Minimize initial size objective
- scenario selection as Current Design Basis
- Workspace propagation
- Designer handoff
- selected design basis survives refresh

Final browser validation result: **passed**.

## R1 screenshots
Generated from the real production preview at 1600×1000 and stored in `artifacts/screenshots/r1/`:
- `consumption-manual.png`
- `consumption-validation.png`
- `consumption-csv.png`
- `consumption-commercial.png`
- `sizing-scenarios.png`
- `workspace-r1.png`
- `designer-handoff.png`

The validation/CSV/commercial/sizing screenshots are produced after browser interactions. Workspace and Designer screenshots use the same persisted browser context after selecting the Recommended 95% sizing basis, proving downstream propagation rather than depicting fabricated static images.

## Known R1 limitations
- Persistence is local-browser only; there is no production backend or multi-user synchronization.
- CFE bill ingestion stores file metadata only; file bytes are not a production document repository.
- No AI/OCR extraction.
- Tariff support is workflow/context validation, not a full CFE historical billing-rate engine.
- Sizing is annual energy balance, not hourly simulation.
- No irradiance API, geocoding or weather-year simulation.
- Specific yield is an explicit engineering assumption entered by the user.
- R0.1 Designer geometry remains illustrative and does not auto-fit the selected target panel count.
- No electrical/string validation, inverter sizing engine, battery model or production economics engine in R1.

## Explicit R2+ deferrals
Still deferred exactly as specified by Issue #2:
- real roof geometry
- geocoding/maps
- satellite imagery
- auto-layout on roof polygons
- shading engine
- strings/electrical validation
- hourly energy simulation
- batteries
- advanced economics
- PDF proposal generation
- AI/OCR CFE parsing
- production backend architecture

## Completion status
R1 completion pass satisfies the Issue #2 verification requirements: deterministic tests and build pass, production browser validation passes, persistence/tariff/manual/CSV/document/Data Quality/sizing/downstream flows are exercised, all seven required screenshots are present, and this review documents the implemented architecture and limits.

**Stop condition:** R1 stops here for review. R2 has not started.
