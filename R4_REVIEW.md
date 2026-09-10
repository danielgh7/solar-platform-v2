# R4 Review — Equipment BOM, CFE Economics & Financial Analysis

## Status
R4 implementation is complete and validated. This document records the milestone evidence and the modeling boundaries required by Issue #5.

## Engineering-to-commercial chain
R4 consumes the accepted R1/R2/R3 project state rather than replacing engineering quantities with independent commercial mock values:

CFE consumption → sizing basis → physical module layout → electrical topology/production → BOM → project cost/pricing → electricity-value approximation → annual cash flows → payback/ROI/IRR/NPV → scenario/sensitivity comparison.

## BOM and cost model
- Module quantities are derived from the R2 physical design.
- Inverter quantities/models are derived from the R3 electrical design.
- Other material, labor, engineering, logistics, interconnection and contingency items use explicit editable rules/allowances where detailed routing/protection engineering is outside R4.
- BOM lines distinguish design-derived, rule-derived and manual/override values.
- Project catalog values are editable planning inputs, not live supplier pricing.
- MXN and USD inputs are supported through an explicit editable exchange rate.
- Commercial edits do not silently rewrite the accepted physical/electrical design.

## Pricing and margin
R4 supports markup, target gross margin and fixed sell-price strategies. The model exposes sell price before VAT, VAT, customer total, gross profit, gross margin, markup and price-per-power diagnostics. Gross margin is kept separate from commercial contribution after commission, CAC and other commercial/project operating allowances.

## VAT / cash basis
The default VAT assumption is 16% and is editable. R4 explicitly separates pre-VAT values, VAT and VAT-inclusive totals. Financial return calculations use the configured investment/cash basis rather than assuming VAT is universally an economic cost or benefit.

## CFE economic baseline
The preferred empirical mode uses the latest usable R1 billed history:

`blendedRate = annualBilledAmount / annualConsumptionKWh`

A user-entered blended MXN/kWh mode is also available. R4 does not claim to reproduce an official CFE invoice or complete current tariff engine. For demand/PF services, charges that cannot be defensibly modeled as displaced by the monthly PV approximation remain explicit/non-offset assumptions rather than being silently eliminated.

## Solar energy-value approximation
R4 combines R1 monthly consumption with R3 monthly production. The model is intentionally a monthly energy-value approximation, not an hourly self-consumption/import/export simulation.

For each month, avoided energy is bounded by the modeled monthly consumption/production relationship. Surplus is valued only under the selected explicit assumption: zero, same blended rate (aggressive/simplified), or a custom MXN/kWh value. No retail export value is silently assumed.

## Long-term cash-flow assumptions
The analysis term is editable and defaults to a long-term solar-project horizon. The engine supports:
- electricity-price escalation;
- PV degradation;
- annual O&M;
- O&M escalation;
- configurable replacement/major-maintenance event;
- discount rate;
- explicit initial investment basis.

R3 first-year production is the production basis and later years are degraded deterministically. Annual rows expose production/value, O&M/replacement, net benefit, cumulative cash flow and discounted cash flow.

## Financial metrics
R4 deterministically calculates:
- fractional simple payback when crossing occurs between annual periods;
- year-1 ROI;
- lifetime/cumulative ROI as labeled;
- NPV from discounted cash flows;
- IRR when the cash-flow series permits a meaningful solution;
- nominal and net lifetime benefits.

Undefined/ambiguous IRR cases are represented as unavailable rather than fabricated.

## Scenarios and sensitivity
Conservative, Base/Recommended and Optimistic economic cases use explicit differing assumptions. The comparison exposes investment, year-1 benefit, payback, IRR, NPV and lifetime benefit. A deterministic 3×3 sensitivity analysis evaluates changes in the configured commercial/economic variables without claiming Monte Carlo uncertainty analysis.

## Readiness and validation
R4 readiness propagates blocking R3 electrical errors and also validates economic inputs such as missing/invalid billed baseline, invalid blended rate, missing production, invalid project price/VAT/financial assumptions, low-margin warnings and aggressive surplus valuation assumptions.

## Persistence
Project-specific R4 commercial/economic inputs persist and derived outputs are recomputed deterministically on load. Persisted state includes project catalog/BOM edits, exchange rate, pricing strategy, VAT/cash basis, CFE baseline assumptions, surplus-value assumption, financial assumptions and selected economic scenario.

## Validation evidence
Final R4 validation was completed on `main`.

- Final R4 workflow: GitHub Actions run `34539847751` — conclusion `success`.
- The final validation run covered the R4 test/build/browser workflow; implementation completion reported 86/86 tests passing and `npm run build` successful.
- Production Chromium validation covered the principal R4 Equipment, Economics and Workspace flows plus final scope-accuracy checks.
- Final screenshot publication commit: `85f0fc8ea73781bc8113cc1ee04980ff69a43a7c` (`chore: add R4 validation screenshots [skip ci]`).

Required final browser-state screenshots are committed under `artifacts/screenshots/r4/`:
- `equipment-bom.png`
- `equipment-cost-edit.png`
- `pricing-margin.png`
- `cfe-baseline.png`
- `economics-cashflow.png`
- `economics-scenarios.png`
- `economics-sensitivity.png`
- `economics-validation.png`
- `workspace-r4.png`

## Known R4 limitations
- No official automatically updated CFE tariff engine.
- No hourly/8760 import-export or self-consumption simulation.
- No physical shading engine.
- No live supplier/equipment pricing provider.
- Rule-derived cable/protection/material allowances are not formal conductor/protection engineering.
- No battery dispatch.
- No financing-product amortization engine beyond explicitly scoped planning assumptions.
- Tax treatment is not universalized or presented as legal/tax advice.
- Financial outputs remain planning estimates dependent on user/project assumptions.

## Explicit R5+ deferrals
R4 does not implement customer-facing proposal/PDF generation, e-signature/customer portal, CRM/WhatsApp automation, AI/OCR bill extraction, production backend/multi-user synchronization, full official CFE tariff updates, hourly 8760 simulation, battery dispatch, live supplier APIs, or formal cable/protection/SLD engineering.

## Milestone conclusion
R4 now provides a traceable bridge from the accepted engineering design to BOM, cost, price, CFE-derived energy value and long-term financial return. Every major economic result is tied to an engineering quantity or an explicit editable assumption. R5 must not reinterpret or duplicate these calculations; it should consume the accepted R4 outputs for customer-facing proposal workflows.