import { type NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

/**
 * proxy
 *
 * @description
 * Admits protected routes while either session cookie can recover the user.
 * API authorization and the client auth guard remain the security boundary.
 *
 * @param request - The incoming request.
 * @returns A redirect when no recoverable session cookie exists.
 */
export function proxy(request: NextRequest) {
    const hasAccessToken = request.cookies.has(ACCESS_TOKEN_COOKIE);
    const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE);

    if (!hasAccessToken && !hasRefreshToken) {
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
