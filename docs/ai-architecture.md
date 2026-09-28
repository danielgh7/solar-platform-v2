# R8 AI architecture

R8 adds a server-side interpretation and orchestration layer; it does not replace the accepted R1–R7.1 domain engines. `AIProvider` is the only provider boundary. `MockAIProvider` is deterministic and mandatory in CI. `OpenAIProvider` uses the Responses API, multimodal input and schema-versioned structured output. Configuration and credentials remain server-side.

## Truth boundary

- AI may extract, classify, explain and propose permitted actions.
- `validateCfeExtraction`, the consumption profile and readiness calculation are deterministic.
- Scenario payloads are exposed only from accepted R1–R4 state and are tagged `accepted-r1-r4-engines`; R8 contains no sizing, electrical, BOM, pricing or economics engine.
- Unknown values remain absent or `needs-review`; no fallback fabricates a number.

## Execution controls

Provider calls have a 45-second default timeout, categorized errors, bounded retries and structured traces. Organization configuration contains a conservative `assist` automation level, feature flag, retention and per-operation/daily/monthly budgets. `AI_KILL_SWITCH` disables calls globally while preserving manual workflows. Tool execution is server-allowlisted, RBAC-checked, bounded by `AI_MAX_STEPS`, and sensitive actions require confirmation.

Execution records contain actor, organization/project/document, provider/model/config/schema versions, status, duration, retry and token/cost metadata, step inputs/outputs reduced to safe metadata and referenced engine versions. Chain-of-thought, credentials and raw provider headers are never stored.

## Failure model

Timeout, rate limit, refusal, unavailable provider and invalid structured output have distinct API categories. The document becomes `failed` or `needs-review`; project state is not mutated. Paid extraction is deduplicated by organization and SHA-256 unless a future authorized reprocess flow is explicitly invokedoked.
