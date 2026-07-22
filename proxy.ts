import { type NextRequest, NextResponse } from "next/server";

/**
 * proxy
 *
 * @description
 * Server-side guard for the authenticated `(private)` route group (Next.js 16 renamed
 * the former `middleware` file convention to `proxy`). Runs before those routes
 * render: if the `accessToken` cookie is absent, the visitor is redirected to the
 * home page, where they can open the login modal. Cookie presence is a cheap gate —
 * the backend still authorizes every request, and an expired access token is renewed
 * once on the page by the client refresh interceptor.
 *
 * Kept dependency-light (only `next/server`) as the Proxy runtime advises against
 * relying on shared app modules.
 *
 * @param request - The incoming request.
 * @returns A redirect to `/` when unauthenticated, otherwise continues.
 */
export function proxy(request: NextRequest) {
    if (!request.cookies.has("accessToken")) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}

/**
 * Scopes the proxy to the authenticated `(private)` route group so only those paths pay
 * the cookie check; everything public is untouched.
 */
export const config = {
    matcher: ["/profile/:path*", "/playlists/:path*", "/settings/:path*", "/favorites/:path*"]
};
