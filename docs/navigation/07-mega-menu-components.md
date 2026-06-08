# Mega Menu Components

## Overview

Each content type has its own self-contained mega menu component tree inside its module. The articles mega menu and the videos mega menu are independent — they share no code beyond the `NavigationMenu` UI primitive from `shared/presentation/components/ui/`.

Both panels have three columns: categories on the left, promoted content in the centre, and popular tags on the right. Popular tags are **not shared** — each panel fetches tags filtered by its own content type (`contentType=Article` for articles, `contentType=Video` for videos), so the tag lists reflect content-type-specific popularity.

**Both mega menu components are purely presentational.** All data is fetched server-side in the root layout and passed in as props. There are no client-side hooks or loading states inside these components. See [Server Prefetch](09-server-prefetch.md) for the fetch strategy.

---

## Articles Mega Menu

### Directory

```text
src/modules/articles/presentation/components/ArticlesMegaMenu/
  index.tsx                          ← root, receives all data as props
  ArticlesMegaCategoryList.tsx
  ArticlesPromotedCard.tsx
  ArticlesMegaTagList.tsx            ← article popular tags right column
  types.ts
```

### types.ts

```typescript
// src/modules/articles/presentation/components/ArticlesMegaMenu/types.ts
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import type { IArticlePopularTagEntity } from "@/modules/articles/domain/entities/IArticlePopularTagEntity";

export interface ArticlesMegaMenuProps {
    categories: IArticleCategoryEntity[];
    promotedArticles: IArticleSummaryEntity[];
    popularTags: IArticlePopularTagEntity[];
}

export interface ArticlesMegaCategoryListProps {
    categories: IArticleCategoryEntity[];
}

export interface ArticlesPromotedCardProps {
    article: IArticleSummaryEntity;
}

export interface ArticlesMegaTagListProps {
    popularTags: IArticlePopularTagEntity[];
}
```

### ArticlesMegaCategoryList

```typescript
// src/modules/articles/presentation/components/ArticlesMegaMenu/ArticlesMegaCategoryList.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import type { ArticlesMegaCategoryListProps } from "./types";

/**
 * ArticlesMegaCategoryList
 *
 * @description
 * Left column of the articles mega menu. A vertical list of active article
 * categories, each linking to the articles listing page filtered by slug.
 */
export function ArticlesMegaCategoryList({ categories }: ArticlesMegaCategoryListProps) {
    return (
        <div className="flex flex-col gap-0.5">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Catégories
            </p>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`${ARTICLES_PATH}?category=${category.slug}`}
                    className={cn(
                        "flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-foreground transition-colors",
                        "hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    <span>{category.name}</span>
                    <ChevronRight size={14} className="shrink-0 text-muted-foreground" />
                </Link>
            ))}
        </div>
    );
}
```

### ArticlesPromotedCard

```typescript
// src/modules/articles/presentation/components/ArticlesMegaMenu/ArticlesPromotedCard.tsx
import Image from "next/image";
import Link from "next/link";
import { ARTICLE_DETAIL_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import type { ArticlesPromotedCardProps } from "./types";

/**
 * ArticlesPromotedCard
 *
 * @description
 * A horizontal card for the centre column of the articles mega menu.
 * Shows the cover image (or a placeholder), the title, and the headline.
 * Links to the article detail page.
 */
export function ArticlesPromotedCard({ article }: ArticlesPromotedCardProps) {
    const href = ARTICLE_DETAIL_PATH.replace(":slug", article.slug);

    return (
        <Link
            href={href}
            className={cn(
                "flex items-start gap-3 rounded-md p-2 transition-colors",
                "hover:bg-accent"
            )}
        >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {article.coverImageUrl ? (
                    <Image
                        fill
                        src={article.coverImageUrl}
                        alt={article.title}
                        className="object-cover"
                        sizes="64px"
                    />
                ) : (
                    <div className="size-full bg-surface-raised" aria-hidden="true" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-foreground">
                    {article.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {article.headline}
                </p>
            </div>
        </Link>
    );
}
```

### ArticlesMegaTagList

