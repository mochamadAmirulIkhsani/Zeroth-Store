# Zeroth Store Website — Development Handoff

This document summarizes the current implementation so another agent can continue the project without repeating the earlier investigation.

## Product context

The product requirements document is located at:

`src/imports/pasted_text/website-joki-game-prd.md`

The product is an Indonesian game boosting/farming service website ("joki game"). The public website presents games, services, testimonials, FAQs, contact information, and WhatsApp CTAs. The admin panel manages games, services, testimonials, FAQs, global settings, WhatsApp templates, and service categories.

The PRD explicitly excludes payment gateway integration, client accounts, built-in chat, and a native mobile app. Orders flow through WhatsApp links with auto-filled message templates.

## Current stack

- Frontend: React 18 + TypeScript + Vite 6
- Routing: `react-router` (v7)
- Styling: Tailwind CSS v4 (`@tailwindcss/vite`) + project CSS files (`src/app/styles/`)
- Backend: Express 5 in `server.mjs` (ESM `.mjs`), mounted route modules in `backend/routes/`
- Database: PostgreSQL via Supabase, Prisma 6.19 ORM
  - `DATABASE_URL` = transaction pooler `:6543` (pgbouncer) — **only non-transactional queries**; interactive `$transaction` fails on the pooler
  - `DIRECT_URL` = direct `:5432` connection (used by CLI/seed)
  - Generator uses `engineType = "client"` + `@prisma/adapter-pg` driver adapter (`backend/lib/prisma.mjs`) — required for Vercel serverless (no binary engine in Node runtime)
- Authentication: manual JWT + bcrypt (no managed auth), roles `ADMIN | OWNER` enforced via `requireRole`
- Development process: `node --watch` for the API (not nodemon)
- Persistence: PostgreSQL (mockState removed — no longer in-memory)
- Frontend state: `AppContext` with localStorage cache (`zeroth_store_state`) + window-focus revalidation

## Development commands

From the repository root:

```bash
npm install
npm run dev        # starts both API + Vite via scripts/start-dev.mjs
```

- API: `http://localhost:4000`
- Vite frontend: `http://localhost:5173`

Separate commands:

```bash
npm run dev:api    # node --watch server.mjs
npm run dev:web    # Vite only
npm run build      # vite build && prisma generate
npm run db:push    # prisma db push (sync schema to Supabase)
npm run db:seed    # node prisma/seed.mjs (idempotent wipe + recreate)
```

`scripts/start-dev.mjs` spawns API + Vite, handles `SIGINT`/`SIGTERM`, and kills children to avoid orphaned ports (memory note: on MSYS bash, run the server via `(node server.mjs >log 2>&1 &)`; `taskkill /PID <pid> /F` to stop).

## Environment variables

Template: `.env.example` (committed — safe). Real `.env` is git-ignored; never commit it.

```text
PORT=4000
NODE_ENV=development|production
JWT_SECRET=<random >= 32 chars — fail-fast in backend/lib/prisma.mjs if empty/default>
CORS_ORIGIN=<comma-separated allowed origins, empty = same-origin only>
DATABASE_URL=postgresql://user:***@host:6543/postgres?pgbouncer=true&sslmode=require&schema=public
DIRECT_URL=postgresql://user:***@host:5432/postgres?sslmode=require&schema=public
# Optional first-run admin (seeded to User table):
# ADMIN_EMAIL / ADMIN_NAME / ADMIN_PASSWORD (defaults: admin@zeroth.store / Admin Zeroth / seed default password)
```

- `JWT_SECRET` failure is fatal if unset or equal to a known default — guards against accidental prod deploy without a secret.
- Token: stored client-side under `zeroth_admin_token` (sessionStorage).

## Application structure

