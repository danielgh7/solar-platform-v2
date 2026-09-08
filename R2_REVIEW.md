# R2 — Solar Designer Core Review

## Status

R2 implements the first geometry-aware Solar Designer core for `solar-platform-v2` and is intentionally limited to deterministic 2D site/roof geometry, blocked regions, physical module placement, layout capacity and comparison against the selected R1 design basis.

R2 does **not** use SolarERP and does **not** begin R3.

## Product question answered by R2

Given the selected R1 sizing basis, R2 can now answer with deterministic geometry:

- what roof geometry exists;
- what roof area is gross and usable after edge setbacks / restricted zones;
- where obstructions and no-module regions exist;
- whether a physical PV module can be placed at a requested location;
- how many modules fit under the current deterministic fill assumptions;
- where those modules are placed;
- how placed/capacity DC power compares with the R1 target.

## Architecture

`App.tsx` remains route-only. Geometry logic is separated from rendering under `src/domain/design/`.

Primary R2 modules:

- `types.ts` — typed persistent domain entities (`SiteDesign`, `RoofPlane`, points, obstructions, restricted zones, module placements/layout, dimensions, camera/layers/selection).
- `math.ts` — polygon area, point-in-polygon, segment intersection, self-intersection detection, polygon offset, rectangle containment/overlap, snapping and translation.
- `transforms.ts` — deterministic screen ↔ world coordinate conversion.
- `collision.ts` — usable-roof calculation and placement validation against boundaries, setbacks, blocked geometry and every other module.
- `layout.ts` — deterministic first-pass module auto-layout.
- `summary.ts` — geometry/layout derived KPIs and R1 target delta state.
- `store.ts` — project-scoped browser persistence.
- `history.ts` — pure history helpers used/tested for representative undo/redo behavior.
- `components/SolarDesigner.tsx` — SVG canvas interaction/UI wired to the domain layer.

No third-party polygon/geometry engine was introduced in R2. The geometry implementation is custom TypeScript plus SVG rendering to keep the milestone small, inspectable and deterministic.

## World-coordinate system

The Designer operates in world coordinates measured in meters rather than CSS pixel positions. The default R2 world is `30 × 20` design units/meters.

The camera stores zoom and pan independently from geometry. Roof vertices, obstruction geometry and module positions remain world coordinates when the viewport or camera changes.

### Screen ↔ world transforms

`transforms.ts` uses the viewport dimensions and world dimensions to derive independent X/Y scale factors:

- `sx = viewport.width / world.width × zoom`
- `sy = viewport.height / world.height × zoom`

World → screen:

- `screenX = worldX × sx + panX`
- `screenY = worldY × sy + panY`

Screen → world:

- `worldX = (screenX - panX) / sx`
- `worldY = (screenY - panY) / sy`

A deterministic round-trip unit test verifies that a point converted world → screen → world returns to the original world coordinate under non-default pan/zoom.

The interactive SVG also converts pointer coordinates into the same fixed 30×20 world and applies snap before geometry operations. Browser validation confirms pan changes camera state without changing stored roof geometry.

## Roof polygon model

A roof is a persistable `RoofPlane` with stable ID, polygon points, name, azimuth, tilt, roof type and edge setback.

R2 supports:

- click-point roof creation;
- polygon close;
- selection;
- vertex dragging;
- whole-roof movement;
- practical vertex insert/remove controls;
- deletion;
- editable name, azimuth, tilt and roof type;
- computed gross area.

### Area

Polygon area uses the shoelace formula. `signedPolygonArea` preserves winding direction while `polygonArea` returns absolute square-meter area.

### Roof validation

Roof creation/editing handles:

- fewer than 3 vertices: not accepted as a roof;
- near-zero area: rejected;
- self-intersection: detected from pairwise non-adjacent segment intersections and rejected/rolled back;
- invalid vertex drag: rolled back to the pre-drag geometry.

The data model supports multiple roof planes even though the first-pass R2 UX is optimized around one active/default roof.

## Setback / buffer implementation

Each roof stores an edge setback distance in meters. `offsetPolygon()` creates an inward offset polygon by:

1. determining polygon winding;
2. shifting each edge inward by the configured perpendicular distance;
3. intersecting adjacent shifted edge lines to create the inset polygon vertices.

The resulting polygon is the usable roof boundary used by placement validation and is rendered as the visible setback boundary.

### Known setback limitations

This is a deliberately lean first-pass offset, not a full computational-geometry buffer engine. It is defensible for ordinary simple roof polygons but has known limitations for highly concave polygons, extreme setback distances, very acute corners and cases where a mathematical offset should split into multiple polygons or collapse portions of the shape. Those cases require a robust polygon-buffer library/engine in a later hardening milestone if needed.

