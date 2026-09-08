# R3 Review — Electrical Design & Energy Simulation Core

## Milestone status

R3 implements the first deterministic electrical-design and monthly energy-simulation layer on top of the accepted R2 geometry. R2 `ModulePlacement` records remain the authoritative physical source for which modules exist in the design; R3 does not invent or duplicate roof capacity.

R3 scope is intentionally limited to strings, inverter/MPPT topology, electrical compatibility checks, an editable planning resource profile, deterministic monthly/annual production, annual energy offset, persistence, Workspace integration and browser-verifiable engineering states. R4 functionality was not started.

## Architecture

The R3 domain is isolated under `src/domain/electrical/`:

- `types.ts` — typed electrical, string, MPPT, resource, production and validation models.
- `catalog.ts` — local fixture module/inverter catalog.
- `calculations.ts` — DC capacity, DC/AC ratio, cold Voc, string voltage/current and MPPT-current aggregation.
- `validation.ts` — deterministic electrical validation and severity/state derivation.
- `autoString.ts` — deterministic first-pass string assignment.
- `production.ts` — monthly/annual production and multiplicative loss model.
- `store.ts` — project-local browser persistence.
- `electrical.test.ts` — deterministic R3 unit tests.

UI integration is separated into:

- `SolarDesignerR3.tsx` — Geometry / Electrical / Production workspace tabs.
- `ElectricalDesigner.tsx` — electrical canvas, string/MPPT tools, validation and production UI.
- `Workspace.tsx` — surfaced R3 engineering state and production outputs.

`App.tsx` remains route-only.

## R2 geometry as the source of truth

R3 reads the accepted R2 `SiteDesign.layout.placements` collection. Each placed module ID becomes the universe that may be assigned to strings. R3 does not create additional electrical-only modules and does not silently force the R1 target count.

Derived installed DC capacity is:

```text
installedDcKwp = placedModuleCount × selectedModulePmaxW / 1000
```

The electrical module rating and the R2 physical module dimensions remain separate concepts. Selecting a different electrical fixture does not infer or rewrite physical width/height.

## Fixture equipment catalog

R3 contains a deliberately local mock/fixture catalog so the engineering workflow can be tested without claiming manufacturer certification or live product data.

Module fixtures contain: manufacturer/model labels, Pmax, Voc, Vmp, Isc, Imp, Voc temperature coefficient, Pmax temperature coefficient and maximum system voltage.

Inverter fixtures contain: rated AC power, optional recommended/max DC input power, maximum DC voltage, MPPT count, inputs per MPPT, MPPT voltage range, startup voltage, operating-current limit, optional short-circuit-current limit and efficiency values.

The UI explicitly labels the catalog as fixture/mock data and makes no certification claim.

## Strings and MPPT topology

A `StringCircuit` contains a stable ID, name, color index, ordered module IDs, inverter instance ID and MPPT index. Modules on the R2 canvas are rendered with string color/label or `U` when unassigned.

The user can:

- create and delete strings;
- multi-select placed modules from the electrical canvas;
- assign selected modules to a string;
- unassign selected modules;
- map a string to an MPPT;
- inspect string Voc, cold Voc, Vmp, Imp and Isc;
- run deterministic Auto-string.

When assigning modules manually, assignment to the active string removes those module IDs from the other strings so the normal UI does not intentionally create duplicate active assignments. The validation engine still detects duplicate assignments if persisted/imported state contains them.

## Electrical formulas

For a string with `N` identical modules:

```text
Voc_STC_string = N × Voc_module
Vmp_string     = N × Vmp_module
Imp_string     = Imp_module
Isc_string     = Isc_module
```

Cold open-circuit voltage uses the explicit minimum design temperature and the editable Voc temperature coefficient:

```text
betaVoc = tempCoeffVocPctPerC / 100
Voc_cold_module = Voc_STC_module × (1 + betaVoc × (Tmin - Tstc))
Voc_cold_string = N × Voc_cold_module
```

For parallel strings assigned to the same MPPT, operating and short-circuit currents are summed by active string:

```text
Imp_mppt = Σ Imp_string
Isc_mppt = Σ Isc_string
```

DC/AC ratio is:

```text
DC_AC_ratio = installedDcKwp / totalInverterRatedAcKw
```

No cable, conductor, breaker, fuse or voltage-drop sizing is performed in R3.

## Electrical validation

Validation is deterministic and returns `error`, `warning` or `info` issues. The visible aggregate state is one of:

- `Electrically valid`
- `Valid with warnings`
- `Electrical errors`

Implemented checks include:

