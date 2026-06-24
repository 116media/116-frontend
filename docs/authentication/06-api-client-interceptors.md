# API Client & Interceptors

The auth module hangs three behaviors off the existing axios-based client
(`src/shared/infrastructure/api/client.ts`): a request interceptor (already
present), a **silent refresh** response interceptor, and a **session-expiry**
signal. This mirrors mobile's three interceptors
(`AuthInterceptor`, `AccessTokenExpiryInterceptor`,
`RefreshTokenExpiryInterceptor`) — adapted for cookies.

---

## What already exists

```ts
// client.ts
export const apiClient = new Api({
  baseURL: API_URL,
  withCredentials: true,                 // cookies attached automatically
  headers: { "Client-App": CLIENT_APP }, // must be "WebApp"
});

apiClient.instance.interceptors.request.use((config) => {
  config.headers.set("Accept-Language", getClientLanguage());
  return config;
});
```

There is **no `Authorization` header injection** — the cookie carries the access
token. That is the web equivalent of mobile's `AuthInterceptor`.

> Optional parity item: add an `X-Device-Id` request header (UUID persisted once
> per browser) like dashboard/mobile, so sessions are attributable per device.
> See [17-open-questions.md](17-open-questions.md).

---

## Silent refresh on 401 (access token expired)

Equivalent to mobile's `AccessTokenExpiryInterceptor`.

```text
request → 401 AccessTokenExpiryException
        → call POST /api/v1/public/sessions/refresh-token  (refresh cookie sent automatically)
            success → backend Set-Cookie: new accessToken → RETRY original request
            failure → propagate (becomes a refresh-expiry, see below)
```

Rules:

1. **Detect** only when `status === 401` and `error.title === "AccessTokenExpiryException"`.
   A plain 401 (e.g. wrong password on login) must **not** trigger refresh.
2. **Single-flight + queue.** While a refresh is in progress, queue all other
   401'd requests; when refresh resolves, replay them. Never fire N parallel
   refreshes.
3. **Use a bare axios instance** for the refresh call — no interceptors — to
   avoid infinite recursion. This lives in
   `session.repository.impl.ts` (the `refreshToken()` method), exactly like
   dashboard's bare `refreshTokenClient`.
4. **Retry guard.** Mark the retried request (e.g. `__isRetry`) so a second 401
   on the retried request does not loop.

```ts
const refreshClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Client-App": CLIENT_APP },
});
// session.repository.impl.ts
async refreshToken() {
  await refreshClient.post("/api/v1/public/sessions/refresh-token");
  // success → cookies rotated by the backend; nothing to store client-side
}
```

---

## Refresh token expired → session-expiry signal

Equivalent to mobile's `RefreshTokenExpiryInterceptor`.

When the refresh call itself fails (`401`/`403`
`RefreshTokenExpiryException`), the session is truly over:

```ts
window.dispatchEvent(new CustomEvent("auth:session-expired"));
```

`AuthProvider` listens for `auth:session-expired` and:

1. `queryClient.clear()` (or remove `['auth','me']`) → `status` becomes `guest`.
2. Optionally opens the **login modal** with a "your session expired" notice.

No automatic hard redirect (the visitor stays on the page; public content is
still readable) — matching the public-site UX, unlike a dashboard that would
bounce to `/login`.

---

## Error normalization (already present, extended)

The existing response interceptor already:

- normalizes validation (400) errors,
- parses `Retry-After` on 429,
- maps exception `title` → localized message via `apiErrors`
  (`src/shared/infrastructure/constants/api.ts`).

The auth module reuses this untouched; specific exception handling (verified /
inactive / expiry) is layered in the mutation/`onError` handlers and the
`auth:session-expired` listener. See
[15-error-handling.md](15-error-handling.md).

---

## Ordering summary

```text
Request:  set Accept-Language  (→ optional X-Device-Id)
Response (error):
  401 AccessTokenExpiryException → refresh (queued, single-flight) → retry
  401/403 RefreshTokenExpiryException → dispatch auth:session-expired
  403 AccountNotVerifiedException → surface "verify your email" (open Verify modal)
  403/423 AccountInactiveException → surface "account inactive", clear me
  429 → expose retryAfter to caller
  otherwise → ProblemMapper.toFailure → Result.err
```

All of this is centralized so individual repositories/use cases stay clean and
just return `Result<T>`.
