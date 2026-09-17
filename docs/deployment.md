# Deployment

## Staging/production topology
Serve the Vite/PWA static build and the Express API behind an HTTPS reverse proxy/load balancer. PostgreSQL remains private and reachable only by the API. Build the client with an explicit HTTPS `VITE_API_URL`; configure the API with `APP_ORIGIN` / `ALLOWED_ORIGINS` containing only approved HTTPS web origins. Native packages connect to the same HTTPS API and never receive `DATABASE_URL` or `SESSION_SECRET`.

## Reproducible rollout
1. Provision separate staging/production PostgreSQL databases and secret stores.
2. Install the exact lockfile dependencies, run `npm run db:migrate`, then deploy API.
3. Health-check `/api/health` before routing traffic.
4. Build web with the environment-specific public API URL and publish `dist/` behind HTTPS with SPA fallback. Never cache `/api/*` in the PWA service worker.
5. Run the R7.1 regression/build gate against staging before promotion.

## Operations
Keep `SESSION_SECRET`, database credentials and signing material in the platform secret manager. Back up PostgreSQL with scheduled `pg_dump` plus provider snapshots and periodically restore into an isolated staging database. Centralize stdout/stderr with request IDs; alert on failed health checks and sustained 5xx rates. Roll back the client independently; database rollback uses forward-compatible migrations or a tested restore, never destructive ad-hoc SQL.

No permanent hosting provider, production domain, DNS authorization or infrastructure credentials are available in this repository, so a live public deployment is not claimed. The external owner action is to provision/authorize an HTTPS host, API host, PostgreSQL service and DNS; then provide the approved origins/API URL through deployment secrets.
