# Protected Routes

## Route Groups

The App Router uses route groups to apply different layouts and auth requirements:

| Group | Auth Required | Examples |
| --- | --- | --- |
| `(public)` | No | Articles, videos, shorts, lyrics, home |
| `(auth)` | Must NOT be logged in | Login, signup, forgot password |
| `(user)` | Must be logged in | Profile, bookmarks, playlists, settings |

## Middleware Protection

Next.js middleware runs before every request. It checks cookies and redirects if needed:

- Unauthenticated user visits `/profile` -> Redirect to `/login`
- Authenticated user visits `/login` -> Redirect to `/`

## Client-Side Auth Guard

For interactive features within public pages (like button on an article), do not redirect. Show a login prompt instead:

```typescript
"use client";

import { useAuth } from "@/shared/presentation/providers/AuthProvider";

export function AuthGuard({
    children,
    fallback,
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return fallback || <LoginPrompt />;
    }

    return children;
}
```

Usage:

```typescript
<AuthGuard fallback={<LoginToLikeButton />}>
    <LikeButton articleId={article.id} />
</AuthGuard>
```

This keeps the page accessible to everyone while gating interactions behind auth.
