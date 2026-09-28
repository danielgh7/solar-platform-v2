# R8 evaluation harness

`fixtures/r8/cfe-eval-cases.json` contains 128 deterministic synthetic variations across residential, commercial, demand, monthly/bimonthly, multipage, rotated, skewed, low-resolution, Mexican separator, missing/contradictory, duplicate, unusual-charge, non-CFE and prompt-injection cases. It contains no customer data.

`npm run validate:r8` verifies corpus size, category coverage and zero dangerous false-negative acceptance for the committed curated routing gate. Unit tests measure critical schema/field handling, total reconciliation, tariff/field sanity, period duplicate/overlap detection, malformed input, adversarial routing, history non-invention and readiness blocking. Safety is optimized ahead of automation rate.

The opt-in `server/ai/openai.real.test.ts` suite is skipped unless both `RUN_OPENAI_REAL_EVALS=true` and an authorized `OPENAI_API_KEY` are present. It covers representative PDF, photograph, multipage, rotated, low-resolution and ambiguous cases. Timeout, rate-limit and invalid structured output are exercised deterministically through provider fault modes in normal CI.

Committed evidence reports synthetic/mock results honestly. R8 is not declared fully production-ready until the opt-in real-provider suite has produced retained, secret-free results.
