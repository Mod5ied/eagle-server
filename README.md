# Eagle Streaming Backend

Implements authentication (JWT via httpOnly cookie) and optional product CRUD endpoints over Firestore for the Real-Time Product Management Dashboard.

## Stack
Express + TypeScript, Pino logging, Firebase Admin (Firestore), Zod validation, JWT.

## Requirements
pnpm, Node 18+.

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install deps:
```bash
pnpm install
```
3. Run dev server:
```bash
pnpm dev
```
Server starts on PORT (default 4000).

## Scripts
- `pnpm dev` watch mode using tsx.
- `pnpm build` compile to `dist`.
- `pnpm start` run compiled JS.
- `pnpm typecheck` strict type check.

## Auth
POST `/api/auth/login` body `{ email, password }` sets httpOnly cookie `token` on success. GET `/api/auth/me` returns current user if cookie valid.

## Products
Authenticated endpoints under `/api/products` provide CRUD and status toggle. Frontend may still use direct Firestore real-time listener.

## Logging
Structured logs with Pino. Request start/finish and domain events (login, product CRUD) are logged.

## Error Handling
Central error handler returns JSON `{ message }`. Validation errors return 400 with details.

## Health
`/api/healthz` returns `{ status: 'ok' }`.

## Build
```bash
pnpm build && pnpm start
```

# Eagle Streaming Backend

Node.js + Express + TypeScript backend providing authentication (JWT via httpOnly cookie) and optional product CRUD endpoints over Firestore.

## Tech Stack
- Express
- Firebase Admin (Firestore)
- Pino (structured logging, no console.log usage)
- Zod (validation)
- JSON Web Tokens (HS256)

## Project Structure
```
src/
  app.ts               # Express app configuration
  server.ts            # Entry point
  config/              # env + firebase admin init
  controllers/         # Request handlers (auth, product) with logging
  middleware/          # requestLogger, validateRequest, error handlers
  routes/              # Route modules combined under /api
  schemas/             # Zod schemas (auth, product)
  services/            # Business logic (auth, jwt, product)
  utils/logger.ts      # Pino logger
```

## Environment Variables
See `.env.example` and create a `.env` file:
```
PORT=4000
NODE_ENV=development
JWT_SECRET=replace_me
TOKEN_EXPIRY=1h
FRONTEND_ORIGIN=http://localhost:3000
DEMO_EMAIL=demo@demo.com
DEMO_PASSWORD=DemoPass123
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_LINES\n-----END PRIVATE KEY-----\n"
```

## Scripts
- `pnpm dev` / `npm run dev` Start dev server with tsx watch
- `pnpm build` / `npm run build` Compile to `dist`
- `pnpm start` / `npm start` Run compiled build
- `pnpm typecheck` Static type checking

## Install & Run (Dev)
```
pm install
cp .env.example .env   # fill values
npm run dev
```
Server starts on http://localhost:4000.

## API Overview
Base path: `/api`

Auth:
- POST `/api/auth/login` { email, password } -> Set-Cookie + user
- GET `/api/auth/me` -> user if cookie valid

Products:
- GET `/api/products` -> list
- POST `/api/products` -> create
- PATCH `/api/products/:id` -> update
- DELETE `/api/products/:id` -> delete
- PATCH `/api/products/:id/status` { status } -> update status

Health:
- GET `/api/health` -> { status: 'ok' }

## Logging
All request lifecycle events logged via Pino.
