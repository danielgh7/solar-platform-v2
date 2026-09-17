# R7 Review — Production Foundation, Spanish i18n & Real Company Branding

Status: **formal R7 review gate**. R8 is not started. SolarERP is not used or imported.

## Architecture
R0.1–R6 pure domain engines remain authoritative. R7 adds a production shell around them: React/Vite frontend → typed API client → Express application/API → repository/data-access layer → PostgreSQL. Complex engineering/proposal snapshots remain versioned JSONB where appropriate; organization/project/status identifiers remain queryable.

PostgreSQL is used because R7 needs transactions, relational tenant ownership, auditability, optimistic concurrency and durable multi-user persistence. Schema changes are versioned under `db/migrations`; `scripts/db-migrate.mjs`, `scripts/seed-r7.ts` and `scripts/validate-r7-db.ts` provide clean migration, representative seed and integration validation.

## Auth, tenancy and RBAC
Authentication uses bcrypt password hashes plus server-side validated sessions in secure cookies with expiry and explicit sign-out. Protected `/api/orgs/:orgId/*` routes reject a path organization that differs from the authenticated session organization before resource handlers run; repository queries additionally scope by organization ID.

Roles: Admin, Commercial, Engineering, Operations, Viewer. Server permissions cover organization settings, projects/engineering, economics/internal data, proposals, CRM, tasks, handoff and audit. Commercial/Viewer do not receive internal R4 costs/margins. UI permission-denied states mirror, but do not replace, server authorization.

## Branding
Default organization: **Buenos días sol by Enertika**. Tagline: **Energía que conecta.** Official binary asset: `src/assets/branding/buenos-dias-sol-by-enertika.png`, 2048×682, 254,968 bytes, SHA-256 `92af3125cc33715e57c5f6129ae026eb9cf9ca9c75962ea5b3907fb0b74c10d5`. The strict seed and CI both reject any different bytes. Browser validation checks intrinsic dimensions, rendered aspect ratio and the server-backed asset hash.

Brand settings live in organization persistence and flow through centralized CSS variables/design tokens (`--brand-primary`, secondary, accent, graphite, dark graphite, surface). Default palette: `#0295BF`, `#007FB8`, `#0780AD`, `#464647`, `#3D4247`, white surface; yellow is not introduced as a brand accent. Login, navigation, projects/workspace, engineering, economics, CRM and proposal surfaces consume the shared brand layer.

R5 proposal defaults are derived from current organization branding. Exported/frozen proposal versions retain their branding snapshot server-side. R7 browser evidence exports a real PDF, parses its first-page text for company name/tagline, renders the first page and stores both PDF and screenshot evidence.

## i18n
`es-MX` is the default. `en-US` proves switching architecture. Authenticated preference persists server-side; pre-auth preference uses the local fallback. Translation/display adapters preserve canonical project IDs, tariff codes and stable CRM stage IDs. Locale formatters handle dates, numbers, MXN/USD currency and percentages. `validate:r7-strings` guards major product surfaces against hardcoded-copy regression.

## Migration and safety
Legacy import is versioned, preview-first and conflict-aware. Existing projects are never silently overwritten; legacy R6 owners require explicit member mapping; frozen proposal semantics remain preserved. Critical writes use version/expectedVersion optimistic concurrency; stale writes return conflict and the UI exposes the conflict state. Won lifecycle and production business-record writes execute transactionally. Audit rows record actor, organization, resource/event and selected before/after metadata.

Security baseline includes validated environment variables, bcrypt password handling, server-side session validation, tenant scoping, server RBAC, Zod request validation, safe typed errors, Helmet, credentialed CORS restricted to configured origin, mutation Origin checks, rate limiting, and raster logo MIME/size restrictions. No security certification is claimed.

## Final validation contract
The definitive `.github/workflows/r7-validation.yml` starts PostgreSQL 16 from clean state, verifies the exact official PNG, installs dependencies, migrates, seeds, runs all R0.1–R7 tests, validates database persistence, performs frontend/backend TypeScript checks plus production build, runs the i18n guard, installs Chromium, launches the real API + production preview, executes production-like Chromium validation, captures exactly 13 browser states, exports/parses/renders the real branded PDF, and verifies the evidence set. No diagnostic integrity bypass is permitted.

