# Backend (Server) Execution Plan

## Goal
Provide authentication (JWT issuance via httpOnly cookie) and Firestore data operations endpoint surface (if needed) for a real-time product management app. While frontend can directly access Firestore for real-time listeners, backend is authoritative for auth and can optionally proxy product writes for stricter security.

## Stack
- Node.js + Express + TypeScript
- Firebase Admin SDK (server-side Firestore access)
- jsonwebtoken for JWT creation/verification
- cookie-parser for parsing cookies
- zod for request validation
- dotenv for env management
- cors configured with credentials
- (Optional) Winston or pino for logging

## High-Level Architecture
- src/
  - app.ts (Express app setup)
  - server.ts (bootstrap listen)
  - config/ (env + firebaseAdmin)
  - middleware/ (authMiddleware, errorHandler, validateRequest)
  - routes/ (auth.routes.ts, products.routes.ts [optional if handling via backend])
  - controllers/ (auth.controller.ts, products.controller.ts)
  - services/ (auth.service.ts, product.service.ts, jwt.service.ts)
  - schemas/ (auth.schema.ts, product.schema.ts)
  - utils/ (logger.ts, asyncHandler.ts)
  - types/ (express.d.ts augment Request with user?)

## Authentication Flow
- Hard-coded demo credentials (email: demo@demo.com, password: DemoPass123) stored in env or constant.
- POST /auth/login -> validate credentials -> issue JWT (payload: { sub: demoUserId, email }) -> Set-Cookie: token=...; HttpOnly; Secure (in prod); SameSite=Strict.
- GET /auth/me -> verify cookie token -> return user object { id, email }.
- Middleware: authMiddleware verifies JWT from cookie; attaches req.user.

## JWT Details
- Algorithm: HS256 using secret JWT_SECRET.
- Expiry: 1h (configurable).
- Refresh tokens NOT required for assignment; keep simple.

## Firestore Integration
- Use Firebase Admin SDK initialized with service account credentials (or application default creds) to access project.
- Collections: products.
- Product document shape: { name, sku, price, quantity, status, category, createdAt, updatedAt }. Server uses Timestamp.now().
- Option A (Simpler for assignment): Frontend writes directly; server only does auth. Provide optional endpoints for demonstration.
- Option B (More secure): All product writes go through server; Firestore security rules restrict direct client writes. (Document both; implement minimal endpoints.)

## Endpoints
Auth:
- POST /auth/login
- GET /auth/me
Products (Optional for demonstration / server-driven ops):
- GET /products (non-realtime snapshot)
- POST /products
- PATCH /products/:id
- DELETE /products/:id
- PATCH /products/:id/status (toggle)
Health:
- GET /healthz -> { status: 'ok' }

## Validation (Zod)
- loginSchema: { email: string.email(), password: string.min(8) }
- productCreateSchema: { name: string.min(2), sku: string.min(2), price: number>0, quantity: int>=0, category: string, status?: enum(['active','inactive']) }
- productUpdateSchema: Partial of above.
- statusUpdateSchema: { status: enum(['active','inactive']) }

## Middleware
- cors: origin from FRONTEND_ORIGIN, credentials true.
- cookieParser: parse cookies.
- json body parser.
- authMiddleware: verify token for protected routes (products CRUD).
- errorHandler: central error formatting (log + JSON { message, code }).
- notFound handler.
- validateRequest(schema): ensures req.body matches; else 400 with issues.

## Services
- jwt.service: sign(payload, options), verify(token).
- auth.service: validateCredentials(email,password) -> user or null.
- product.service: CRUD wrappers around Firestore (addProduct(data), listProducts(), updateProduct(id,data), deleteProduct(id), updateStatus(id,status)). Ensure sku uniqueness (query by sku) before create/update.

## Logging
- Simple logger with console + levels; include request logging (morgan or custom middleware) for dev.

## Error Handling Strategy
- Throw custom AppError(code, status) from services. errorHandler maps to response.
- 401 for invalid token or missing auth.
- 409 for duplicate SKU.

## Environment Variables (.env)
- PORT=4000
- JWT_SECRET=devsecret
- FRONTEND_ORIGIN=http://localhost:3000
- FIREBASE_PROJECT_ID=...
- FIREBASE_CLIENT_EMAIL=...
- FIREBASE_PRIVATE_KEY="..." (escaped newlines) OR use GOOGLE_APPLICATION_CREDENTIALS path
- DEMO_EMAIL=demo@demo.com
- DEMO_PASSWORD=DemoPass123
- TOKEN_EXPIRY=1h

## Implementation Steps
1. Bootstrap project (package.json, tsconfig, eslint, nodemon/dev script).
2. Setup firebase admin initialization.
3. Implement jwt.service.ts.
4. Implement auth.service.ts with hard-coded credential check.
5. Implement auth.controller.ts (login, me) + routes.
6. Implement product schemas & service.
7. Implement products controller & routes (guarded by auth middleware).
8. Wire middleware stack in app.ts.
9. Add error handling + not found.
10. Manual test with curl / login -> cookie -> protected route.
11. Add README documentation.

## Security Notes
- Set HttpOnly; Secure only in production (NODE_ENV check); SameSite=Strict.
- Limit JSON body size (e.g., 100kb) via express.json({ limit: '100kb' }).
- Validate all input via Zod.

## Testing Plan (Optional / Stretch)
- Unit tests for jwt.service (sign/verify), auth.service (valid/invalid credentials), product.service (CRUD with in-memory Firestore emulator or mocking).
- Supertest integration tests for auth/login + protected route.

## Deployment Considerations
- Provide Dockerfile (multi-stage) (optional stretch) or deployment notes for Render/Fly/Heroku.
- Ensure FIREBASE_PRIVATE_KEY handling (replace \n with real newline).

## Acceptance Criteria
- Login issues JWT cookie; /auth/me returns user when cookie present.
- Protected endpoints reject unauthenticated requests.
- (If implemented) Product CRUD enforces sku uniqueness and updates timestamps.
- Clear README with setup steps and demo credentials.

## Milestones Order
1. Scaffold + config
2. Auth (JWT issue + me)
3. Firestore admin init
4. Product service + routes (optional)
5. Error handling & validation polish
6. Docs & cleanup
