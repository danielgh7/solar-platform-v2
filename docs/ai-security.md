# AI security and privacy

Utility documents are sensitive tenant data. Every endpoint is authenticated, organization-bound and RBAC protected. Documents have no public media URL. Provider keys are read only by the server and no `OPENAI_*` variable is prefixed `VITE_`.

Controls include magic-byte upload validation, size and type limits, filename sanitization, SHA-256 deduplication, private response caching, retention state, audited purge that immediately removes stored bytes, origin checks, application rate limiting and AI budgets. Production should additionally scan uploads with the hosting provider's malware service before extraction when available.

Document text is untrusted. Provider system instructions explicitly forbid following document instructions, structured output is schema-validated, and deterministic validation routes injection-like text to review. Model output never directly updates accepted project state.

Provider traces exclude raw credentials, authorization headers, raw documents and chain-of-thought. Stored rationale is limited to user-visible issue codes, provenance and concise execution metadata. Customer document export/training is not implemented. Enabling any provider data-retention or training option requires separate organization authorization.

Internal cost, markup, margin, CAC, commission and contingency continue to use R7 server redaction. Copilot context is constructed after RBAC redaction; customer/unauthorized surfaces cannot access those fields.
