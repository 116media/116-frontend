# Server-Side Data Fetching

## How It Works

In Next.js 16 App Router, Server Components are `async` functions. You fetch data directly in the component body. No `useEffect`, no loading spinners, no client-side state.

```typescript
export default async function ArticlesPage() {
    const scope = await getServerScope();
    const result = await scope.cradle.articlesRepository.getPublishedArticles({
        pageIndex: 0,
        pageSize: 12,
    });

    if (!result.ok) {
        throw new Error(result.error.detail);
    }

    return <ArticleGrid articles={result.value.items} />;
}
```

The page renders on the server, returns fully formed HTML, and the browser displays it immediately. No JavaScript needed for the content itself.

## When to Fetch on the Server

| Data | Fetch on Server | Why |
| --- | --- | --- |
| Article list | Yes | SEO, fast first paint |
| Article detail | Yes | SEO, structured data |
| Video list | Yes | SEO, thumbnails in HTML |
| Lyrics content | Yes | SEO is the entire point of lyrics pages |
| Featured content | Yes | Above the fold on home page |
| Categories | Yes | Navigation data, rarely changes |
| User bookmarks | No | User-specific, requires auth |
| Comments | Partially | First page on server, load more on client |

## Error Handling

Use Next.js error boundaries for server-side errors:

```typescript
// app/(public)/articles/[slug]/error.tsx
"use client";

export default function ArticleError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
            <p className="text-muted-foreground mt-2">{error.message}</p>
            <button onClick={reset} className="mt-4">Réessayer</button>
        </div>
    );
}
```

For 404s, use `notFound()`:

```typescript
import { notFound } from "next/navigation";

export default async function ArticleDetailPage({ params }: Props) {
    const result = await repository.getArticleBySlug(slug);

    if (!result.ok) {
        notFound();
    }

    return <ArticleDetailContainer article={result.value} />;
}
```

## Request Deduplication

Next.js automatically deduplicates `fetch()` calls with the same URL during a single render. But since we use Axios (via the generated client), not native `fetch()`, we do not get automatic deduplication.

To avoid duplicate requests (e.g., `generateMetadata` and the page component both fetch the same article), use React's `cache()`:

```typescript
import { cache } from "react";

export const getArticle = cache(async (slug: string) => {
    const scope = await getServerScope();
    return scope.cradle.articlesRepository.getArticleBySlug(slug);
});

// Both calls below hit the API only once per request
export async function generateMetadata({ params }) {
    const result = await getArticle(params.slug);
    // ...
}

export default async function ArticlePage({ params }) {
    const result = await getArticle(params.slug);
    // ...
}
```

## Loading States

Every route segment can have a `loading.tsx` that shows while the Server Component is fetching:

```typescript
// app/(public)/articles/loading.tsx
export default function Loading() {
    return <ArticleGridSkeleton count={12} />;
}
```

Next.js wraps the page in a `<Suspense>` boundary with this loading component automatically.
