# Authorization, Gating & Guards

The public site is mostly readable by guests. Authorization here is **purely
status-based** — there is **no per-permission UI logic**. Every signed-in user
is a **visitor** with the same capabilities, so access is decided by one
question: *is the user authenticated and verified?*

- **guest** → gated actions open the **login** modal.
- **unverified** → gated actions open the **verify-otp** modal.
- **authenticated** (logged in **and** verified) → **full visitor access** to
  everything.

The backend still enforces the actual policy; the frontend only gates UX on
`status`. The user's `permissions[]` are carried on the entity for fidelity but
are **not** branched on in the UI.

```ts
const { status, isAuthenticated } = useAuth();
```

---

## `requireAuth` — the gate primitive

Runs an action only when authenticated (and verified); otherwise opens the right
modal and resumes after success.

```ts
function useRequireAuth() {
  const { status } = useAuth();
  const { open } = useAuthModal();
  return (action: () => void) => {
    if (status === "authenticated") return action();
    if (status === "unverified") return open("verify-otp", { onSuccess: action });
    return open("login", { onSuccess: action });   // guest
  };
}
```

Usage on a gated control:

```tsx
const requireAuth = useRequireAuth();
<LikeButton onClick={() => requireAuth(() => likeVideo(id))} />
```

A guest clicks → login modal → on success the like fires automatically
(resume-after-login, [08-modal-forms-ux.md](08-modal-forms-ux.md)). An
unverified user is routed to verify their email first.

---

## Which actions are gated

Any action that writes on behalf of the user requires auth (+ verification);
reads stay open to guests:

- **Gated** (require authenticated + verified): like, comment, bookmark, rate,
  share, playlist add/remove.
- **Open to guests**: reading articles, videos, categories, tags.

The frontend gates the UI and opens the modal; the backend enforces the rule.
Because all visitors share the same capabilities, gating is the same boolean
everywhere — no resource/action matching.

---

## Verification gate

An `unverified` user **cannot access protected resources/actions until
verified** — the frontend mirrors the backend's account-status requirement, not
a softer rule. A gated action on an unverified user opens **verify-otp** (resend
a code) with a "verify your email to continue" message rather than the login
modal. The backend is the real gate: a `403 AccountNotVerifiedException` triggers
the same path defensively (see [15-error-handling.md](15-error-handling.md)). So
the rule is uniform: **authenticated *and* verified → access; otherwise →
verify first**.

---

## Route-level protection — `middleware.ts` + the `(user)` group

Two route groups:

| Group | Auth required | Examples |
|---|---|---|
| `(public)` | no | home, articles, videos, shorts, lyrics |
| `(user)` | logged in | `/profile`, `/bookmarks`, `/playlists`, `/settings`, `/favorites` |

There is **no `(auth)` group** — auth forms are modals, not pages.

Next.js **middleware** guards the `(user)` routes by checking for the auth
cookies before the request renders. An unauthenticated hit is redirected home
with `?authRequired=true`, which the home page reads to open the login modal —
so the user lands somewhere useful and can sign in inline.

```ts
// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

/**
 * Protects the (user) route group: if neither auth cookie is present, redirect
 * to the home page with `?authRequired=true` (the home page opens the login
 * modal). Authenticated requests pass through untouched.
 *
 * @param request - The incoming request.
 * @returns A redirect for unauthenticated access, otherwise `NextResponse.next()`.
 */
export function middleware(request: NextRequest) {
    const hasSession =
        request.cookies.has("accessToken") || request.cookies.has("refreshToken");

    if (!hasSession) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.searchParams.set("authRequired", "true");
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/bookmarks/:path*",
        "/playlists/:path*",
        "/settings/:path*",
        "/favorites/:path*",
    ],
};
```

> The middleware is a coarse cookie-presence gate (cheap, runs at the edge). The
> backend still authorizes the actual data calls, and an expired-but-present
> cookie is handled by the refresh interceptor. The Settings page and most of
> these `(user)` pages ship **later** ([12](12-session-management.md),
> [17](17-open-questions.md)); the middleware + group are defined now so they
> exist when those pages land.

Inside a `(user)` page that still needs the user object, read the cached
server-side `getCurrentUser()` ([05](05-state-management.md)) — do not add
client-only guards that flash.

---

## What we deliberately do NOT do

- **No permission engine, no `useAuthorization`, no `can(resource, action)`** —
  visitors are uniform; access is `status`-based only. The backend authorizes.
- No storing roles/permissions separately — they ride on the `me` user object,
  unused for gating.
- No redirect-to-login-page — gating is always the modal overlay.