```typescript
// src/modules/articles/presentation/components/ArticlesMegaMenu/ArticlesMegaTagList.tsx
import Link from "next/link";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import type { ArticlesMegaTagListProps } from "./types";

/**
 * ArticlesMegaTagList
 *
 * @description
 * Right column of the articles mega menu. Renders the top 10 article-scoped
 * popular tags as pill chips (from GET /api/v1/public/tags/popular?contentType=Article).
 * Each chip links to the articles listing page filtered by that tag's slug.
 * A "Voir tout" link at the bottom navigates to the articles listing page.
 */
export function ArticlesMegaTagList({ popularTags }: ArticlesMegaTagListProps) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
                {popularTags.map((tag) => (
                    <Link
                        key={tag.id}
                        href={`${ARTICLES_PATH}?tagSlug=${tag.slug}`}
                        className={cn(
                            "rounded-full border border-border px-2.5 py-0.5 text-xs text-foreground transition-colors",
                            "hover:border-primary hover:text-primary"
                        )}
                    >
                        {tag.name}
                    </Link>
                ))}
            </div>
            <Link
                href={ARTICLES_PATH}
                className="mt-1 text-xs font-medium text-primary hover:underline"
            >
                Voir tout →
            </Link>
        </div>
    );
}
```

### index.tsx (root)

```typescript
// src/modules/articles/presentation/components/ArticlesMegaMenu/index.tsx
import { ArticlesMegaCategoryList } from "./ArticlesMegaCategoryList";
import { ArticlesPromotedCard } from "./ArticlesPromotedCard";
import { ArticlesMegaTagList } from "./ArticlesMegaTagList";
import type { ArticlesMegaMenuProps } from "./types";

/**
 * ArticlesMegaMenu
 *
 * @description
 * The mega menu panel for the NEWS navigation item.
 * Three columns: categories (left) | promoted articles (centre) | popular tags (right).
 * Tags are scoped to the Article content type — see IArticlePopularTagEntity.
 * All data is passed in as props — no internal fetching.
 */
export function ArticlesMegaMenu({ categories, promotedArticles, popularTags }: ArticlesMegaMenuProps) {
    return (
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-6 p-6">
            {/* Left: categories */}
            <ArticlesMegaCategoryList categories={categories} />

            {/* Centre: promoted articles */}
            <div>
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    À la une
                </p>
                <div className="flex flex-col gap-1">
                    {promotedArticles.map((article) => (
                        <ArticlesPromotedCard key={article.id} article={article} />
                    ))}
                </div>
            </div>

            {/* Right: popular article tags */}
            <ArticlesMegaTagList popularTags={popularTags} />
        </div>
    );
}
```

---

## Videos Mega Menu

Same three-column layout. Differences from the articles version:

- Promoted card shows `thumbnailUrl` with a play icon overlay; secondary line is `categoryName` (not `headline`)
- Tag chips use `IVideoPopularTagEntity` — tags are scoped to `contentType=Video`
- Tag chips link to `/videos` — the videos listing page does not yet support `tagSlug` filtering

### VideosMegaMenu Directory

```text
src/modules/videos/presentation/components/VideosMegaMenu/
  index.tsx                          ← root, receives all data as props
  VideosMegaCategoryList.tsx
  VideosPromotedCard.tsx
  VideosMegaTagList.tsx              ← video popular tags right column
  types.ts
```

### VideosMegaMenu types.ts

```typescript
// src/modules/videos/presentation/components/VideosMegaMenu/types.ts
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoPopularTagEntity } from "@/modules/videos/domain/entities/IVideoPopularTagEntity";

export interface VideosMegaMenuProps {
    categories: IVideoCategoryEntity[];
    promotedVideos: IVideoSummaryEntity[];
    popularTags: IVideoPopularTagEntity[];
}

export interface VideosMegaCategoryListProps {
    categories: IVideoCategoryEntity[];
}

export interface VideosPromotedCardProps {
    video: IVideoSummaryEntity;
}

export interface VideosMegaTagListProps {
    popularTags: IVideoPopularTagEntity[];
}
```

### VideosPromotedCard