```
server.mjs               # Express entry: helmet + rate limit + CORS + mounts routes
                         # prod: serves dist/ (static + SPA fallback); skips listen() on Vercel
backend/
  lib/prisma.mjs         # PrismaClient (engineType=client, adapter-pg) + JWT_SECRET shared
  middleware/auth.mjs    # verifyToken (JWT), requireRole
  middleware/security.mjs# cleanStr/sanitize helpers
  routes/                # admin, games, testimonials, faqs, settings, stats, categories
  utils/serializeGame.mjs# Prisma row → frontend contract
prisma/
  schema.prisma          # User, Game, Service, ServiceCategory, FAQ, Testimonial, GlobalSettings, Stats
  seed.mjs               # idempotent seeder (imports INITIAL_* from src/app/data/gameData.ts)
prisma.config.ts         # Prisma config (schema path, seed command)
src/
  main.tsx               # entry
  app/App.tsx, routes.tsx, RootLayout.tsx
  app/context/AppContext.tsx   # state + localStorage cache + API bootstrap + auth
  app/data/gameData.ts        # TS models + initial/fallback data
  app/pages/                   # public pages
  app/pages/admin/             # admin pages
  app/components/              # shared components (incl. ui/formatDate.ts)
  app/styles/                  # CSS (index.css etc.)
```

### Routes

Public: `/`, `/games`, `/games/:slug`, `/testimoni`, `/faq`, `/kontak`
Admin: `/admin` (login), `/admin/dashboard`, `/admin/games`, `/admin/services`, `/admin/testimonials`, `/admin/faq`, `/admin/settings`, `/admin/users` (User Admin), `/admin/whatsapp`

### API surface

Public (no auth):
- `GET /api/health`
- `GET /api/games` · `GET /api/testimonials` · `GET /api/faqs` · `GET /api/settings` · `GET /api/stats` · `GET /api/categories`

Admin (JWT):
- `POST /api/admin/login` (login rate limit 10/15min), `GET /api/admin/me` — any authenticated
- `PUT /api/games` · `PUT /api/testimonials` · `PUT /api/faqs` · `PUT /api/settings` · `PUT /api/stats` — `requireRole('ADMIN','OWNER')`, **whole-array replace** (upsert by slug + delete absent + `Promise.all`)
- `POST /api/categories` · `PUT /api/categories/:slug` · `DELETE /api/categories/:slug` — `requireRole('ADMIN','OWNER')`
- **User management (OWNER only):**
  - `GET /api/admin/users` — list users (no password hash)
  - `POST /api/admin/users` — create `{name, email, password, role}`; validasi email format, password ≥ 8, role ADMIN/OWNER, duplicate → 409
  - `DELETE /api/admin/users/:id` — guards: cannot delete self, cannot delete last OWNER
- `PUT /api/admin/password` — change own password (any authenticated): `{currentPassword, newPassword}`, verifies bcrypt current, new ≥ 8 & ≠ current

## Completed work

### 1. Persistent storage (Prisma + Supabase Postgres)

Replaced the old in-memory `mockState` with PostgreSQL. Schema in `prisma/schema.prisma`:

- `User` — admin/owner (`role: ADMIN | OWNER`), bcrypt password hash
- `Game` — slug unique, color, image, `waTemplate`, `displayOrder`, status active/inactive; `services Service[]`
- `Service` — FK `gameId` → Game with `onDelete: Cascade` (normalized, not nested JSON)
- `ServiceCategory` — slug unique, name, color, `displayOrder`, active
- `FAQ` — question/answer/category, optional `gameId` (plain string, no FK) — see caveat below
- `Testimonial` — gameId (plain string, no FK), rating, featured, active
- `GlobalSettings` — single row `id=1`: whatsappNumber, heroHeadline, heroSubheadline, operationalHours, responseTime, announcement, footerText, socialMedia (Json)
- `Stats` — single row `id=1`: ordersCompleted, gamesSupported, satisfactionRate, activeClients

Seeder `prisma/seed.mjs` is idempotent (upsert by slug + wipe nested + recreate), imports `INITIAL_GAMES` etc. from `src/app/data/gameData.ts`. `HowItWorksStep`/`SecurityNote` intentionally NOT in DB — static content in `backend/constants.mjs`.

### 2. Prisma client-engine + driver adapter (Vercel compatibility)