Required screenshots in `artifacts/screenshots/r7/`: `login-es-brand.png`, `projects-es-brand.png`, `language-switch.png`, `company-settings.png`, `brand-theme.png`, `engineering-es.png`, `economics-es.png`, `proposal-es-brand.png`, `proposal-pdf-brand.png`, `crm-es.png`, `rbac-denied.png`, `concurrency-conflict.png`, `workspace-r7.png`. Real PDF: `artifacts/pdf/r7/proposal-residencia-montebello-r7.pdf`.

## Issue #8 acceptance audit — 40/40 gate
1. ✅ R0.1–R6 regressions remain green — full `npm test` in definitive workflow.
2. ✅ `es-MX` default locale — clean login/browser assertion and unit coverage.
3. ✅ Major R0–R6 screens usable in Spanish — Chromium traverses consumption/design/economics/proposal/CRM.
4. ✅ `en-US` switching — browser switch and reload validation.
5. ✅ Language preference persists — server preference + reload assertion.
6. ✅ Locale-aware dates/numbers/currency/percentages — formatter tests.
7. ✅ Canonical codes/IDs not incorrectly translated — stable-ID tests/adapters.
8. ✅ Buenos días sol by Enertika default brand — seeded organization and browser/API assertions.
9. ✅ Supplied official logo without distortion — exact binary hash/dimensions plus rendered ratio assertion.
10. ✅ Palette centralized as semantic tokens — shared brand token layer.
11. ✅ Organization branding configurable without code changes — persisted settings/API/UI.
12. ✅ Practical contrast/accessibility — restrained token application and semantic status colors remain independent.
13. ✅ Proposal defaults consume organization branding — runtime proposal brand adapter.
14. ✅ Frozen/exported R5 proposals survive branding edits — immutable branding snapshot/server rule.
15. ✅ Real backend persistence — Express/PostgreSQL production path.
16. ✅ Versioned database migrations — migration runner + migration files.
17. ✅ Representative R1–R6 state persists — strict seed + DB round-trip validation.
18. ✅ Real auth protects app/API — server session middleware and protected routes.
19. ✅ Session lifecycle/sign-out — Chromium verifies post-logout `/api/auth/me` is 401.
20. ✅ Organization ownership modeled — org IDs on production records/memberships/settings.
21. ✅ Cross-organization access rejected server-side — `/api/orgs/:orgId` tenant-boundary middleware plus Chromium denial scenario.
22. ✅ Five-role model — Admin/Commercial/Engineering/Operations/Viewer.
23. ✅ RBAC server-side — permission middleware/policies.
24. ✅ Internal R4 cost/margin confidentiality — Viewer/Commercial redaction policy and browser assertion.
25. ✅ R6 owners map to authenticated members — legacy owner mapping assertion.
26. ✅ Legacy migration/import path exists and is validated — preview/conflict/mapping validation.
27. ✅ R5 frozen proposal immutability server-side — immutable update guard.
28. ✅ Optimistic concurrency — versioned critical writes and explicit 409/conflict UI.
29. ✅ Won/handoff lifecycle transactional/deterministic — transactional lifecycle path preserving R6 domain transition truth.
30. ✅ Audit actor/org recording — persisted audit entries include both IDs.
31. ✅ API request/input validation — Zod schemas and typed error responses.
32. ✅ Security/environment baseline documented/tested — env/session/input/origin/CORS/headers/rate/upload controls.
33. ✅ Company settings manages brand/language defaults — Admin settings UI/API.
34. ✅ Explicit async loading/saving/error/conflict states — R7 UI state model; deterministic browser waits observe real states.
35. ✅ Required R7 tests pass — definitive workflow gate.
36. ✅ Full project build succeeds — `tsc -b`, Vite production build, server typecheck.
37. ✅ Clean database migration/integration validation succeeds — fresh PostgreSQL service, migrate/seed/validate.
38. ✅ Final Chromium production-like validation succeeds — definitive workflow gate.
39. ✅ 13 screenshots + this `R7_REVIEW.md` exist from final state — definitive evidence gate.
40. ✅ Stop for formal review; R8 not started.

## Known limitations / R8+ deferrals
R7 intentionally does not add AI/OCR, WhatsApp, forecasting, Google Solar, external automation/integration work, advanced deployment orchestration or Kubernetes. Social login is not required. Additional locales, SSO/provider abstraction expansion and broader deployment hardening remain future work. No R8 implementation has begun.
