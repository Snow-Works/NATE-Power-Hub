## Step 0a — Monorepo + Express server skeleton — DONE (2026-11-11)
- Monorepo at ~/Developer/kelvinate, npm workspaces: client/, server/.
- Git initialised on `main`.
- Server: Express 4 + Helmet + CORS (CLIENT_ORIGIN locked) + pino-http +
  central 404 + central error handler, single shape: { error: { code, message } }.
- `GET /api/health` returns { status, service, time }.
- Env via `node --env-file=.env` (no dotenv dependency). Node ≥ 20.6 required.
- Local `.env` created from `server/.env.example`; real `.env` gitignored.
- NEXT → Step 0b: Vite + React client that fetches /api/health and renders "API OK".

## Step 0b — Vite + React client (not started)
## Step 0c — ESLint + Prettier + shared env conventions (not started)