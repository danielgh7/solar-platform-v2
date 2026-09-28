# CFE ingestion and review

## Pipeline

1. Authenticated user selects PDF/JPEG/PNG through the existing platform file/camera adapter.
2. Server validates MIME against magic bytes, 15 MB limit, sanitized filename and active-content baseline.
3. SHA-256 provides tenant-scoped deduplication.
4. Original bytes are stored privately in PostgreSQL and served only through an authenticated tenant-scoped endpoint with `private, no-store` caching.
5. Provider output must satisfy `cfeExtractionSchema` version 1.
6. Deterministic validation checks dates/days, negative/impossible consumption, meter/multiplier reconciliation, total tolerance, tariff compatibility, PF/demand sanity, overlapping/duplicate periods, non-CFE classification and prompt-injection text.
7. Blocking or low-confidence critical fields produce `needs-review`; downstream preparation is rejected.
8. Corrections record before/after value, reviewer, time and reason; the complete extraction is revalidated.
9. Only an accepted, unblocked document contributes source periods to consumption history.

History supports 1–24 bill entries. Bimonthly values remain source periods: the system never invents monthly values. An annual result is exposed only for 330–400 days of defensible coverage. Manual entries are explicitly labeled `manual`.

Critical fields store raw and normalized values, confidence, method, status, page/region/text provenance when available. Tariff values extracted from a bill remain distinct from future versioned reference rates and organization assumptions. Current CFE rates are never supplied by an LLM.
