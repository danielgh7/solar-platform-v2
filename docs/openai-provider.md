# OpenAI provider boundary

Only `server/ai/provider.ts` communicates with OpenAI. It uses the Responses API, multimodal file content and strict schema-versioned JSON output. The browser and native bundles never call OpenAI and never receive the provider key.

Required secret: `OPENAI_API_KEY`. Optional server configuration: `OPENAI_MODEL`, `AI_TIMEOUT_MS`, operation/daily/monthly budgets and `AI_KILL_SWITCH`. Without a key, configure `AI_PROVIDER=mock` for deterministic fixtures or use the manual CFE workflow; the server does not silently substitute fabricated AI output.

The application sends only the document and minimum task context required for extraction. Provider data-handling terms, region, retention and zero-data-retention eligibility must be approved by the organization before real customer use.
