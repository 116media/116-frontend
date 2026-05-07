# Pagination (Infinite Scroll)

## Backend Pagination Format

All list endpoints return:

```typescript
{
    items: T[];
    pageIndex: number;  // Zero-based
    pageSize: number;
    count: number;      // Total items across all pages
}
```

## Infinite Scroll Everywhere

All content lists (articles, videos, shorts, comments, playlists) use infinite scroll. There is no traditional page-based pagination on the frontend. The user scrolls down, more content loads automatically.

This fits the 116 audience: primarily mobile users consuming content in a feed-style experience, similar to Instagram or TikTok.

## Implementation with React Query

Every list page is a Client Component that uses `useInfiniteQuery`:

```typescript
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/infrastructure/api/client";

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

## Intersection Observer Hook

A reusable hook that triggers `fetchNextPage` when a sentinel element enters the viewport:

```typescript
"use client";

import { useEffect, useRef } from "react";

export function useInfiniteScrollRef(
    fetchNextPage: () => void,
    hasNextPage: boolean | undefined
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage]);

    return ref;
}
```

The `rootMargin: "200px"` triggers the fetch 200px before the sentinel is visible, so content loads before the user reaches the bottom. No visible loading gap.

## Feed Component Pattern

Every content list follows the same structure:

```typescript
"use client";

import { usePublishedArticles } from "@/modules/articles/presentation/hooks/usePublishedArticles";
import { useInfiniteScrollRef } from "@/shared/presentation/hooks/useInfiniteScrollRef";
import { ArticleCard } from "@/modules/articles/presentation/components/ArticleCard";
import { ArticleCardSkeleton } from "@/modules/articles/presentation/components/ArticleCard/skeleton";

interface Props {
    categoryId?: string;
}

export function ArticleFeed({ categoryId }: Props) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = usePublishedArticles(categoryId);

    const sentinelRef = useInfiniteScrollRef(fetchNextPage, hasNextPage);

    const articles = data?.pages.flatMap((page) => page.items) ?? [];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return <ErrorMessage failure={error} />;
    }

    if (articles.length === 0) {
        return <EmptyState message="Aucun article pour le moment." />;
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>

            {/* Sentinel element triggers next page fetch */}
            <div ref={sentinelRef} className="h-1" />

            {isFetchingNextPage && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <ArticleCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {!hasNextPage && articles.length > 0 && (
                <p className="text-center text-muted-foreground py-8">
                    Vous avez tout vu.
                </p>
            )}
        </>
    );
}
```

## SEO Considerations

Infinite scroll is client-rendered, which means Google only sees the first page of content in the initial HTML. To ensure all content is indexable:

1. **Server-render the first page.** The list page's Server Component fetches the first batch and passes it to the feed as `initialData`:

```typescript
// app/(public)/articles/page.tsx (Server Component)
export default async function ArticlesPage() {
    const repository = new ArticlesRepositoryImpl();
    const result = await repository.getPublishedArticles({ pageIndex: 0, pageSize: 12 });

    const initialData = result.ok ? result.value : null;

    return (
        <PageContainer>
            <h1 className="text-3xl font-bold mb-6">Articles</h1>
            <ArticleFeed initialData={initialData} />
        </PageContainer>
    );
}
```

```typescript
// ArticleFeed receives initialData for SSR
export function ArticleFeed({ initialData, categoryId }: Props) {
    const query = usePublishedArticles(categoryId);

    // Use initialData for the first render (SSR), then React Query takes over
    const articles = query.data?.pages.flatMap((page) => page.items)
        ?? initialData?.items
        ?? [];

    // ...
}
```

2. **Each article/video has its own detail page** (`/articles/[slug]`). These detail pages are fully server-rendered with complete SEO metadata. Google indexes individual content through these pages, not through the infinite scroll list.

3. **The sitemap includes all content URLs.** Even if Google cannot scroll the infinite feed, it discovers all articles and videos through `sitemap.xml`.

## Filtering with Infinite Scroll

When the user applies a filter (category, search), reset the infinite query:

```typescript
"use client";

import { useState } from "react";

export function ArticlesPageContent({ categories }) {
    const [categoryId, setCategoryId] = useState<string | undefined>();

    return (
        <>
            <CategoryFilter
                categories={categories}
                selected={categoryId}
                onChange={setCategoryId}
            />
            {/* Key forces remount, which resets the infinite query */}
            <ArticleFeed key={categoryId ?? "all"} categoryId={categoryId} />
        </>
    );
}
```

The `key` prop forces React to unmount and remount the feed, which resets `useInfiniteQuery` to page 0 with the new filter.

## Page Sizes

| Content | Page Size | Why |
| --- | --- | --- |
| Articles | 12 | 3x4 grid on desktop, loads fast |
| Videos | 12 | Same grid layout |
| Shorts | 16 | Smaller cards, 4x4 grid |
| Comments | 10 | Text-heavy, fewer per batch |

## Scroll Position Restoration

When a user clicks an article, reads it, and presses back, they should return to their scroll position in the feed. React Query caches the loaded pages, so the data is still there. The browser handles scroll restoration automatically with Next.js App Router.

If scroll restoration does not work reliably, store the scroll position in `sessionStorage`:

```typescript
useEffect(() => {
    const saved = sessionStorage.getItem("articles-scroll");
    if (saved) {
        window.scrollTo(0, parseInt(saved, 10));
        sessionStorage.removeItem("articles-scroll");
    }
}, []);

// Before navigating to detail page
const handleCardClick = (slug: string) => {
    sessionStorage.setItem("articles-scroll", String(window.scrollY));
    router.push(`/articles/${slug}`);
};
```
