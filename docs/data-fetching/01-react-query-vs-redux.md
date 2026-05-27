# React Query vs Redux Toolkit

## The Decision

The dashboard uses Redux Toolkit for everything. The frontend should NOT follow that pattern. Here is why, and what to use instead.

## Why Redux Works for the Dashboard

The dashboard is a Vite single-page app. There is no server rendering. Every piece of data goes through this flow:

```text
Component mounts
  -> Dispatch Redux thunk
    -> UseCase calls Repository
      -> Repository calls API
    -> Store updated
  -> Component re-renders from selector
```

This works because:

- The dashboard is entirely client-rendered
- Admin users stay on the page for long sessions, so cached Redux state is valuable
- Multiple components on the same page read from the same slice (articles table + article count + sidebar badge all share `articles.getArticles.data`)
- Encrypted persistence keeps auth tokens safe across browser refreshes

## Why Redux Does NOT Work for the Frontend

The frontend is a Next.js app with Server Components. Most pages are read-heavy content pages (articles, videos, lyrics) that benefit from server-side rendering for SEO and performance.

Problems with Redux on the frontend:

1. **Server Components cannot use Redux.** They run on the server and have no access to the Redux store. You would need to wrap every page in a Client Component boundary just to access the store, which defeats the purpose of Server Components.

2. **Hydration mismatch.** Server-rendered HTML and client-rendered Redux state can diverge, causing React hydration errors.

3. **Overkill for read-only data.** A visitor reading an article does not need a global store. The article data is fetched once, rendered, and never mutated by the user.

4. **No encrypted persistence needed.** The frontend uses HttpOnly cookies for auth. There is nothing to persist on the client.

5. **Bundle size.** Redux Toolkit, redux-persist, redux-persist-transform-encrypt, and the logging middleware add ~40KB to the client bundle. Visitors on mobile connections feel this.

## The Architecture: Server Components + React Query

### Read Operations: Server Components

For pages that display content (articles, videos, shorts, lyrics), the data is fetched directly in a Server Component. No client-side state needed.

```typescript
// Server Component - runs on the server, no JS shipped to client
export default async function ArticleDetailContainer({ slug }: { slug: string }) {
    const repository = new ArticlesRepositoryImpl();
    const result = await repository.getArticleBySlug(slug);

    if (!result.ok) {
        notFound();
    }

    const article = result.value;

    return (
        <>
            <ArticleHeader article={article} />
            <ArticleBody content={article.body} />
            <ArticleTags tags={article.tags} />
            {/* Client boundary only where interactivity is needed */}
            <ArticleInteractions articleId={article.id} />
        </>
    );
}
```

This approach:

- Renders the full article HTML on the server (great for SEO)
- Ships zero JavaScript for the article content itself
- Only hydrates the interactive parts (like button, comment form)

### Mutations: React Query

For user interactions that modify data (likes, comments, bookmarks, playlists), use React Query (TanStack Query). It handles:

- Optimistic updates (show the like immediately, revert if it fails)
- Cache invalidation (refetch comments after posting a new one)
- Loading and error states
- Retry logic

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLikeArticle(articleId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => apiClient.api.likeArticle(articleId),
        onMutate: async () => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ["article", articleId] });
            queryClient.setQueryData(["article", articleId], (old) => ({
                ...old,
                isLiked: true,
                likeCount: old.likeCount + 1,
            }));
        },
        onError: (err, variables, context) => {
            // Revert on failure
            queryClient.invalidateQueries({ queryKey: ["article", articleId] });
        },
    });
}
```

### Client-Side Data: React Query

Some data needs to be fetched on the client (user's bookmarks, playlist contents, session info). Use React Query for these too:

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";

export function useUserBookmarks() {
    return useQuery({
        queryKey: ["bookmarks"],
        queryFn: () => apiClient.api.getBookmarks(),
        staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    });
}
```

### Auth State: React Context + Cookies

Auth is the one piece of global state. But it does not need Redux. The backend sets HttpOnly cookies, so the frontend never handles tokens directly. The only thing the client needs to know is "am I logged in and who am I?"

```typescript
// AuthProvider wraps the app
export function AuthProvider({ children, user }: { children: ReactNode; user: IUser | null }) {
    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

// In root layout (Server Component)
export default async function RootLayout({ children }) {
    const user = await getCurrentUser(); // reads cookie, calls API
    return (
        <AuthProvider user={user}>
            {children}
        </AuthProvider>
    );
}
```

## How swagger-typescript-api Fits In

The generated API client from swagger-typescript-api works the same way as in the dashboard. It produces an Axios-based `Api` class with typed methods for every endpoint.

The difference is WHERE the client is called:

| Context | Dashboard | Frontend |
| --- | --- | --- |
| Read data | Redux thunk (client) | Server Component (server) or React Query (client) |
| Mutate data | Redux thunk (client) | React Query mutation (client) |
| Auth state | Redux slice + encrypted persist | React Context + HttpOnly cookies |

The API client class itself does not change. The `apiClient.api.getArticleBySlug(slug)` call works in both Server Components (Node.js) and Client Components (browser), as long as the base URL is configured correctly for each environment.

### Server-Side API Calls

For Server Components, you need a server-side API client that includes cookies from the incoming request:

```typescript
// Server-side client factory
import { cookies } from "next/headers";

export async function createServerApiClient() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    return new Api({
        baseURL: process.env.API_INTERNAL_URL, // Internal URL, not public
        headers: {
            Cookie: cookieStore.toString(),
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
    });
}
```

## Summary

| Concern | Tool | Where |
| --- | --- | --- |
| Page content (articles, videos) | Direct fetch in Server Component | Server |
| SEO metadata | Next.js Metadata API | Server |
| User interactions (like, comment) | React Query mutations | Client |
| User-specific lists (bookmarks) | React Query queries | Client |
| Auth state | React Context + HttpOnly cookies | Both |
| Form state | React Hook Form or native | Client |
| UI state (modals, dropdowns) | React useState/useReducer | Client |

No Redux. No encrypted persistence. No global store for API data. Server Components handle the heavy lifting, React Query handles the interactivity.
