# Spec 08 — Gating & Route Protection

`useRequireAuth` (status-based + resume-after-login), gated-action wiring, the
`middleware.ts` cookie gate, and the `(user)` route group.

Design ref: [../13-authorization-and-guards.md](../13-authorization-and-guards.md).

---

## Tasks

- [ ] `useRequireAuth` (guest → login modal, unverified → verify modal, else run)
- [ ] Wire gated actions (like/comment/bookmark/rate/share/playlist)
- [ ] `middleware.ts` protecting the `(user)` routes
- [ ] `(user)` route group scaffold (pages ship later)
- [ ] Home reads `?authRequired` to open the login modal
- [ ] Verify: guest action resumes after login; protected route redirects

---

## useRequireAuth

```ts
// src/modules/auth/presentation/hooks/useRequireAuth.ts
"use client";

import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { useAuthModal } from "@/modules/auth/presentation/modal/AuthModalProvider";

/**
 * useRequireAuth
 *
 * @description
 * Returns a guard that runs an action only when the user is authenticated **and
 * verified** (matching the backend). A guest is sent to the login modal and an
 * unverified user to the verify-otp modal; in both cases the action resumes
 * automatically after success (resume-after-login).
 *
 * @returns A function `(action) => void` that gates `action` on auth + verification.
 */
export function useRequireAuth(): (action: () => void) => void {
    const { status } = useAuth();
    const { open } = useAuthModal();

    return (action: () => void) => {
        if (status === "authenticated") return action();
        if (status === "unverified") return open("verify-otp", { onSuccess: action });
        return open("login", { onSuccess: action });
    };
}
```

## Gating a control

```tsx
// example: a like button on a public page
"use client";

import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";

/**
 * LikeButton
 *
 * @description
 * Likes a video when authenticated+verified; otherwise opens the auth modal and
 * resumes the like after a successful login/verification.
 *
 * @param videoId - The video to like.
 */
export function LikeButton({ videoId }: { videoId: string }) {
    const requireAuth = useRequireAuth();
    const like = useLikeVideo(videoId);
    return <button onClick={() => requireAuth(() => like.mutate())}>Like</button>;
}
```

The same pattern wraps comment, bookmark, rate, share, and playlist actions.
Reads (articles/videos/categories/tags) are never gated.

---

## Route protection — `middleware.ts`

```ts
// middleware.ts (project root)
import { NextResponse, type NextRequest } from "next/server";

/**
 * middleware
 *
 * @description
 * Coarse cookie-presence gate for the `(user)` route group. If neither auth cookie
 * is present, redirects to the home page with `?authRequired=true` (the home page
 * opens the login modal). Authenticated requests pass through; the backend still
 * authorizes the actual data calls, and an expired-but-present cookie is handled by
 * the refresh interceptor.
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

/**
 * Next middleware matcher config.
 *
 * @description
 * Scopes the middleware to the authenticated `(user)` route group so only those
 * paths pay the cookie check; everything public is untouched.
 */
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

## Route groups

```text
app/
├── (public)/        # no auth — home, articles, videos, shorts, lyrics
│   └── layout.tsx   # SSR-prefetch `me` + HydrationBoundary (spec 05)
└── (user)/          # logged-in — profile, bookmarks, playlists, settings, favorites
    └── layout.tsx   # sidebar; pages ship in the later phase
```

There is **no `(auth)` group** — auth is always the modal overlay.

## Home reads `?authRequired`

```tsx
// a small client effect on the home page
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useAuthModal } from "@/modules/auth/presentation/modal/AuthModalProvider";

/**
 * Opens the login modal when the user was redirected from a protected route
 * (`?authRequired=true`), e.g. by the middleware.
 */
export function useAuthRequiredPrompt() {
    const params = useSearchParams();
    const { open } = useAuthModal();
    useEffect(() => {
        if (params.get("authRequired") === "true") open("login");
    }, [params, open]);
}
```

> Most `(user)` pages (Settings etc.) ship in the **later** phase
> ([../17-open-questions.md](../17-open-questions.md)); the middleware + group are
> defined now so they're ready when the pages land.

---

## Verification

- [ ] A guest clicking a gated action opens the login modal and the action runs
      once after login.
- [ ] An unverified user is routed to verify-otp instead.
- [ ] Visiting `/playlists` while logged out redirects home and opens the modal.
- [ ] Reads remain open to guests.
- [ ] tsc + biome clean.
