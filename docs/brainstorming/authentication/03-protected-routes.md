# Protected Routes

## Route Groups

| Group | Auth Required | Examples |
| --- | --- | --- |
| `(public)` | No | Articles, videos, shorts, lyrics, home |
| `(user)` | Must be logged in | Profile, bookmarks, playlists, settings, favorites |

There is no `(auth)` route group. All auth forms are modals triggered via `AuthDialogProvider`, not separate pages.

## Middleware Protection

Next.js middleware runs before every request. It checks cookies and redirects unauthenticated users away from protected routes:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken");
    const refreshToken = request.cookies.get("refreshToken");

    if (!accessToken && !refreshToken) {
        // Store the intended URL so we can redirect after login
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

When an unauthenticated user tries to access `/playlists`, they are redirected to `/` with `?authRequired=true`. The home page can read this param and automatically open the login modal.

## Auth Modal for Interactions

For interactive features on public pages (like, comment, bookmark, share, rate), users are NOT redirected. The auth modal opens instead:

```typescript
"use client";

function LikeButton({ articleId }: { articleId: string }) {
    const { user } = useAuth();
    const { openAuth } = useAuthDialog();
    const like = useLikeArticle(articleId);

    const handleLike = () => {
        if (!user) {
            openAuth("LOGIN");
            return;
        }
        like.mutate();
    };

    return <button onClick={handleLike}>Like</button>;
}
```

This keeps the page accessible to everyone. Visitors can read articles, watch videos, and browse content without an account. The moment they want to interact, the login modal appears. After logging in, they can immediately perform the action without losing their place.

## User Pages

Authenticated user pages include:

| Page | Route | Content |
| --- | --- | --- |
| Profile | `/profile` | User info, avatar, settings link |
| Settings | `/settings` | Edit profile, change password, manage sessions |
| Bookmarks | `/bookmarks` | Bookmarked articles, videos, shorts |
| Favorites | `/favorites` | Liked articles, videos, shared content |
| Playlists | `/playlists` | User-created video playlists |

These pages use the `(user)` layout which includes a sidebar for navigation between them.
