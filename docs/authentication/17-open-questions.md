# Decisions (resolved)

The previously-open questions, now decided. These are the agreed constraints for
implementation.

---

1. **`Client-App` value** — ✅ `WebApp`. Set `NEXT_PUBLIC_CLIENT_APP=WebApp` so
   the backend uses cookie token delivery.

2. **Social login (Google / Facebook)** — ⏳ **later** (phase 2). Entities carry
   `authProvider` so it stays additive.

3. **Verification enforcement** — unverified users may **browse public content**
   but **cannot access protected resources/actions until verified** — exactly
   like the backend. Gated actions on an `unverified` user open the **verify-otp**
   modal, not the login modal. See
   [13-authorization-and-guards.md](13-authorization-and-guards.md).

4. **SSR prefetch of `me`** — ✅ yes, in `app/(public)/layout.tsx`, to avoid a
   guest-flash.

5. **`X-Device-Id` header** — ✅ yes. Per-browser UUID (persisted once), like
   dashboard/mobile, so sessions are attributable.

6. **Settings / sessions UI** — a dedicated **Settings page**, implemented
   **later**, modeled **exactly on the dashboard**: URL-driven tabs
   **Profile · Security · Notifications · Account** (`/settings/:tab` with a
   sidebar). **Sessions live in the Security tab.** Not a modal. See
   [12-session-management.md](12-session-management.md).

7. **Remember-me / session length** — ❌ none. Always the backend default
   (30-day refresh); no UI.

8. **Tests** — ⏳ out of scope for now; handled later (the testing doc was
   removed).

9. **Toast** — use **shadcn/ui toast** (Radix `@radix-ui/react-toast`), **not
   sonner**. Add a `Toaster` provider + `useToast`.

10. **Profile editing** — ⏳ later. The Settings page (item 6) will host profile
    editing and change-password. For now the user is read-only via `useAuth()`.

11. **Logout scope** — ✅ "Sign out" signs out **this device** (primary); "Sign
    out everywhere" is a secondary action.

12. **CORS / cookies in dev** — handle **like the dashboard**. The dashboard runs
    on a different port from the backend (`:5025`) with `withCredentials: true`
    and **no proxy**: `localhost:<frontend>` and `localhost:5025` are
    **same-site** (same eTLD+1), so `SameSite=Lax` cookies are sent on
    cross-origin XHR. The only requirement is the **backend CORS** allowing the
    dev frontend origin with `Access-Control-Allow-Credentials: true` (a specific
    origin, never `*`). See
    [04-token-and-cookie-model.md](04-token-and-cookie-model.md#cors--cookies-in-dev).

---

## Initial scope vs. later

**In scope now:** the auth modals (login / signup / verify-otp / forgot / reset),
cookie session + silent refresh, `useAuth()` app-wide, gating + resume-after-
login, logout, i18n, the `Alert` + shadcn `Toaster`.

**Later (own phase):** the **Settings page** (Profile / Security / Notifications /
Account), profile **editing**, the **sessions list/revoke UI** (Security tab),
and **social login**. The session **refresh** + revoke use cases still ship now
(the interceptor needs refresh); only their *UI* is deferred to the Settings
page.
