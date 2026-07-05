# Spec 04 — Article Card & Shared Primitives

Design ref: [../05-article-card.md](../05-article-card.md).

---

## 1. `Separator` primitive

`src/shared/presentation/components/ui/Separator/index.tsx` — none exists. Minimal
themed rule; optionally on `@radix-ui/react-separator` (verify latest before pinning).

```tsx
import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the Separator component.
 *
 * @interface SeparatorProps
 * @property {"horizontal" | "vertical"} [orientation] - Rule direction (default horizontal).
 * @property {string} [className] - Extra classes (e.g. a fixed height for a vertical rule).
 */
export interface SeparatorProps {
    orientation?: "horizontal" | "vertical";
    className?: string;
}

/**
 * Separator
 *
 * @description
 * A thin themed divider. Horizontal spans full width (`h-px`), vertical spans full
 * height (`w-px`); both use the `--border` token. Decorative by default
 * (`role="separator"`, `aria-orientation`).
 *
 * @param orientation - Rule direction (default "horizontal").
 * @param className - Extra classes (e.g. `h-4` for a vertical rule in a meta row).
 */
export function Separator({ orientation = "horizontal", className }: SeparatorProps) {
    return (
        <span
            role="separator"
            aria-orientation={orientation}
            className={cn(
                "shrink-0 bg-border",
                orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
                className
            )}
        />
    );
}
```

## 2. Icons

`src/shared/presentation/components/ui/Icon/lucide.ts` — add alphabetically:

```ts
Bookmark as BookmarkIcon,
BookmarkPlus as BookmarkPlusIcon,
Newspaper as NewspaperIcon,
```

(`NewspaperIcon` is the no-cover fallback glyph; the bookmark icons are for the
engagement bar. `Search`/`X` already exist in the barrel.)

## 3. The `ArticleCard` compound

Folder `src/modules/articles/presentation/components/ArticleCard/`.

### `index.ts`

```ts
import { ArticleCardFeed } from "./ArticleCard.Feed";

/**
 * ArticleCard
 *
 * @description
 * Compound family of article cards. `Feed` is the magazine-style card used in the
 * /articles grid. Extend the family by adding variants here (e.g. `Row`, `Compact`).
 */
export const ArticleCard = { Feed: ArticleCardFeed } as const;
```

### `ArticleCard.Feed.tsx`

```tsx
import Link from "next/link";

import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { useTranslation } from "react-i18next";

import { ArticleCardMedia } from "./ArticleCardMedia";
import { ArticleCardAuthor } from "./ArticleCardAuthor";
import { ArticleCardMeta } from "./ArticleCardMeta";
import { ArticleCardEngagement } from "./ArticleCardEngagement";

/**
 * Props for the ArticleCard.Feed component.
 *
 * @interface ArticleCardFeedProps
 * @property {IArticleSummaryEntity} article - The article summary to render.
 */
export interface ArticleCardFeedProps {
    article: IArticleSummaryEntity;
}

/**
 * ArticleCard.Feed
 *
 * @description
 * The magazine-style article card for the grid. Cover image with a hover "Read Article"
 * overlay, an author + date byline, a meta row (category Tag · date · reading time), the
 * title, a 2-line headline, and an engagement bar. All colors are theme tokens. The
 * source design's image category badge is intentionally omitted (category is in the meta
 * row).
 *
 * @param article - The article summary to render.
 */
export function ArticleCardFeed({ article }: ArticleCardFeedProps) {
    return (
        <article className="group overflow-hidden rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md">
            <ArticleCardMedia
                slug={article.slug}
                title={article.title}
                coverImageUrl={article.coverImageUrl}
            />
            <div className="p-5">
                <ArticleCardAuthor author={article.author} />
                <ArticleCardMeta
                    categoryName={article.categoryName}
                    publishedAt={article.publishedAt}
                    readTimeInMinutes={article.readTimeInMinutes}
                />
                <h3 className="mb-3 line-clamp-2 font-bold text-xl transition-colors group-hover:text-primary">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="mb-4 line-clamp-2 text-muted-foreground text-sm">
                    {article.headline}
                </p>
                <ArticleCardEngagement
                    articleId={article.id}
                    slug={article.slug}
                    likeCount={article.likeCount}
                    commentCount={article.commentCount}
                    bookmarkCount={article.bookmarkCount}
                />
            </div>
        </article>
    );
}
```

### `ArticleCardMedia.tsx`