- no inverter selected;
- R1/R2 basis module wattage mismatch warning;
- duplicate module assignment;
- placed but unassigned modules;
- empty strings;
- strings without inverter/MPPT mapping;
- missing referenced inverter;
- cold string Voc above inverter maximum DC voltage;
- string Vmp outside inverter MPPT range;
- string Vmp below startup voltage;
- invalid MPPT index;
- too many strings for MPPT input count;
- aggregate MPPT operating current above limit;
- aggregate MPPT Isc above optional short-circuit-current limit.

Changing module, inverter, string membership, MPPT mapping or minimum design temperature recalculates the affected validation state immediately.

## R1 design-basis mismatch behavior

The R1/R2 basis wattage remains visible as a reference. If the selected electrical module Pmax differs from that basis, R3 emits `basis-module-mismatch` as a warning rather than silently mutating the accepted sizing/design basis.

## Deterministic Auto-string

Auto-string is intentionally a first-pass deterministic allocator, not an optimization solver.

For the first inverter instance it calculates:

```text
maxModulesByColdVoc = floor(inverterMaxDcVoltage / coldVocPerModule)
maxModulesByMpptV   = floor(mpptMaxVoltage / moduleVmp)
maxModulesPerString = min(maxModulesByColdVoc, maxModulesByMpptV)

minModulesPerString = ceil(max(mpptMinVoltage, startupVoltage) / moduleVmp)
```

It then walks the R2 placement IDs in stable order and fills inverter input slots sequentially, grouping inputs by MPPT. The same inputs produce the same string count, memberships and MPPT mapping.

Known limitation: this is not a global optimization algorithm and does not optimize roof grouping, cable routing, inverter quantity, MPPT balancing, clipping or economics.

## Production/resource model

R3 includes a 12-month editable Mexico planning fixture expressed as monthly specific-yield inputs in `kWh/kWp`. It is explicitly labeled as example/fixture data and is not presented as live satellite, irradiance or weather-provider data.

Editable production assumptions are:

- soiling;
- mismatch;
- wiring;
- availability;
- user-entered shading placeholder;
- year-1 degradation;
- inverter efficiency.

Loss factors are combined multiplicatively rather than simply added:

```text
remainingLossFactor =
  (1 - soiling) ×
  (1 - mismatch) ×
  (1 - wiring) ×
  (1 - availability) ×
  (1 - userShading) ×
  (1 - year1Degradation)
```

Monthly production is:

```text
monthlyProductionKwh =
  placedDcKwp ×
  monthlySpecificYieldKwhPerKwp ×
  remainingLossFactor ×
  inverterEfficiency
```

Annual production is the sum of the 12 monthly results. Derived annual specific yield is:

```text
annualSpecificYield = annualProductionKwh / placedDcKwp
```

Annual energy offset is:

```text
energyOffsetPct = annualProductionKwh / annualConsumptionKwh × 100
```

The Production view compares monthly production against the latest 12 CFE consumption entries and displays monthly energy surplus/deficit.

### Important interpretation limit

The comparison is an **energy-balance planning estimate only**. It is not an hourly self-consumption simulation, does not calculate grid import/export, and does not perform CFE tariff/billing/savings simulation. The UI states this explicitly.

## Persistence

Full R3 electrical/resource state is saved in browser `localStorage` by project under:

```text
solar-platform-v2:r3:electrical:SOL-2026-0184
```

Persisted content includes selected module spec, inverter instances, strings and MPPT assignments, temperature assumptions, loss assumptions and the editable monthly resource profile. Browser validation confirms the string/electrical state survives refresh.

R2 geometry persists independently under its existing R2 project key; R3 reads it rather than replacing it.

## Workspace integration

The Project Workspace now exposes real R3-derived values:

- placed DC kWp;
- inverter AC kW;
- DC/AC ratio;
- electrical validity state;
- assigned / placed module count;
- annual production;
- specific yield;
- annual energy offset;
- resource and temperature assumptions.

It does not expose R4 billing/economics or cable/protection calculations.

## Tests actually executed

Final successful GitHub Actions R3 workflow: **run `34187911129`**.

Commands executed by the workflow:

```text
npm install
npm test
npm run build
npx playwright install --with-deps chromium
npm run preview -- --host 127.0.0.1
npm run validate:r3
npm run capture:r3
```

Final deterministic test result:

```text
3 test files passed
51 / 51 tests passed
- R1 energy: 16
- R2 design geometry: 16
- R3 electrical/production: 19
```