R2 does not claim code/fire setback compliance; setback distance is an editable geometric design assumption only.

## Obstructions and restricted zones

R2 supports real blocked geometry:

- rectangular obstructions with type/name/height placeholder and dimensions;
- polygon restricted/no-module zones;
- selectable, movable and deletable blocked regions;
- persisted geometry.

Manual and automatic module placement rejects overlap with either an obstruction polygon or a restricted-zone polygon.

Collision uses polygon containment/intersection checks. Touching/intersecting segment boundaries are treated as overlap by the current deterministic rules.

## Module physical model

Electrical rating and physical size are separate.

R1 supplies the authoritative target panel rating (current basis: 640 W). R2 separately stores editable physical assumptions:

- module width in meters;
- module height in meters;
- module gap;
- optional row spacing;
- snap-grid size.

Default physical module assumptions are 1.13 m × 2.28 m.

Orientation changes dimensions deterministically:

- portrait → width × height;
- landscape → height × width.

R2 does not infer dimensions from wattage.

## Manual module placement rules

The Modules tool places a rectangle in world coordinates using the selected physical dimensions/orientation and snap grid.

A candidate is accepted only when:

1. its full rectangle is inside the roof's usable inset polygon;
2. it does not overlap any obstruction;
3. it does not overlap any restricted zone;
4. it does not overlap any other module.

Invalid placement is not persisted and provides explicit feedback such as outside usable roof, obstruction overlap, restricted-zone overlap or module overlap.

Selection supports single and Shift multi-select. Selected modules can be moved, deleted and batch-oriented. Movement is validated before commit; invalid movement rolls back.

Duplicate is collision-safe after the final R2 completion fix: placement validation no longer ignores other selected/original modules. A duplicate must find/use a collision-free placement or be rejected rather than creating overlap.

Undo/redo covers representative module additions, moves/orientation/layout changes through the Designer's snapshot history.

## Deterministic auto-layout

R2 provides:

- Auto-fill portrait;
- Auto-fill landscape;
- Clear layout.

The algorithm is a transparent first-pass grid scan, not an optimization solver. Given the same roof, inset, physical dimensions, orientation, gaps/row spacing and blocked geometry, it produces stable positions/count.

Candidate modules are generated on deterministic increments inside the roof bounds and are accepted only through the same placement validation rules used for manual placement. Therefore auto-layout respects:

- the usable roof after setback;
- obstruction geometry;
- restricted zones;
- module-to-module non-overlap.

### Auto-layout limitations

R2 does not optimize for maximum packing across arbitrary polygons, mixed orientations, roof-edge rotation, multiple independent subarrays, shade, electrical topology or constructability. It is intentionally a predictable first-pass capacity/layout algorithm.

## R1 target vs physical capacity

The selected R1 Current Design Basis remains authoritative for the sizing target. R2 persists the basis reference and displays:

- target panel count;
- target DC kWp;
- target offset;
- placed panel count;
- placed DC kWp;
- panel/DC delta;
- layout status: Under target / On target / Over target.

R2 does not force the roof to match the target. If physical geometry cannot fit the R1 target, the Designer shows the capacity/shortfall rather than silently changing either the roof result or the R1 basis.

## Geometry-aware KPI bar

The R2 KPI bar is derived from actual R2 state and includes:

- roof gross area;
- usable area;
- placed modules;
- current roof capacity under fill assumptions;
- placed DC kWp;
- target DC kWp;
- target delta;
- layout status.

Legacy irradiance, specific-yield, shade-loss and production values are not presented as R2-computed engineering results.

## Inspector

Inspector content is selection-aware.

Roof selection exposes name, gross area, azimuth, tilt, roof type and setback.

Module selection exposes physical/electrical identity, dimensions, orientation, design position, rotation and validity context.

Obstruction/restricted selection exposes blocked-geometry metadata/dimensions/area where applicable.

Module multi-select exposes selected count, aggregate DC power and batch orientation/delete behavior.

## Layers

R2 includes compact visibility controls for roofs, setbacks, modules, blocked geometry, grid/snap and labels. No engineering shading heatmap is claimed by R2.

## Persistence

The full R2 `SiteDesign` is serialized to browser storage per project. Persisted state includes:

- roof polygons/properties;
- setbacks;
- obstructions and restricted zones;
- module physical assumptions;
- module placements/layout settings;
- layers/camera settings;
- selected R1 design-basis reference.

The project key for the current fixture is `solar-platform-v2:r2:site-design:SOL-2026-0184`.

Production-browser validation reloads the page and verifies final roof/module geometry survives refresh.

## Undo / redo

The UI maintains in-session `past` and `future` snapshots around committed edits. Representative operations covered include roof creation/editing, setback updates, blocked-geometry changes, module operations and auto-layout/clear layout.

