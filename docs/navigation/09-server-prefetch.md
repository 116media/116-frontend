# Server Prefetch

## Why Prefetch on the Server

The mega menu should be instant on first hover. If data were fetched client-side inside the mega menu components (on mount or on hover), the user would see a loading flash every time they opened the panel — or at best, only after the panel had already rendered once.

Fetching in the root layout server component eliminates this entirely. The HTML delivered to the browser already contains the data. By the time the page is interactive, `DesktopNav` has its props populated and the mega menu renders immediately on first hover with no network round-trip.

## Fetch Location: Public Layout

```typescript
// app/(public)/layout.tsx (simplified)
import { createServerApiClient } from "@/shared/infrastructure/api/server-client";
import {
    getArticleCategoriesForMenu,
    getPromotedArticlesForMenu,
    getArticlePopularTagsForMenu
} from "@/modules/articles/infrastructure/repositories/articles.repository.impl";
import {
    getVideoCategoriesForMenu,
    getPromotedVideosForMenu,
    getVideoPopularTagsForMenu
} from "@/modules/videos/infrastructure/repositories/videos.repository.impl";
import { Header } from "@/shared/presentation/layouts/Header";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    // Fetch all 6 data sets in parallel
    const [
        articleCategories,
        promotedArticles,
        articlePopularTags,
        videoCategories,
        promotedVideos,
        videoPopularTags
    ] = await Promise.all([
        getArticleCategoriesForMenu(),
        getPromotedArticlesForMenu(),
        getArticlePopularTagsForMenu(),
        getVideoCategoriesForMenu(),
        getPromotedVideosForMenu(),
        getVideoPopularTagsForMenu()
    ]);

    return (
        <>
            <div className="sticky top-0 z-40">
                <Header
                    articleCategories={articleCategories}
                    promotedArticles={promotedArticles}
                    articlePopularTags={articlePopularTags}
                    videoCategories={videoCategories}
                    promotedVideos={promotedVideos}
                    videoPopularTags={videoPopularTags}
                />
            </div>
            <main>{children}</main>
        </>
    );
}
```

## Data Flow

```text
PublicLayout (server component)
  └── fetches all 6 data sets in parallel via Promise.all
        └── Header (server component)
              └── DesktopNav ("use client", receives data as props)
                    ├── ArticlesMegaMenu (props: categories, promotedArticles, popularTags ← IArticlePopularTagEntity[])
                    └── VideosMegaMenu   (props: categories, promotedVideos,   popularTags ← IVideoPopularTagEntity[])
```

Popular tags are **not shared** between panels. Each panel receives tags filtered by its own content type.

## Endpoints Called at Startup

All six calls happen in parallel on every server render of the public layout. All are public and unauthenticated.

| Call | Endpoint | Notes |
| --- | --- | --- |
| `getArticleCategoriesForMenu()` | `GET /api/v1/public/content-types` → `GET /api/v1/public/categories?contentTypeId={id}` | Two sequential calls inside the function |
| `getPromotedArticlesForMenu()` | `GET /api/v1/public/articles/promoted` | Slices to 4 client-side |
| `getArticlePopularTagsForMenu()` | `GET /api/v1/public/tags/popular?limit=10&contentType=Article` | Top 10 tags by article usage; cached 10 min |
| `getVideoCategoriesForMenu()` | `GET /api/v1/public/content-types` → `GET /api/v1/public/categories?contentTypeId={id}` | Two sequential calls; `content-types` is deduplicated by Next.js fetch cache |
| `getPromotedVideosForMenu()` | `GET /api/v1/public/videos/promoted` | Slices to 4 client-side |
| `getVideoPopularTagsForMenu()` | `GET /api/v1/public/tags/popular?limit=10&contentType=Video` | Top 10 tags by video usage; cached 10 min |

## Next.js Request Deduplication

Both `getArticleCategoriesForMenu()` and `getVideoCategoriesForMenu()` internally call `GET /api/v1/public/content-types`. Next.js automatically deduplicates identical `fetch()` calls within the same render pass — the endpoint is only hit once even though two functions call it.

## Error Handling

If any fetch fails, the layout should not crash the entire page. Wrap the `Promise.all` in a try/catch and fall back to empty arrays so `DesktopNav` still renders with whatever data succeeded:

```typescript
const [
    articleCategories,
    promotedArticles,
    articlePopularTags,
    videoCategories,
    promotedVideos,
    videoPopularTags
] = await Promise.allSettled([
    getArticleCategoriesForMenu(),
    getPromotedArticlesForMenu(),
    getArticlePopularTagsForMenu(),
    getVideoCategoriesForMenu(),
    getPromotedVideosForMenu(),
    getVideoPopularTagsForMenu()
]).then((results) => results.map((r) => (r.status === "fulfilled" ? r.value : [])));
```