R3 tests cover installed DC, DC/AC, string voltage/current, temperature-corrected Voc, max-voltage error, MPPT voltage error, parallel-current/input limits, duplicate assignment, unassigned modules, deterministic auto-string, unique assignment, persistence, monthly production, annual sum, multiplicative losses, specific yield, annual energy offset, recalculation and MPPT catalog constraints.

## Production build result

`npm run build` succeeded with TypeScript + Vite.

Observed successful build:

```text
Vite 8.2.2
2465 modules transformed
CSS: 46.69 kB (10.69 kB gzip)
JS: 730.12 kB (214.56 kB gzip)
```

Vite reports a non-blocking advisory that the main JavaScript chunk is larger than 500 kB after minification. Code splitting is an optimization concern, not an R3 correctness failure, and was not used as justification to expand this milestone.

## Production browser validation

`npm run validate:r3` passed in Chromium against the production Vite preview.

The browser completion pass actively verified:

1. R2 placed modules are the source of R3 capacity.
2. unassigned-module state is visible.
3. Auto-string assigns all 24 seeded modules and reaches a valid electrical state.
4. string electrical inspector displays cold Voc.
5. MPPT reassignment works.
6. extreme cold design temperature creates `cold-voc-high`.
7. selecting a 585 W fixture against the 640 W basis creates `basis-module-mismatch`.
8. selected module/string state persists across refresh.
9. monthly production recalculates when resource/loss assumptions change.
10. the energy-balance disclaimer prevents self-consumption/billing overclaiming.
11. Workspace receives R3 electrical and production outputs.

Final browser output:

```text
R3 browser validation passed: R2 capacity source, stringing/MPPT, electrical validation, basis mismatch, persistence, production recalculation and Workspace integration.
```

## Final screenshot evidence

All required browser states were generated at 1600 × 1000 from the final successful production-preview flow and committed by workflow commit `00ce6a2` under `artifacts/screenshots/r3/`:

- `electrical-unassigned.png`
- `string-assignment.png`
- `mppt-assignment.png`
- `electrical-valid.png`
- `electrical-error-voc.png`
- `electrical-error-current.png`
- `auto-string.png`
- `production-monthly.png`
- `consumption-vs-production.png`
- `workspace-r3.png`

The capture script reported `Captured 10 final R3 browser states.`

## Libraries and implementation tradeoffs

No new runtime geometry/electrical calculation library was introduced for R3. The milestone uses the existing React + TypeScript + Vite stack and pure TypeScript domain functions. Browser validation/capture uses the existing Playwright development dependency and deterministic tests use Vitest.

Observed CI tool versions include Node 22.23.2, npm 10.9.8, Vite 8.2.2 and Vitest 5.0.0. `package.json` currently declares application/development packages with `latest`; the repository does not currently commit a `package-lock.json`, so exact dependency pinning/reproducible lockfile governance remains a project-level packaging concern rather than an R3 feature.

Relevant licensing implication: R3 adds no third-party electrical/solar proprietary database or simulation engine. Fixture equipment values are local project test data, not vendor-certified records.

## Known R3 limitations

- local-browser persistence only; no production backend or multi-user synchronization;
- one primary inverter instance is exposed in the current UI/auto-string path even though the model is instance-oriented;
- Auto-string is sequential and deterministic, not an optimization solver;
- no inverter clipping model or detailed conversion-efficiency curve;
- no module thermal model beyond temperature-corrected Voc for electrical validation;
- no bifacial gain, spectral, IAM or transposition model;
- resource profile is editable fixture data, not a weather/irradiance provider;
- user-entered shading is only an explicit percentage placeholder, not physical shading calculation;
- monthly energy balance is not hourly self-consumption;
- no grid import/export or billing engine;
- no cable/protection/voltage-drop calculations;
- no single-line diagram;
- no batteries.

## Explicit R4+ deferrals

The following were deliberately **not** implemented in R3:

- cable sizing and conductor ampacity;
- breakers, fuses and protection coordination;
- voltage-drop calculations;
- single-line diagram;
- full 8760/hourly production simulation;
- external weather/irradiance provider integration;
- true physical 3D/shading calculation;
- batteries/storage dispatch;
- advanced economics, CFE billing and savings simulation;
- proposal/PDF generation;
- AI/OCR;
- production backend and multi-user synchronization.

## Stop condition

R3 delivers a deterministic chain:

```text
R2 placed modules
→ module + inverter fixture selection
→ strings + MPPT mapping
→ electrical validation
→ installed DC / inverter AC / DC-AC
→ editable monthly resource + explicit losses
→ monthly/annual production
→ annual energy offset vs CFE consumption
→ Workspace summary
```

No R4 functionality was started. R3 stops here for review.