```tsx
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for ArticleCardMedia.
 *
 * @interface ArticleCardMediaProps
 * @property {string} slug - The article slug (target of the "Read Article" link).
 * @property {string} title - The article title (image alt text).
 * @property {string | null} coverImageUrl - The cover image URL, or null to render a fallback.
 */
export interface ArticleCardMediaProps {
    slug: string;
    title: string;
    coverImageUrl: string | null;
}

/**
 * ArticleCardMedia
 *
 * @description
 * The 16:9 cover image with a hover overlay revealing a "Read Article" button and a
 * gentle image zoom. When the article has no cover, a token-colored fallback (muted
 * surface + icon) is rendered instead of an image, so no placeholder asset is needed.
 * The source design's category badge overlay is omitted.
 *
 * @param slug - The article slug (link target).
 * @param title - The article title (image alt).
 * @param coverImageUrl - The cover image URL, or null for the fallback.
 */
export function ArticleCardMedia({ slug, title, coverImageUrl }: ArticleCardMediaProps) {
    const { t } = useTranslation();
    return (
        <div className="relative aspect-video overflow-hidden">
            {coverImageUrl ? (
                <Image
                    fill
                    src={coverImageUrl}
                    alt={title}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                    <NewspaperIcon className="size-10 text-muted-foreground" />
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <Button asChild className="rounded-full bg-background/90 text-foreground hover:bg-background">
                    <Link href={`/articles/${slug}`}>{t("articles.card.read")}</Link>
                </Button>
            </div>
        </div>
    );
}
```

### `ArticleCardAuthor.tsx`

```tsx
import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { UserAvatar } from "@/shared/presentation/components/common/UserAvatar";

/**
 * Props for ArticleCardAuthor.
 *
 * @interface ArticleCardAuthorProps
 * @property {IArticleAuthor} [author] - The author projection, or undefined if unresolved.
 */
export interface ArticleCardAuthorProps {
    author?: IArticleAuthor;
}

/**
 * ArticleCardAuthor
 *
 * @description
 * The byline row: the author's avatar and display name. Falls back gracefully when the
 * author projection is absent. The published date is not shown here — it appears once,
 * in {@link ArticleCardMeta}.
 *
 * @param author - The author projection (userName + avatarUrl), if resolved.
 */
export function ArticleCardAuthor({ author }: ArticleCardAuthorProps) {
    return (
        <div className="mb-3 flex items-center gap-2">
            <UserAvatar
                size={32}
                userName={author?.userName ?? ""}
                image={author?.avatarUrl ?? undefined}
            />
            <span className="font-medium text-sm">{author?.userName}</span>
        </div>
    );
}
```

### `ArticleCardMeta.tsx`

```tsx
import { useTranslation } from "react-i18next";

import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { useTranslation } from "react-i18next";

import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Separator } from "@/shared/presentation/components/ui/Separator";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { CalendarIcon, ClockIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for ArticleCardMeta.
 *
 * @interface ArticleCardMetaProps
 * @property {string} categoryName - The article category display name (rendered as a Tag).
 * @property {string | null} publishedAt - ISO publication date, or null.
 * @property {number} [readTimeInMinutes] - Estimated reading time in minutes.
 */
export interface ArticleCardMetaProps {
    categoryName: string;
    publishedAt: string | null;
    readTimeInMinutes?: number;
}

/**
 * ArticleCardMeta
 *
 * @description
 * The row above the title: the article category as a Tag, the published date (relative,
 * locale-aware, via the shared RelativeDate), and the reading time, separated by vertical
 * rules. Wraps on narrow cards. This is the single place the date is shown on the card.
 *
 * @param categoryName - The category display name.
 * @param publishedAt - ISO publication date, or null.
 * @param readTimeInMinutes - Estimated reading time in minutes.
 */
export function ArticleCardMeta({
    categoryName,
    publishedAt,
    readTimeInMinutes
}: ArticleCardMetaProps) {
    const { t } = useTranslation();
    return (
        <div className="mb-4 flex flex-wrap items-center gap-3">
            <Tag as="span" variant="outline" size="sm">{categoryName}</Tag>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center text-muted-foreground text-sm">
                <CalendarIcon className="mr-1 size-3.5" />
                <RelativeDate date={publishedAt} />
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center text-muted-foreground text-sm">
                <ClockIcon className="mr-1 size-3.5" />
                {t("articles.card.readTime", { count: readTimeInMinutes ?? 0 })}
            </span>
        </div>
    );
}
```

`ArticleCardEngagement` is specced in
[06-interactions-and-dummy-data.md](06-interactions-and-dummy-data.md).

---

## Tasks

- [x] `Separator` primitive added (JSDoc, tokens, both orientations).
- [x] `BookmarkIcon` / `BookmarkPlusIcon` added to the icon barrel.
- [x] `ArticleCard` barrel + `ArticleCard.Feed` created.
- [x] `ArticleCardMedia` — badge overlay omitted; hover "Read Article"; token colors.
- [x] `ArticleCardAuthor` — avatar + name + date; safe with missing author.
- [x] `ArticleCardMeta` — category `Tag` · date · reading time with `Separator`.
- [x] Renders from a dummy article in light + dark; no hardcoded colors.
- [x] `tsc` + biome clean.
