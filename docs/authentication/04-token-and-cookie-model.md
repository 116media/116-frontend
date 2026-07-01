# Token & Cookie Model — How the Session Persists

This answers the central question: **how is the user kept logged in between
pages and reloads on the web?** Short answer: **httpOnly cookies set by the
backend**, not JavaScript storage. The user *object* is re-derived from the
session via a cached `me` query.

---

## Why cookies (and not localStorage like mobile)

Mobile stores the access/refresh tokens in the device keychain
(`flutter_secure_storage`) and attaches `Authorization: Bearer …` manually.
That is safe on a device but **not on the web**: anything JavaScript can read,
an XSS payload can steal. So the web platform uses the backend's **web token
mode**:

- The backend detects the client from the **`Client-App` header**. For
  `WebApp` / `Dashboard` it puts the tokens in **httpOnly, Secure, SameSite
  cookies** and returns only `{ user }` in the body.
- The browser stores these cookies and **attaches them automatically** on every
  same-site request when the client uses `withCredentials: true`.
- JavaScript can never read them → immune to token theft via XSS.

This is the same migration the **dashboard** already completed (documented in
`/docs/authorization/`).

> **Required config:** `NEXT_PUBLIC_CLIENT_APP=WebApp`. The frontend client
> already sends `Client-App: ${CLIENT_APP}` and sets `withCredentials: true`
> (`src/shared/infrastructure/api/client.ts`). If this env var is wrong, the
> backend will fall back to mobile-style body tokens and cookie auth will break.

---

## The cookies (set by the backend)

| Cookie | Path | Lifetime | Attributes |
|---|---|---|---|
| `accessToken` | `/` | ~60 min | httpOnly, Secure (prod), SameSite=Strict (prod) / Lax (dev) |
| `refreshToken` | `/api/v1/public/sessions` | ~30 days | httpOnly, Secure (prod), SameSite=Strict (prod) / Lax (dev) |

- The **access cookie** is sent on all API calls (path `/`) and authenticates
  normal requests.
- The **refresh cookie** is path-scoped to the sessions endpoints, so it is only
  ever sent to `POST /api/v1/public/sessions/refresh-token`. This narrows its
  exposure.
- Cookie names are fixed by the backend (`accessToken`, `refreshToken`); the
  frontend never reads or writes them.

---

## What the frontend persists — nothing sensitive

| Data | Where it lives | Survives reload? |
|---|---|---|
| Access token | httpOnly cookie (backend) | yes |
| Refresh token | httpOnly cookie (backend) | yes |
| **User object** | **TanStack Query cache** (`['auth','me']`), in memory | re-fetched on load |
| OTP `email` + `purpose` mid-flow | in-memory modal state (or `sessionStorage` if a refresh mid-flow must survive) | optional |
| Auth status | **derived** from the user query — never stored | n/a |

There is **no user object in `localStorage`** and **no token in JS**. The
durable thing is the cookie; the user object is disposable and re-fetched.

---

## How "logged in across pages" actually works

### Client-side navigation (SPA)

TanStack Query keeps `['auth','me']` in its cache. Navigating between pages does
not refetch (within `staleTime`), so `useAuth().user` is instantly available.

### Hard reload / first paint

1. Browser still holds the `accessToken` cookie.
2. On mount, `AuthProvider` runs `useQuery(['auth','me'])` →
   `GET /api/v1/public/me/profile` with `withCredentials` → the cookie
   authenticates it → returns the user. Status flips from `loading` to
   `authenticated`.
3. If the access cookie is expired but the refresh cookie is valid, the
   **refresh interceptor** silently renews it and the `me` call succeeds (see
   [06-api-client-interceptors.md](06-api-client-interceptors.md)).
4. If neither is valid → `me` 401s → status is `guest`.

### Server-rendered first paint (optional, recommended)

Server Components can prefetch `me` using the cookie-forwarding server client
(`createServerApiClient()` copies the request `Cookie` header), then **hydrate**
the TanStack cache so the client renders the authenticated UI with **no flash of
guest state**. See [05-state-management.md](05-state-management.md#ssr-hydration).

---

## Logout clears the session

`POST /auth/sign-out` (or `sign-out-all`) tells the backend to revoke the
session and **clear the cookies** (`Set-Cookie` with an expired date). The
frontend then:

1. Resets the TanStack cache (`queryClient.clear()` or removes `['auth','me']`).
2. `useAuth().status` becomes `guest`.

No client-side cookie deletion is needed — the backend expires them.

---

## CORS & cookies in dev

The dev frontend and the API run on **different ports** (e.g. Next on
`localhost:3000`, API on `localhost:5025`). We handle this **exactly like the
dashboard**, which already runs cross-port (`localhost:<vite>` → `:5025`) with
`withCredentials: true` and **no proxy**:

- **Same-site, not cross-site.** `localhost:3000` and `localhost:5025` share the
  same eTLD+1 (`localhost`), so they are **same-site** (different *origin*, same
  *site*). `SameSite=Lax` cookies **are** sent on these cross-origin requests —
  the dev cookies do **not** need `SameSite=None`.
- **`withCredentials: true`** on the client (already set) so the browser sends
  and stores the cookies on cross-origin XHR.
- **Backend CORS must allow the dev origin with credentials**: a specific
  `Access-Control-Allow-Origin` (the frontend origin, **never `*`**) plus
  `Access-Control-Allow-Credentials: true`. This is the same CORS allowance the
  dashboard origin already gets — the frontend dev origin must be added to that
  allow-list.
- **No Next rewrite/proxy** is required (the dashboard uses none). If the API is
  ever served from a genuinely different **site** in some environment, that env's
  cookies would need `SameSite=None; Secure` — but that is not the dev case.

Net: the only action item is ensuring the backend CORS config lists the
frontend's dev origin with credentials, identical to how the dashboard origin is
handled.

---

## Cross-tab consistency

Because the session lives in a cookie shared by all tabs, logging in/out in one
tab changes the cookie for all. To reflect it immediately in other open tabs,
the `AuthProvider` listens for a `BroadcastChannel('auth')` (or a `storage`
ping) message emitted on login/logout and invalidates `['auth','me']`. See
[05-state-management.md](05-state-management.md).

---

## Comparison with mobile

| Concern | Mobile | Web |
|---|---|---|
| Token storage | Keychain / Keystore (secure storage) | httpOnly cookies (backend) |
| Token attach | Manual `Authorization: Bearer` interceptor | Automatic via cookie + `withCredentials` |
| User cache | Hive (encrypted local DB) | TanStack Query cache (in memory) + re-fetch |
| Rehydrate on start | Read tokens + user from storage | Cookie + `me` query (and optional SSR prefetch) |
| Refresh on 401 | Interceptor → refresh → retry | Same pattern, refresh via cookie |
| Logout | Clear secure storage + Hive | Backend expires cookies + clear query cache |

The **flows and UX are identical**; only the storage substrate differs because
the platform's threat model differs.
