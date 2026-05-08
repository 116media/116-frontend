# State Management: React Query + React Context

## The Decision

The frontend uses **React Query** for all data fetching and mutations, and **React Context** for auth modal state and current user. No Redux. No additional state management libraries.

This decision was made after analyzing three codebases:

- The **116 dashboard** uses Redux Toolkit for everything (client-side SPA, no server rendering)
- The **kinix_frontend** uses Redux Toolkit for everything (Next.js Pages Router, no Server Components)
- The **116 frontend** uses Next.js 16 App Router with Server Components, which changes the equation entirely

## Why Not Redux

The dashboard and kinix_frontend both use Redux because they are fully client-rendered. Every piece of data lives in the Redux store, persisted to localStorage, and accessed via selectors. This made sense at the time.

The 116 frontend is different:

1. **Server Components fetch page content.** An article page renders on the server. The data never enters a client-side store. There is nothing to manage.

2. **HttpOnly cookies handle tokens.** The backend sets `accessToken` and `refreshToken` as HttpOnly cookies. The frontend never sees, stores, or manages tokens. No token management code needed on the client.

3. **The root layout re-fetches the user.** On every request, the Server Component in `app/layout.tsx` reads the cookie and fetches the current user from the API. The user object is always fresh from the server. No localStorage persistence needed.

4. **Two libraries for one job.** If you use Redux for auth + user and React Query for data, every developer has to decide "is this a Redux thing or a React Query thing?" for every new feature. That is unnecessary cognitive overhead.

5. **Bundle size.** Redux Toolkit + Redux Persist + middleware adds ~40KB to the client bundle. React Context is built into React. React Query is already needed for mutations. Adding Redux on top brings zero value for real cost.

## The "Auth Modal Needs Global State" Argument

The kinix_frontend uses Redux for auth modal state because the login modal can be triggered from anywhere (header button, like button, comment form, bookmark button, etc.). This looks like a Redux use case.

But look at what the state actually is:

```typescript
{ isOpen: boolean; context: "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD" | "RESET_PASSWORD" | "VERIFY_OTP" }
```

That is a boolean and a string. React Context handles this in 20 lines:

```typescript
"use client";

import { createContext, useContext, useState, useCallback } from "react";

type AuthDialogContext = "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD" | "RESET_PASSWORD" | "VERIFY_OTP";

interface IAuthDialogContext {
    isOpen: boolean;
    context: AuthDialogContext;
    openAuth: (context: AuthDialogContext) => void;
    closeAuth: () => void;
}

const AuthDialogContext = createContext<IAuthDialogContext>({
    isOpen: false,
    context: "LOGIN",
    openAuth: () => {},
    closeAuth: () => {},
});

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [context, setContext] = useState<AuthDialogContext>("LOGIN");

    const openAuth = useCallback((ctx: AuthDialogContext) => {
        setContext(ctx);
        setIsOpen(true);
    }, []);

    const closeAuth = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <AuthDialogContext.Provider value={{ isOpen, context, openAuth, closeAuth }}>
            {children}
        </AuthDialogContext.Provider>
    );
}

export const useAuthDialog = () => useContext(AuthDialogContext);
```

Any component can trigger the modal:

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

This is identical to the Redux pattern (`dispatch(showDialog(...))`) but without Redux. The provider sits at the root layout, the modal renders there, and any component anywhere in the tree calls `openAuth("LOGIN")`.

## The "Current User Needs Persistence" Argument

The kinix_frontend uses Redux Persist to keep the user object in localStorage so it survives page refreshes and navigation.

With Next.js App Router, this is unnecessary. The root layout is a Server Component that runs on every request:

```typescript
// app/layout.tsx (Server Component)
export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser(); // Reads cookie, calls API

    return (
        <html lang="fr">
            <body>
                <AuthProvider user={user}>
                    <AuthDialogProvider>
                        {children}
                    </AuthDialogProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
```

On every page load, the server reads the HttpOnly cookie, fetches the user profile, and passes it to the AuthProvider. The user data is always fresh. No localStorage, no persistence library, no hydration mismatches.

The AuthProvider is simple:

```typescript
"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface IAuthContext {
    user: IUser | null;
    isAuthenticated: boolean;
    setUser: (user: IUser | null) => void;
}

const AuthContext = createContext<IAuthContext>({
    user: null,
    isAuthenticated: false,
    setUser: () => {},
});

export function AuthProvider({
    children,
    user: initialUser,
}: {
    children: React.ReactNode;
    user: IUser | null;
}) {
    const [user, setUser] = useState<IUser | null>(initialUser);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
```

After a successful login mutation, call `setUser(userData)` to update the context. The modal closes, the header shows the avatar, and every interaction button now knows the user is authenticated. No Redux dispatch, no reducer, no selector.

## Architecture Overview

### Server Components: Page Content (SEO)

Articles, videos, shorts, lyrics pages are Server Components. They fetch data directly from the API, render HTML, and ship zero JavaScript for the content itself.