- `generator client { engineType = "client" }` in schema
- `@prisma/adapter-pg@6.19.0` (must match prisma core version) + `PrismaPg` adapter in `backend/lib/prisma.mjs`
- `npm run build` runs `vite build && prisma generate` so the client-engine artifact is generated during deploy

### 3. API security hardening

- helmet with CSP (dev allows unsafe-inline + ws for Vite HMR; prod sets `upgradeInsecureRequests`)
- Global rate limit 300 req/15min per IP; login limiter 10/15min (in-memory, resets on restart)
- CORS restricted via `CORS_ORIGIN` env (comma-separated). Empty = same-origin only (Vercel monolith)
- `express.json({ limit: '100kb' })` + 413/400 error handlers
- Input sanitization via `cleanStr` in `backend/middleware/security.mjs`
- Slug regex validation
- `app.set('trust proxy', 1)` (reverse proxy — Vercel/Railway)

### 4. Vercel deployment readiness

- `server.mjs` exports the Express `app`; skips `listen()` when `VERCEL=1`/`VERCEL_ENV` is set (Vercel injects its own handler). Local/Railway still listen.
- `vercel.json`: builds `server.mjs` with `@vercel/node`, routes `/api/*` → server, everything else → `dist/index.html` (SPA fallback)
- `script` `vercel-build`: `vite build && prisma generate`
- Frontend API base: `VITE_API_BASE_URL` env, default `''` (same-origin). All fetches go through `fetchJson` in `AppContext` (all public + admin calls already use `API_BASE_URL`; no hardcoded `http://localhost:4000` remains — the one in `AdminServices.tsx` was replaced)
- CSP `connectSrc` still lists localhost origins (dev); fine for prod same-origin, but revisit if the API is ever served cross-origin

### 5. Frontend API bootstrap + admin writes

`AppContext` loads `GET /api/{games,testimonials,faqs,settings,stats,categories}` on mount (Promise.all), revalidates on window focus. Falls back to localStorage/initial data while pending. Admin setters send authenticated `PUT` when a token exists; write failures log (games) or are swallowed (others) — UI keeps working offline-ish.

### 6. Admin user management + change password

- `AdminUsers.tsx` (route `/admin/users`) — two cards:
  - **Ganti Password Saya** (any admin): current + new + confirm, calls `PUT /api/admin/password`
  - **Manajemen User Admin** (OWNER only, gated by `adminRole` from `useApp`): table of users (name/email/role/delete), inline create form (name/email/password/role)
- `AppContext` now exposes `adminRole` (set from login response, cleared on logout) for UI gating
- Seed admin user is now role `OWNER` (first admin = owner, can manage users)
- Guards: cannot delete self / last OWNER (backend-enforced)

## Validation already completed

- `npm run build` passes (vite build + prisma generate) — verified after all Vercel changes
- Runtime API smoke tests pass (node server.mjs):
  - `GET /api/health` → `{"ok":true,...}`
  - `GET /api/games`, `GET /api/categories` → JSON data
  - `POST /api/admin/login` wrong password → 401 JSON error
  - unknown route → 404 JSON
  - login rate limiting → 401s (not 429? verify limiter threshold behavior)
