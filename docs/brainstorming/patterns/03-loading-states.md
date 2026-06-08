# Loading States

## Server-Side Loading (loading.tsx)

Next.js automatically wraps each route segment in a Suspense boundary. The `loading.tsx` file renders while the page's Server Component is fetching data.

```typescript
// app/(public)/articles/loading.tsx
import { PageContainer } from "@/shared/presentation/components/PageContainer";
import { ArticleCardSkeleton } from "@/modules/articles/presentation/components/ArticleCard/skeleton";
import { Skeleton } from "@/shared/presentation/components/ui/skeleton";

export default function ArticlesLoading() {
    return (
        <PageContainer>
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                ))}
            </div>
        </PageContainer>
    );
}
```

### Rule: Skeletons Must Match Layout

A skeleton should have the exact same dimensions and layout as the loaded content. This prevents layout shift (bad for CLS score and user experience).

## Client-Side Loading (React Query)

For client-fetched data, use the query's `isLoading` state:

```typescript
const { data, isLoading } = useArticleComments(articleId);

if (isLoading) {
    return <CommentSkeleton count={3} />;
}
```

## Streaming with Suspense

For pages with multiple independent data sources, wrap each section in its own Suspense boundary. This lets fast sections render immediately while slow sections show skeletons:

```typescript
export default function HomePage() {
    return (
        <>
            <HeroBanner />
            <Suspense fallback={<PromotedArticlesSkeleton />}>
                <PromotedArticles />
            </Suspense>
            <Suspense fallback={<PromotedVideosSkeleton />}>
                <PromotedVideos />
            </Suspense>
            <Suspense fallback={<LatestShortsSkeleton />}>
                <LatestShorts />
            </Suspense>
        </>
    );
}
```

Each section streams to the browser as soon as its data is ready. The user sees content progressively instead of waiting for everything.

## NProgress (Optional)

For page navigations, consider a top progress bar like the dashboard uses:

```typescript
"use client";

import NProgress from "nprogress";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function NavigationProgress() {
    const pathname = usePathname();
    const prevPathname = useRef(pathname);

    useEffect(() => {
        if (prevPathname.current !== pathname) {
            NProgress.done();
            prevPathname.current = pathname;
        }
    }, [pathname]);

    return null;
}
```
