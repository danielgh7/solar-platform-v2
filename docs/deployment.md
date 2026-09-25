# Deployment

## Staging/production topology
Serve the Vite/PWA static build and the Express API behind an HTTPS reverse proxy/load balancer. PostgreSQL remains private and reachable only by the API. Build the client with an explicit HTTPS `VITE_API_URL`; configure the API with `APP_ORIGIN` / `ALLOWED_ORIGINS` containing only approved HTTPS web origins. Native packages connect to the same HTTPS API and never receive `DATABASE_URL` or `SESSION_SECRET`.

The R7.1 staging deployment is live at [https://solar-platform-v2.onrender.com](https://solar-platform-v2.onrender.com). Render terminates HTTPS for the shared Web/API service and supplies the private PostgreSQL connection. The audited native release configuration points to this same HTTPS backend; localhost is restricted to explicit development configuration and is not the packaged release fallback.

## Reproducible rollout
1. Provision separate staging/production PostgreSQL databases and secret stores.
2. Install the exact lockfile dependencies, run `npm run db:migrate`, then deploy API.
3. Health-check `/api/health` before routing traffic.
4. Build web with the environment-specific public API URL and publish `dist/` behind HTTPS with SPA fallback. Never cache `/api/*` in the PWA service worker.
5. Run the R7.1 regression/build gate against staging before promotion.

## Operations
Keep `SESSION_SECRET`, database credentials and signing material in the platform secret manager. Back up PostgreSQL with scheduled `pg_dump` plus provider snapshots and periodically restore into an isolated staging database. Centralize stdout/stderr with request IDs; alert on failed health checks and sustained 5xx rates. Roll back the client independently; database rollback uses forward-compatible migrations or a tested restore, never destructive ad-hoc SQL.

## Live deployment evidence

Validated on 2026-09-25 against candidate `7e34aeeb7bcc67b3cc86ae1fa54fc9b6472addcf`:

- Web and PWA load over HTTPS; HSTS is enabled and the manifest identifies Buenos días sol by Enertika with standalone display and 192/512 icons.
- `GET /api/health` returns `200 {"ok":true,"service":"solar-platform-v2-api"}`. This handler performs the PostgreSQL readiness query; successful startup also requires completed migrations and seed initialization.
- Real login, cookie session persistence, reload persistence and logout were exercised. Unauthenticated organization API access returns `401`.
- CORS emits `Access-Control-Allow-Origin: https://solar-platform-v2.onrender.com` plus credential support for the approved origin. An unapproved origin receives no allow-origin header, so browsers cannot read the response.
- Admin, Viewer and isolated tenant accounts were exercised. Tenant project boundaries, server RBAC and Viewer economics redaction remained enforced.
- `es-MX` is the default; switching to `en-US`, persistence and restoration were exercised. The configured Buenos días sol by Enertika branding and official logo render in the deployed UI.
- The representative seeded workspace and R1–R7 navigation were exercised. Project `SOL-2026-206817` was created in the published wizard, listed from PostgreSQL, opened with its own R1 data and remained present after reload.
- No critical application-origin console or API error was observed. Browser-extension metadata errors were excluded because they are not emitted by the application.
- GitHub Actions run `36046515272` is green for all seven technical jobs and `manifest`. Aggregate artifact `10829456504` contains 94 manifest/checksum entries and has archive digest `sha256:4ebc8d181dfc4230c3ae9505e756ea76cf5cc88078e2491e4a4ac8f123c2d1d2`.