- Prisma client-engine query against Supabase returns `SELECT 1` OK
- Note: `npm run build` output verified fresh after `.gitignore` update (build still green; `.gitignore` change doesn't affect runtime)

## Known limitations / caveats

### Pooler limits transactions

Supabase `DATABASE_URL` is the pgbouncer pooler (`:6543`). Interactive `$transaction` fails there — code deliberately uses non-transactional operations only. Use `DIRECT_URL` (`:5432`) for anything transactional (CLI, migrations, seed).

### FAQ/Testimonial `gameId` has no FK

`FAQ.gameId` and `Testimonial.gameId` are plain slug strings, not FK relations. Deleting a game does not cascade to FAQs/testimonials referencing its slug. If desired, either add a FK (requires schema change + migration) or add cleanup logic in the game delete route.

### Whole-array PUT replace

Admin writes send the full collection and the server upserts-by-slug + deletes absent rows + `Promise.all`. ~3s for all games. Acceptable, but per-resource CRUD would be cleaner and is the upgrade path if edit granularity or partial updates are needed.

### In-memory rate limiting

Rate limiters reset on process restart. Single Vercel function instance is fine; many instances would need a shared store (Redis/Upstash) — overkill for this scale.

### JWT lifecycle

24h expiry; no refresh endpoint. On 401 from an authenticated write, the frontend currently just logs — a future improvement should clear the token and redirect to `/admin`. There is no explicit `/api/admin/me`-driven expiry UI.

### Role from token, not DB

`requireRole` reads the role from the JWT (not re-fetched per request). A user whose role is changed or deleted keeps access until their token expires (24h). Acceptable for an internal admin panel; upgrade path: `verifyToken` re-checks the user's current role against the DB.

### Client-side localStorage fallback remains

`zeroth_store_state` cache is written on every state change. After DB is source of truth, decide whether to keep as offline fallback or remove to make API single source of truth.

### CSP connectSrc dev origins

`connectSrc` includes `http://localhost:5173` / `http://localhost:4000` and `ws:` — needed for Vite HMR in dev, harmless in prod but not strictly minimal. Revisit if deploying API cross-origin.

## Deployment (Vercel, via GitHub)

1. Repo must be on GitHub (branch `main`).
2. Import the repository in Vercel (Framework Preset: Vite / Other).
3. Set env vars in Vercel dashboard (do NOT commit `.env`):
   - `DATABASE_URL` (pooler `:6543`, pgbouncer=true)
   - `DIRECT_URL` (direct `:5432`)
   - `JWT_SECRET` (random ≥ 32 chars)
   - `NODE_ENV=production`, `CORS_ORIGIN=` (empty = same-origin) or the deployed domain
   - `VITE_API_BASE_URL=` (empty = same-origin) — only if the API were ever cross-origin
4. Deploy. `vercel-build` runs `vite build && prisma generate`.
5. Database schema: apply once BEFORE first deploy (Supabase dashboard SQL editor, or `npm run db:push` / `prisma migrate deploy` from a machine with `DIRECT_URL`). Vercel does not run migrations automatically. Then run the seed (or insert admin via env `ADMIN_EMAIL`/`ADMIN_PASSWORD` on next deploy).

> Note: `npm run db:push` uses the direct connection. If the schema evolves, prefer committing a real migration (`prisma migrate dev` → `prisma migrate deploy`) instead of relying on `db:push` in prod.

## Files changed in the current worktree

At the time this handoff was written, recent changes include (review before committing):

- `.gitignore` — now ignores `.env*` (except `.env.example`), `*.log`, `*.bak`, `.vercel/`, OS files; `.env.bak` created during testing was deleted
- `server.mjs` — Vercel export + static serve + CORS same-origin default
- `backend/lib/prisma.mjs` — engineType=client + adapter-pg
- `backend/routes/admin.mjs` — added user management (`GET/POST /users`, `DELETE /users/:id`, `PUT /password`) with OWNER gating + guards
- `prisma/schema.prisma` — generator engineType=client
- `prisma/seed.mjs` — seed admin user now role `OWNER`
- `package.json` — build = vite build + prisma generate; added vercel-build
- `vercel.json` — new
- `src/app/context/AppContext.tsx` — API base `VITE_API_BASE_URL`/relative; added `adminRole` state
- `src/app/pages/admin/AdminUsers.tsx` — new (user management + change password)
- `src/app/pages/admin/AdminLayout.tsx` — nav item "User Admin"
- `src/app/routes.tsx` — route `/admin/users`
- `.env.example`, `README.md`, `docs/DEVELOPMENT_HANDOFF.md` — updated

Do not commit `.env`, `*.bak`, `*.log`, or anything under `dist/`/`node_modules/`.

## Continuation instruction

Start by inspecting `server.mjs`, `backend/lib/prisma.mjs`, `prisma/schema.prisma`, and `vercel.json`. Current state: build green, API verified locally, deployment-ready for Vercel Free via GitHub. Next candidates: replace whole-array PUTs with per-resource CRUD, add token-expiry handling on 401, decide localStorage fallback fate, add proper Prisma migrations.