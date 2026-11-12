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




## Step 0b — Vite + React client — DONE (2026-11-11)
- client/ workspace: Vite 5 + React 18, no TypeScript (project rule).
- Vite dev proxy: /api → http://localhost:4000 (dev only; prod CORS handled server-side).
- App.jsx fetches GET /api/health with AbortController + cancelled flag; renders
  API OK / API DOWN / Checking… states. Negative test verified.
- Deliberately no React Router / TanStack Query / Tailwind / other stack deps yet.
  They land in the steps that need them.
- Step 0 "Done when" (client displays API OK) is satisfied.
- NEXT → Step 0c: ESLint + Prettier + shared env conventions; then Step O.O landing page.

## Step 0c — ESLint + Prettier (not started)
## Step O.O — Landing page (not started)