History intentionally does not persist across browser reload in R2.

Pure history helpers are also unit-tested with a representative geometry edit round trip.

## Libraries / versions / licensing notes

R2 preserved the existing React + TypeScript + Vite application and used native SVG for the geometry canvas. No Turf, JSTS, polygon-clipping, Konva, Fabric or other geometry/rendering dependency was added.

`package.json` currently declares application/development packages using the `latest` tag rather than pinned versions and there is no committed `package-lock.json`. Therefore dependency resolution is not fully reproducible by exact package version from the repository alone. This is a known project-level limitation, not hidden in this review.

Versions explicitly observed in the final GitHub Actions validation environment:

- Node.js `22.23.2`;
- npm `10.9.8`;
- Vite `8.2.2`;
- Vitest `5.0.0`;
- Playwright Chromium / Chrome for Testing `153.0.8010.12` (Playwright browser build v1243).

R2-specific implementation choice: custom TypeScript/SVG avoids introducing new geometry-library license obligations. Existing framework/test dependencies retain their upstream open-source licenses; no third-party source/assets were copied into R2. Before commercial distribution, normal dependency-license inventory should still be generated from the resolved dependency tree.

## Tests and final validation

The completion pass was executed **after** the final module collision-safety change (`58754b249daa78c0805dc95acb888d832ff5ed49`).

Commands executed by `.github/workflows/r2-validation.yml`:

```text
npm install
npm test
npm run build
npx playwright install --with-deps chromium
npm run preview -- --host 127.0.0.1
npm run validate:r2
npm run capture:r2
```

Final results for workflow run `34181108480`:

- dependency install: success, 0 reported vulnerabilities;
- unit/deterministic suite: **32 passed / 32** across 2 test files;
  - R1 energy tests: 16 passed;
  - R2 design tests: 16 passed;
- `npm run build`: success;
- production preview launch: success;
- Chromium production-browser R2 validation: success;
- final R2 screenshot capture: success;
- screenshot commit step: success.

R2 deterministic tests cover the required core cases, including polygon area, point-in-polygon, self-intersection, roof-boundary rejection, obstruction collision, module collision, orientation dimensions, setback area reduction, deterministic auto-layout, obstacle/setback compliance, R1 target delta, persistence, undo/redo and screen↔world coordinate round-trip.

Production browser validation covers editable physical settings, real pan without mutating world geometry, roof creation/editing, setbacks, blocked zones, valid/invalid manual placement, auto-layout, target delta, persistence and representative undo/redo.

## Final screenshot evidence

`artifacts/screenshots/r2/` contains the required nine browser-state screenshots, regenerated by the post-collision-fix R2 validation workflow:

1. `roof-create.png`
2. `roof-edit.png`
3. `setback-obstacles.png`
4. `manual-placement-valid.png`
5. `manual-placement-invalid.png`
6. `auto-layout-portrait.png`
7. `auto-layout-landscape.png`
8. `target-capacity-delta.png`
9. `designer-persisted.png`

The capture step runs against the production Vite preview in Chromium, not mocked image assets.

## Known R2 limitations

- Geometry is planar 2D only; there is no fake 3D.
- The custom inset algorithm is not a complete robust buffer engine for pathological/complex polygons.
- Module rectangles are axis-aligned in the world in this first pass; R2 does not solve arbitrary roof-relative rotations/packing.
- Auto-layout is deterministic first-pass fill, not a packing optimizer.
- Blocked-zone rules are geometric only; they are not jurisdiction/code compliance calculations.
- Roof slope/azimuth metadata is stored/inspectable but does not project geometry into 3D or drive irradiance simulation.
- No physical shade calculation, irradiance provider, production simulation or weather model is included.
- R1 target offset is displayed as design-basis context; R2 does not recompute energy production from roof geometry.
- Undo/redo history is session-local.
- Persistence is browser-local, not backend/multi-user synchronization.
- Desktop is the target; mobile/tablet remains out of scope.
- Dependency versions are not pinned by a committed lockfile.

## Explicit R3+ deferrals

The following remain explicitly deferred and were **not** implemented in this completion pass:

- electrical strings and MPPT validation;
- inverter sizing/compatibility engine;
- cable/current/voltage calculations;
- single-line diagram;
- hourly/annual production simulation derived from weather/irradiance;
- weather or irradiance provider integration;
- physical shade calculation / 3D shading;
- batteries;
- advanced economics;
- proposal generation/PDF;
- AI/OCR;
- production backend and multi-user synchronization.

## R2 stop condition

R2 completion evidence is now committed to `main`. The milestone stops here for review. No R3 implementation is included or authorized by this document.
