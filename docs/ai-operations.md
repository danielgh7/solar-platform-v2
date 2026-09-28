# AI operations and provider setup

Normal CI and local development use `AI_PROVIDER=mock`; no external secret is required. Real multimodal validation is opt-in:

1. Store `OPENAI_API_KEY` in the deployment/CI secret manager, never in source, chat, logs or a `VITE_*` variable.
2. Set `AI_PROVIDER=openai`, `OPENAI_MODEL` to the approved server-side model, and keep `AI_KILL_SWITCH=false`.
3. Run `RUN_OPENAI_REAL_EVALS=true npm run test:r8:real` in an authorized environment.
4. Remove/rotate the secret using the provider and platform controls after any suspected exposure.

The OpenAI adapter uses `POST /v1/responses`, structured JSON schema and multimodal file input. Default timeout is 45 seconds. Retryable timeouts/rate limits use bounded exponential backoff; refusal/invalid output stops safely and routes to manual review.

## Runbook

- `AI_DISABLED`: verify organization flag and kill switch; manual review remains available.
- `AI_BUDGET_EXCEEDED`: inspect admin usage and adjust an approved budget; do not bypass silently.
- `AI_TIMEOUT` / `AI_RATE_LIMIT`: retry only within configured bounds; otherwise review manually.
- `AI_INVALID_OUTPUT`: retain the document, mark review required, inspect schema/provider configuration.
- Extraction mismatch: correct the normalized field with a reason; do not modify raw/provenance evidence.
- Suspected sensitive leak: enable kill switch, rotate provider credentials, inspect metadata-only traces and follow incident policy.

PostgreSQL backups must include R8 tables; document retention and purge state must be respected by backup retention. Restore tests should verify documents remain tenant-scoped.