```typescript
// src/modules/videos/presentation/components/VideosMegaMenu/VideosPromotedCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { VIDEO_DETAIL_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import type { VideosPromotedCardProps } from "./types";

/**
 * VideosPromotedCard
 *
 * @description
 * A horizontal card for the centre column of the videos mega menu.
 * Thumbnail with a play icon overlay, video title, and category name.
 * Links to the video detail page.
 */
export function VideosPromotedCard({ video }: VideosPromotedCardProps) {
    const href = VIDEO_DETAIL_PATH.replace(":slug", video.slug);

    return (
        <Link
            href={href}
            className={cn(
                "flex items-start gap-3 rounded-md p-2 transition-colors",
                "hover:bg-accent"
            )}
        >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {video.thumbnailUrl ? (
                    <>
                        <Image
                            fill
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="object-cover"
                            sizes="64px"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play size={16} className="fill-white text-white" />
                        </div>
                    </>
                ) : (
                    <div className="flex size-full items-center justify-center bg-surface-raised">
                        <Play size={16} className="text-muted-foreground" />
                    </div>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-foreground">
                    {video.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {video.categoryName}
                </p>
            </div>
        </Link>
    );
}
```

### VideosMegaTagList

```typescript
// src/modules/videos/presentation/components/VideosMegaMenu/VideosMegaTagList.tsx
import Link from "next/link";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import type { VideosMegaTagListProps } from "./types";

/**
 * VideosMegaTagList
 *
 * @description
 * Right column of the videos mega menu. Renders the top 10 video-scoped
 * popular tags as pill chips (from GET /api/v1/public/tags/popular?contentType=Video).
 * A "Voir tout" link at the bottom navigates to the videos listing page.
 *
 * Note: the videos listing page does not yet support tagSlug filtering.
 * All tag chips link to VIDEOS_PATH until the backend adds support.
 */
export function VideosMegaTagList({ popularTags }: VideosMegaTagListProps) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
                {popularTags.map((tag) => (
                    <Link
                        key={tag.id}
                        href={VIDEOS_PATH}
                        className={cn(
                            "rounded-full border border-border px-2.5 py-0.5 text-xs text-foreground transition-colors",
                            "hover:border-primary hover:text-primary"
                        )}
                    >
                        {tag.name}
                    </Link>
                ))}
            </div>
            <Link
                href={VIDEOS_PATH}
                className="mt-1 text-xs font-medium text-primary hover:underline"
            >
                Voir tout →
            </Link>
        </div>
    );
}
```

### VideosMegaMenu index.tsx

```typescript
// src/modules/videos/presentation/components/VideosMegaMenu/index.tsx
import { VideosMegaCategoryList } from "./VideosMegaCategoryList";
import { VideosPromotedCard } from "./VideosPromotedCard";
import { VideosMegaTagList } from "./VideosMegaTagList";
import type { VideosMegaMenuProps } from "./types";

/**
 * VideosMegaMenu
 *
 * @description
 * The mega menu panel for the VIDEOS navigation item.
 * Three columns: categories (left) | promoted videos (centre) | popular tags (right).
 * Tags are scoped to the Video content type — see IVideoPopularTagEntity.
 * All data is passed in as props — no internal fetching.
 */
export function VideosMegaMenu({ categories, promotedVideos, popularTags }: VideosMegaMenuProps) {
    return (
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-6 p-6">
            {/* Left: categories */}
            <VideosMegaCategoryList categories={categories} />

            {/* Centre: promoted videos */}
            <div>
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    À la une
                </p>
                <div className="flex flex-col gap-1">
                    {promotedVideos.map((video) => (
                        <VideosPromotedCard key={video.id} video={video} />
                    ))}
                </div>
            </div>

            {/* Right: popular video tags */}
            <VideosMegaTagList popularTags={popularTags} />
        </div>
    );
}
```

---

## Styling Notes

All colors reference `theme.css` tokens — no hardcoded hex values anywhere.

| Token used | Purpose |
| --- | --- |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Section labels, secondary text |
| `bg-accent` / `text-accent-foreground` | Hover state on category and promoted items |
| `bg-muted` | Image placeholder background |
| `bg-surface-raised` | Fallback image placeholder surface |
| `text-primary` | "Voir tout" link and tag hover color |
| `border-border` | Tag chip border (default state) |
| `border-primary` | Tag chip border (hover state) |
| `bg-popover` / `border-border` | Panel background and border (set in NavigationMenuViewport) |
