# Authentication & Session Module

Design documentation for the web frontend's authentication & session module —
built to behave **exactly like the mobile app** (`apps/mobile`), connected to
the same backend, using **TanStack Query v5** for server state, **React
Context** for app-wide auth state, **httpOnly cookies** for session persistence,
and **modal forms** (never pages).

> Status: **design / documentation**. Implementation begins after sign-off
> (see [16-implementation-plan.md](16-implementation-plan.md)).

## Documents

| # | Doc | What it covers |
|---|---|---|
| 01 | [Overview](01-overview.md) | Goals, decisions at a glance, account states, reading order |
| 02 | [Architecture](02-architecture.md) | Clean-architecture layering, folder structure, reuse map |
| 03 | [Backend API Reference](03-backend-api-reference.md) | Endpoints, request/response DTOs, errors, rate limits |
| 04 | [Token & Cookie Model](04-token-and-cookie-model.md) | httpOnly cookies, persistence between pages, vs mobile |
| 05 | [State Management](05-state-management.md) | TanStack Query v5 + AuthProvider/useAuth, SSR hydration |
| 06 | [API Client & Interceptors](06-api-client-interceptors.md) | Silent refresh, queue, session-expiry, error normalization |
| 07 | [Auth Flows](07-auth-flows.md) | Every flow step-by-step + flow→endpoint→use-case map |
| 08 | [Modal Forms UX](08-modal-forms-ux.md) | Modal view machine, Dialog primitive, resume-after-login |
| 09 | [Forms & Validation](09-forms-and-validation.md) | react-hook-form + zod schemas mirroring mobile validators |
| 10 | [Domain Entities & Mappers](10-domain-entities-and-mappers.md) | Entities, value objects, DTO→entity mapping |
| 11 | [Repositories & Use Cases](11-repositories-and-usecases.md) | Ports, impls, use cases, DI/Cradle registration |
| 12 | [Session Management](12-session-management.md) | Sessions list, revoke, sign-out-all, refresh vs revoke |
| 13 | [Authorization & Guards](13-authorization-and-guards.md) | Gating actions, requireAuth, verification gate |
| 14 | [i18n](14-i18n.md) | `auth` namespace structure, keys, en/fr |
| 15 | [Error Handling](15-error-handling.md) | Per-exception UX, field vs banner, rate-limit countdown |
| 16 | [Implementation Plan](16-implementation-plan.md) | Dependencies, phased build order, parity checklist |
| 17 | [Decisions](17-open-questions.md) | Resolved decisions, scope-now-vs-later, CORS-in-dev |
| 18 | [Why Not next-auth](18-why-not-next-auth.md) | Rationale for using the backend as the single auth source |

**Implementation specs** (TODO-tracked, full JSDoc'd code) live in
[specs/](specs/00-index.md).

## The short version

- **How is the user kept logged in between pages?** The backend sets **httpOnly
  cookies** (`accessToken`, `refreshToken`); the browser resends them
  automatically (`withCredentials`). The user *object* is re-fetched from
  `GET /me/profile` via a cached TanStack query and shared through `useAuth()`.
  No tokens or user data live in `localStorage`. Full detail in
  [04](04-token-and-cookie-model.md).
- **Forms are modals.** One `AuthModal` switches between login / signup /
  verify-otp / forgot / reset views; gated actions open it and resume after
  success. See [08](08-modal-forms-ux.md).
- **Parity with mobile** is tracked in
  [16 — parity checklist](16-implementation-plan.md#parity-checklist-vs-mobile).
