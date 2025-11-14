
# commn — a lightweight text-based homegrown social media

> simple, self-hostable text-first social network built with node, express, react (vite) and postgres.

## overview

commn aims to provide a fast, privacy-conscious platform for short text posts, threaded conversations, and simple following mechanics. it targets users and communities that prefer a homegrown alternative to large social networks.

core goals:

* minimal, text-first ux
* self-hostable and easy to deploy
* standard web stack: node/express api, react frontend (vite), postgres data store
* extendable architecture for features like mentions, replies, and basic moderation

## features

* user signup / signin (jwt session)
* create, edit, delete text posts
* threaded replies and simple timelines (home / profile / public)
* follow/unfollow users
* basic notification feed (mentions, replies)
* search users and posts (postgres full-text)

## tech stack

* backend: node.js, express
* frontend: react, vite
* database: postgresql
* auth: jwt (bearer tokens)
* connection: node-postgres (pg) or any orm (optional)

## project structure (example)

```
/ (repo root)
├─ /api                 # express app, routes, controllers, middlewares
├─ /web                 # react vite app
├─ /migrations          # sql migration scripts or orm migrations
├─ /scripts             # dev scripts (migrate, seed, build)
├─ .env.example         # example environment variables
└─ README.md
```

## prerequisites

* node 18+ (or recommended lts)
* npm or pnpm or yarn
* postgres 12+
* optional: pm2 or systemd for production process management

## environment variables

create a `.env` file (copy `.env.example`) and set at least:

```
# backend
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/commn_db
JWT_SECRET=your_long_random_secret
NODE_ENV=development

# frontend
VITE_API_URL=http://localhost:4000
```

## quick start (development)

1. clone repo

```bash
git clone <repo-url> commn && cd commn
```

2. install dependencies (backend + frontend)

```bash
# from repo root
npm install
cd web && npm install
cd ../api && npm install
```

3. prepare database

```bash
# create database
createdb commn_db
# run migrations (project provides migrations scripts)
npm run migrate
# seed (optional)
npm run seed
```

4. run backend and frontend

```bash
# run api (from /api)
npm run dev
# run frontend (from /web)
npm run dev
```

open `http://localhost:5173` (vite default) and backend at `http://localhost:4000` (example)

## production build & deploy (overview)

* build frontend: `cd web && npm run build` → outputs to `/web/dist`
* serve static bundle from express (copy dist into api/public or configure reverse proxy)
* secure env vars and use a process manager (pm2 / systemd)
* use postgres managed instance or self-host; enable regular backups
* use https (letsencrypt / cloud provider) and set secure cookie flags if using cookies

## database notes

* use postgres full-text search for post search and relevance ranking
* keep indexes on `(author_id)`, `(created_at)`, and tsvector columns for text search
* consider soft deletes (deleted_at) for posts and accounts

## security & privacy

* store jwt secret securely (do not commit)
* validate and sanitize user input (prevent sql injection/xss)
* rate-limit auth endpoints and posting endpoints
* provide account deletion flow for user privacy

## testing

* include unit tests for api controllers and utils
* integration tests for db queries and auth flows
* run tests via `npm test` from project root or respective package folders

## ops & monitoring

* add basic logging (winston or pino) and structured logs
* collect metrics (request latency, error rate)
* alert on failed migrations, db connectivity errors

## contributing

* fork -> feature branch -> open pr
* follow commit message convention: `feat|fix|chore(scope): description`
* include tests for new features

## roadmap (ideas)

* federation support (activitypub) — optional
* richer moderation tools (reports, admin panel)
* attachments (images) with moderation / size limits
* realtime updates (websocket) for live replies/notifications

## license

choose a license (mit recommended for easy adoption). include `LICENSE` file.

---

if you want, i can generate a `.env.example`, common migration sql, or a simple deploy script next.