```typescript
// Server Component - no client state needed
export default async function ArticleDetailPage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticle(slug);

    return (
        <>
            <ArticleHeader article={article} />
            <ArticleBody content={article.body} />
            <ArticleInteractions articleId={article.id} />
        </>
    );
}
```

### React Query: Data Fetching + Mutations (Client)

All client-side data operations use React Query:

**Fetching user-specific data:**

```typescript
"use client";

export function useUserBookmarks() {
    const { isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ["bookmarks"],
        queryFn: () => apiClient.api.getBookmarks(),
        enabled: isAuthenticated, // Only fetch if logged in
        staleTime: 5 * 60 * 1000,
    });
}
```

**Mutations with optimistic updates:**

```typescript
"use client";

export function useLikeArticle(articleId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => apiClient.api.likeArticle(articleId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["article-like", articleId] });
            queryClient.setQueryData(["article-like", articleId], (old: any) => ({
                ...old,
                isLiked: true,
                likeCount: (old?.likeCount ?? 0) + 1,
            }));
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["article-like", articleId] });
        },
    });
}
```

**Infinite scroll:**

```typescript
"use client";

export function usePublishedArticles(categoryId?: string) {
    return useInfiniteQuery({
        queryKey: ["articles", categoryId],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await apiClient.api.getPublishedArticles({
                pageIndex: pageParam,
                pageSize: 12,
                categoryId,
            });
            return response.data.articles;
        },
        getNextPageParam: (lastPage) => {
            const nextIndex = lastPage.pageIndex + 1;
            const totalPages = Math.ceil(lastPage.count / lastPage.pageSize);
            return nextIndex < totalPages ? nextIndex : undefined;
        },
        initialPageParam: 0,
    });
}
```

**Auth actions (login, signup):**

```typescript
"use client";

export function useLogin() {
    const { setUser } = useAuth();
    const { closeAuth } = useAuthDialog();

    return useMutation({
        mutationFn: (credentials: ILoginCredentials) =>
            apiClient.api.publicLogin(credentials),
        onSuccess: (response) => {
            // HttpOnly cookies set automatically by the backend
            setUser(AuthMapper.userFromDto(response.data.user));
            closeAuth();
        },
    });
}
```

### React Context: Auth State + Auth Modal (Client)

Two small contexts, both provided at the root layout:

| Context | State | Used By |
| --- | --- | --- |
| `AuthProvider` | `user`, `isAuthenticated`, `setUser` | Header, every interaction button, protected pages, comment forms |
| `AuthDialogProvider` | `isOpen`, `context`, `openAuth`, `closeAuth` | Header login button, like/bookmark/share/comment/rate buttons, auth modal forms |

### Local State: UI

Component-level state for things that do not need to be shared:

- Form inputs (React Hook Form)
- Dropdown open/close
- Scroll position
- Animation state

## The Auth Interaction Pattern

This is the most important pattern in the frontend. Every interaction button follows it:

```typescript
"use client";

function InteractionButton({ onAction, children }: Props) {
    const { user } = useAuth();
    const { openAuth } = useAuthDialog();

    const handleClick = () => {
        if (!user) {
            openAuth("LOGIN");
            return;
        }
        onAction();
    };

    return <button onClick={handleClick}>{children}</button>;
}
```

Used by: LikeButton, BookmarkButton, ShareButton, CommentForm, RatingStars, AddToPlaylistButton. All check auth first, show the login modal if needed, perform the action if authenticated.

## How swagger-typescript-api Fits In

The generated API client works everywhere:

| Context | Where Called | Example |
| --- | --- | --- |
| Page content (SSR) | Server Component | `const client = await createServerApiClient(); client.api.getArticleBySlug(slug)` |
| Content lists (client) | React Query | `useQuery({ queryFn: () => apiClient.api.getPublishedArticles(params) })` |
| Mutations (client) | React Query | `useMutation({ mutationFn: () => apiClient.api.likeArticle(id) })` |
| Auth actions (client) | React Query | `useMutation({ mutationFn: () => apiClient.api.publicLogin(credentials) })` |

The API client class is the same everywhere. Only the calling context changes.

## Summary

| Concern | Tool | Why |
| --- | --- | --- |
| Page content (articles, videos) | Server Component | SEO, zero JS |
| Auth modal state | React Context (`AuthDialogProvider`) | Simple boolean + string, 20 lines |
| Current user | React Context (`AuthProvider`) | Server-fetched on every request, no persistence needed |
| Auth actions (login, signup, logout) | React Query mutation | Updates context on success, HttpOnly cookies handle tokens |
| Content mutations (like, comment) | React Query mutation | Optimistic updates, cache invalidation |
| User data lists (bookmarks, playlists) | React Query | Caching, refetching, enabled only when authenticated |
| Infinite scroll lists | React Query `useInfiniteQuery` | Pagination, caching, scroll restoration |
| SEO metadata | Next.js Metadata API | Server-side |
| Form state | React Hook Form | Local |
| UI state (dropdowns, tooltips) | useState | Local |

No Redux. No Redux Persist. No next-redux-wrapper. No additional state management libraries. React Query is already needed. React Context is built into React. Two small providers handle everything Redux would have handled, with less code and no extra dependencies.
