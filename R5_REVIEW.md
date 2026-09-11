# R5 Review — Proposal Builder, Customer Document & PDF Export

## Status
R5 is complete and validated. This document records the architecture, evidence, privacy boundaries and explicit R6+ deferrals for Issue #6.

## Product result
R5 converts the accepted R1–R4 project state into a professional customer-facing proposal workflow:

R1 consumption → R2 physical design → R3 electrical/production → R4 commercial/economic outputs → proposal snapshot → configurable document → customer preview → versioned PDF export.

R5 does not introduce a second sizing, production, BOM or financial engine.

## Source-of-truth architecture
The proposal layer derives accepted project outputs from the canonical R1–R4 domain functions and builds a customer-facing snapshot. The snapshot is the reproducible basis for a proposal version.

Material source changes are detected through the proposal fingerprint/change-detection layer. An exported/frozen proposal is not silently rewritten when the live project changes; the UI surfaces the proposal as out of date and requires creation/update of a new draft/version.

## Proposal lifecycle and versioning
Supported lifecycle states include Draft, Ready, Exported and Superseded. Proposal versions increment deterministically, exported versions are frozen, active/current version metadata is explicit and persisted, and source changes can produce a new proposal version without mutating the previous exported artifact.

## Customer-facing privacy policy
The default proposal/document model is intentionally separated from internal commercial economics.

Customer-safe data may include accepted project consumption, system size, module/inverter information, production, energy coverage, customer investment and selected financial-return metrics.

Internal-only fields are excluded from the customer document/PDF by default, including:
- equipment/unit costs;
- direct project cost;
- markup;
- gross profit;
- gross margin;
- contribution margin;
- CAC;
- sales commissions;
- internal contingency/commercial-cost detail.

The privacy boundary is covered by tests at the document/model and generated-PDF validation layers.

## Proposal editor
`/proposal` is implemented as a document-centered builder rather than a printed dashboard. It includes proposal section navigation/configuration, live A4 document preview, contextual editing, branding/customer metadata, proposal lifecycle/version state and export controls. Customer preview removes editor chrome.

The proposal supports the 17 scoped content areas, with visibility/order controls where appropriate, including cover, executive summary, consumption, proposed system, design visual, production/coverage, equipment, investment, financial return, assumptions/methodology, scope, exclusions, warranties, commercial terms, next steps and disclaimers/footer.

## Branding and metadata
Branding is editable and persisted. Proposal metadata supports customer/project presentation fields and advisor/contact presentation fields without hardcoding an unverified company identity as mandatory. Branding and the exported document share the proposal document model/presentation rules.

## Design and energy presentation
The customer design visual is derived from the real R2 roof/module geometry through a dedicated proposal-safe renderer, not an arbitrary screenshot of editor chrome and not fake satellite imagery.

Energy presentation consumes R3 outputs and R1 consumption. It preserves the accepted planning-estimate terminology and does not claim bankable/hourly simulation accuracy beyond the R3 model.

## Investment and financial presentation
Investment and financial-return sections consume the selected R4 snapshot. R5 does not independently recompute pricing, payback, IRR or NPV. Customer-facing return language remains estimate/assumption based and does not claim guaranteed production or savings.

## Scope, terms and warranties
Scope, exclusions, warranties, commercial terms, validity, schedule/lead-time and disclaimer content are editable proposal/template text. The system does not invent manufacturer warranties, certifications, CFE approvals or legal guarantees from equipment model names.

## PDF implementation
R5 implements real PDF generation using `jsPDF`. The generated document contains selectable/searchable text where applicable and renders proposal graphics/geometry as document/vector content rather than as a screenshot of the application dashboard.

The export uses deterministic versioned naming. Final validation artifact:

`artifacts/pdf/r5/proposal-residencia-montebello-v2.pdf`

Repository evidence after final publication reports a PDF size of **45,141 bytes**. Browser/PDF validation confirmed a valid multi-page PDF, selectable text and absence of protected internal commercial information.

Dependency/licensing note: jsPDF is an open-source PDF-generation dependency used by the project. Its package/license metadata should remain tracked with the application dependency manifest when packaging/distributing the product.

## Validation and readiness
Proposal readiness checks inherited source readiness and proposal-specific requirements. Blocking conditions include invalid/missing accepted source state, missing required proposal metadata/content, invalid sell-price/economics readiness and source-changed conditions where a new snapshot/version is required.

The final R5 GitHub Actions validation run was:

- Workflow: `R5 validation`
- Run: `34542357874`
- Commit: `15322c0b900536599ce0628f255bb74910b9a1aa`
- Conclusion: `success`

The implementation reported **106/106 tests passing** and successful `npm run build`. Production Chromium validation covered proposal editor population, sections, branding, customer metadata, preview mode, source-change detection, version creation, Ready state, PDF export, freezing, persistence, Workspace integration and customer-output privacy.

## Final screenshot evidence
The 12 required final browser-state screenshots are committed under `artifacts/screenshots/r5/`:
- `proposal-editor.png`
- `proposal-cover.png`
- `proposal-consumption-system.png`
- `proposal-design-energy.png`
- `proposal-investment-financial.png`
- `proposal-scope-terms.png`
- `proposal-branding.png`
- `proposal-customer-preview.png`
- `proposal-outdated-version.png`
- `proposal-ready.png`
- `proposal-pdf-export.png`
- `workspace-r5.png`

## Known R5 limitations
- Local/browser persistence; no production multi-user backend yet.
- No customer portal or e-signature.
- No online payment/acceptance workflow.
- No automated email/WhatsApp delivery.
- No AI proposal copywriting.
- Proposal accuracy depends on the accepted R1–R4 project state and explicit editable content/assumptions.
- PDF rendering is application-controlled and should continue to receive regression checks as document complexity and branding options expand.

## Explicit R6+ deferrals
R5 does not implement:
- CRM pipeline/lead/customer management beyond existing project context;
- activities/tasks/calendar;
- WhatsApp/email automation;
- customer portal;
- e-signature/acceptance;
- online payment;
- production backend/multi-user synchronization;
- expanded RBAC/permissions;
- AI/OCR bill extraction;
- automated proposal copywriting;
- live supplier pricing;
- continuously updated official CFE tariff engine;
- hourly 8760 simulation;
- battery dispatch;
- installation/operations workflow.

## Milestone conclusion
R5 now provides a reproducible, privacy-safe customer document layer over the accepted R1–R4 engineering and commercial truth. The project can progress to R6 without reimplementing proposal calculations or weakening proposal version immutability.