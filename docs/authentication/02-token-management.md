# Token Management

## HttpOnly Cookies

The backend sets two HttpOnly cookies on login:

| Cookie | Lifetime | Purpose |
| --- | --- | --- |
| `accessToken` | ~60 minutes | Authorizes API requests |
| `refreshToken` | ~30 days | Refreshes expired access tokens |

HttpOnly means JavaScript cannot read or modify these cookies. They are sent automatically with every request to the API domain.

## Why Not localStorage

The dashboard stores encrypted tokens in localStorage. This works for an admin panel but is not ideal for a public website:

- localStorage is accessible to any JavaScript on the page (XSS risk)
- Encryption adds client-side complexity and bundle size
- HttpOnly cookies are immune to XSS (scripts cannot read them)
- Cookies are sent automatically (no need for manual Authorization header injection)

## CORS and Cookie Configuration

For cookies to work cross-origin (frontend on `116.cd`, API on `api.116.cd`):

Backend must set:
- `Access-Control-Allow-Origin: https://116.cd` (not `*`)
- `Access-Control-Allow-Credentials: true`
- Cookie attributes: `SameSite=None; Secure; HttpOnly; Domain=.116.cd`

Frontend must set:
- `withCredentials: true` on the Axios client

## Next.js Middleware for Token Refresh

Use Next.js middleware to refresh tokens before they expire, preventing flashes of unauthenticated content:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken");
    const refreshToken = request.cookies.get("refreshToken");

    // Protected routes require authentication
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/profile")
        || request.nextUrl.pathname.startsWith("/bookmarks")
        || request.nextUrl.pathname.startsWith("/playlists")
        || request.nextUrl.pathname.startsWith("/settings");

    if (isProtectedRoute && !accessToken && !refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile/:path*", "/bookmarks/:path*", "/playlists/:path*", "/settings/:path*"],
};
```
