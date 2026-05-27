# Token Management

## HttpOnly Cookies

The backend sets two HttpOnly cookies on login:

| Cookie | Lifetime | Purpose |
| --- | --- | --- |
| `accessToken` | ~60 minutes | Authorizes API requests |
| `refreshToken` | ~30 days | Refreshes expired access tokens |

HttpOnly means JavaScript cannot read or modify these cookies. They are sent automatically with every request to the API domain.

## Why HttpOnly Cookies

Both the dashboard and the frontend use HttpOnly cookies for token delivery. The tokens are never stored in localStorage or accessible to JavaScript. The backend sets the cookies automatically on login, and the browser sends them with every request to the API domain.

Benefits of HttpOnly cookies:

- Immune to XSS (scripts cannot read them)
- Sent automatically with every request (no manual Authorization header injection)
- No client-side token management needed
- No encryption libraries needed on the client

## User Data: No Client-Side Persistence

The dashboard uses `redux-persist` with `redux-persist-transform-encrypt` to store an encrypted copy of the user object in localStorage. This ensures the user state survives page refreshes without a flash of unauthenticated UI.

The frontend takes a different approach. There is no localStorage persistence. The user data lifecycle works like this:

### 1. User Logs In

The login happens via a modal. The backend sets HttpOnly cookies and returns the user object in the response body. The `useLogin()` React Query mutation calls `setUser(userData)` on the `AuthProvider` context. The user sees their avatar immediately. No page reload needed.

### 2. User Navigates Between Pages

Next.js App Router performs client-side navigation. The `AuthProvider` context holds the user in memory. No data is lost. No refetch needed. The user stays authenticated seamlessly.

### 3. User Refreshes the Page

The root layout is a Server Component that runs on every request. It reads the HttpOnly cookie, calls the backend profile API, and passes the fresh user object to `AuthProvider` as a prop. The context is initialized with the correct user. No localStorage needed.

```typescript
// app/layout.tsx (Server Component)
export default async function RootLayout({ children }) {
    const user = await getCurrentUser(); // reads cookie, calls API

    return (
        <AuthProvider user={user}>
            <AuthDialogProvider>
                {children}
            </AuthDialogProvider>
        </AuthProvider>
    );
}
```

### 4. User Closes Browser and Comes Back Later

The refresh token cookie is still there (30-day lifetime). The root layout fetches the user again on the next visit. Same flow as a page refresh.

### 5. Tokens Expire

If the access token expires, the Axios interceptor refreshes it automatically. If the refresh token also expires (user was away for 30+ days), the `getCurrentUser()` call returns null, and the `AuthProvider` initializes with no user. The login modal can be triggered again.

## Server-Side User Caching

The `getCurrentUser()` call happens on every full page load. Without caching, this means a database query on every request. The query itself is fast (2-5ms, primary key lookup on PostgreSQL over the internal network), but we can eliminate it almost entirely using Next.js server-side caching.

### Per-Request Deduplication

React's `cache()` function ensures that if multiple Server Components in the same render (e.g., `generateMetadata` and the page component) both call `getCurrentUser()`, the API is called only once:

```typescript
import { cache } from "react";

export const getCurrentUser = cache(async (): Promise<IUser | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;

    try {
        const client = await createServerApiClient();
        const response = await client.api.getOwnProfile();
        return AuthMapper.userFromDto(response.data.user);
    } catch {
        return null;
    }
});
```

### Cross-Request Caching

Next.js `unstable_cache` caches the result across multiple requests from the same user. Consecutive page loads within the cache window do not hit the backend at all:

```typescript
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

async function fetchUser(token: string): Promise<IUser | null> {
    try {
        const client = await createServerApiClient();
        const response = await client.api.getOwnProfile();
        return AuthMapper.userFromDto(response.data.user);
    } catch {
        return null;
    }
}

export async function getCurrentUser(): Promise<IUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;

    const getCachedUser = unstable_cache(
        () => fetchUser(token),
        [`user-${token}`],
        { revalidate: 30 } // cache for 30 seconds
    );

    return getCachedUser();
}
```

The cache key includes the access token, so different users get different cached results. The 30-second TTL means:

- First page load: fetches from the API (~2-5ms)
- Next 30 seconds of page loads: served from Next.js server cache (~0ms)
- After 30 seconds: refetches from the API
- If the user updates their profile, the stale data lasts at most 30 seconds

This eliminates the per-request API call cost without Redis, without any new infrastructure. The caching happens inside the Next.js server process, in memory.

### Why Not Redis

Redis would make the user profile lookup even faster, but it brings infrastructure complexity:

- A new service to run in dev, staging, and production
- Cache invalidation on every user profile change (avatar update, role change, account deactivation)
- Risk of serving stale data if invalidation is missed
- Memory management and eviction policies

The Next.js `unstable_cache` with a 30-second TTL gives 95% of the benefit with zero infrastructure. If profiling later shows the user profile query is a bottleneck, Redis can be added as a `CachedUserLookupService` in the backend without changing the frontend.

## Why No Client-Side Persistence

The dashboard needs `redux-persist` because it is a client-side SPA. There is no server render on every request. Without localStorage persistence, every page refresh would lose the user state entirely and show the login page until the API call completes.

The frontend does not have this problem because the root layout is a Server Component. The user data is fetched on the server (with caching) and injected into the HTML before it reaches the browser. There is no flash of unauthenticated content. There is no "loading user" state.

### Security Comparison

| Aspect | Dashboard | Frontend |
| --- | --- | --- |
| User data storage | Encrypted in localStorage | Next.js server cache + React context in browser memory |
| Visible in DevTools | Yes (encrypted blob in localStorage) | No (only in React component state) |
| Survives XSS attack | Encrypted, but key is in the bundle | Nothing to steal, data is only in memory |
| Stale data risk | Possible (localStorage survives until cleared) | 30 seconds max (server cache TTL) |
| Extra dependencies | `redux-persist`, `redux-persist-transform-encrypt` | None |

The frontend approach is more secure and simpler. The cost is one API call per full page load (~2-5ms for a primary key lookup on PostgreSQL over the internal network). This is negligible compared to the total page render time.

## CORS and Cookie Configuration

For cookies to work cross-origin (frontend on `116.cd`, API on `api.116.cd`):

Backend must set:
- `Access-Control-Allow-Origin: https://116.cd` (not `*`)
- `Access-Control-Allow-Credentials: true`
- Cookie attributes: `SameSite=None; Secure; HttpOnly; Domain=.116.cd`

Frontend must set:
- `withCredentials: true` on the Axios client

## Next.js Middleware for Route Protection

Middleware runs before every request. It checks cookies and redirects unauthenticated users away from protected routes:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken");
    const refreshToken = request.cookies.get("refreshToken");

    if (!accessToken && !refreshToken) {
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

When an unauthenticated user tries to access `/playlists`, they are redirected to `/` with `?authRequired=true`. The home page reads this param and automatically opens the login modal.
