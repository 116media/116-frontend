# Spec 06 — Interactions & Dummy Data

Design ref: [../10-interactions.md](../10-interactions.md),
[../11-dummy-data.md](../11-dummy-data.md).

---

## 1. Repository port + impl

Five methods added to `IArticlesRepositoryPort`, each returning `Result<boolean>`
(`response.data.isSuccess`):

```ts
likeArticle(id: string): Promise<Result<boolean>>;
unlikeArticle(id: string): Promise<Result<boolean>>;
bookmarkArticle(id: string): Promise<Result<boolean>>;
unbookmarkArticle(id: string): Promise<Result<boolean>>;
shareArticle(id: string, platform: string): Promise<Result<boolean>>;
```

Impl — each delegates to the matching generated client method and maps errors:

```ts
async likeArticle(id: string): Promise<Result<boolean>> {
    try {
        const response = await this.api.publicLikeArticle(id);
        return ok(response.data.isSuccess);
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}

async unlikeArticle(id: string): Promise<Result<boolean>> {
    try {
        const response = await this.api.publicUnlikeArticle(id);
        return ok(response.data.isSuccess);
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}

async bookmarkArticle(id: string): Promise<Result<boolean>> {
    try {
        const response = await this.api.publicBookmarkArticle(id);
        return ok(response.data.isSuccess);
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}

async unbookmarkArticle(id: string): Promise<Result<boolean>> {
    try {
        const response = await this.api.publicUnbookmarkArticle(id);
        return ok(response.data.isSuccess);
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}

async shareArticle(id: string, platform: string): Promise<Result<boolean>> {
    try {
        const response = await this.api.publicShareArticle(id, { platform });
        return ok(response.data.isSuccess);
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}
```

## 2. Interaction use cases

Five thin use cases — one file each (`like.article.usecase.ts`,
`unlike.article.usecase.ts`, `bookmark.article.usecase.ts`,
`unbookmark.article.usecase.ts`, `share.article.usecase.ts`) — all the same shape:

```ts
/**
 * LikeArticleUseCase
 *
 * @description
 * Likes one article via the articles repository. Returns the repository's
 * `Result<boolean>` (success flag) unchanged.
 */
export class LikeArticleUseCase {
    private readonly repo: IArticlesRepositoryPort;
    constructor({ articlesRepository }: { articlesRepository: IArticlesRepositoryPort }) {
        this.repo = articlesRepository;
    }

    /**
     * @param articleId - The article to like.
     * @returns A `Result` with the success flag.
     */
    execute(articleId: string): Promise<Result<boolean>> {
        return this.repo.likeArticle(articleId);
    }
}
```

`UnlikeArticleUseCase`, `BookmarkArticleUseCase`, `UnbookmarkArticleUseCase` are
identical, calling `unlikeArticle` / `bookmarkArticle` / `unbookmarkArticle`.
`ShareArticleUseCase.execute(articleId, platform)` calls `shareArticle(articleId, platform)`.

Register all five in `articles.dependencies.ts` (`asClass(...).transient()`) and add
them to the `Cradle` type: `likeArticleUseCase`, `unlikeArticleUseCase`,
`bookmarkArticleUseCase`, `unbookmarkArticleUseCase`, `shareArticleUseCase`.

## 2. Mutation hooks (optimistic + gated)

A shared internal hook backs both toggles (like and bookmark are the same optimistic
logic over different use cases), then the two public hooks wrap it.

```tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { container } from "@/shared/infrastructure/service.locator";
import type { Failure } from "@/shared/domain/failures/failure";
import type { Result } from "@/shared/domain/results/result";

/**
 * useToggle
 *
 * @description
 * Shared optimistic toggle used by like and bookmark: owns a boolean `on` state and a
 * displayed `count`, flips them immediately on `toggle`, runs the on/off use case, and
 * rolls both back on failure. State is client-owned because the summary DTO exposes no
 * per-user flag.
 *
 * @param initialCount - The baseline count from the entity.
 * @param onExecute - Runs the "on" (true) or "off" (false) mutation; resolves the success flag.
 * @returns `{ on, count, toggle }`.
 */
function useToggle(
    initialCount: number,
    onExecute: (next: boolean) => Promise<boolean>
) {
    const [on, setOn] = useState(false);
    const [count, setCount] = useState(initialCount);

    const mutation = useMutation<boolean, Failure, boolean>({
        mutationFn: (next) => onExecute(next)
    });

    const toggle = () => {
        const next = !on;
        setOn(next);
        setCount((c) => c + (next ? 1 : -1));
        mutation.mutate(next, {
            onError: () => {
                setOn(!next);
                setCount((c) => c + (next ? -1 : 1));
            }
        });
    };

    return { on, count, toggle };
}

/**
 * Runs a `Result<boolean>` use case and throws its `Failure` on error (so the mutation's
 * `onError` fires), returning the success flag otherwise.
 */
async function runInteraction(execute: () => Promise<Result<boolean>>) {
    const result = await execute();
    if (!result.ok) throw result.error;
    return result.value;
}

/**
 * useToggleArticleLike
 *
 * @description
 * Optimistic like toggle for one article. Wraps {@link useToggle} over the like / unlike
 * use cases. Returns `{ liked, count, toggle }`.
 *
 * @param articleId - The article to like/unlike.
 * @param initialCount - The entity's `likeCount` baseline.
 */
export function useToggleArticleLike(articleId: string, initialCount: number) {
    const { on, count, toggle } = useToggle(initialCount, (next) =>
        runInteraction(() =>
            (next
                ? container.cradle.likeArticleUseCase
                : container.cradle.unlikeArticleUseCase
            ).execute(articleId)
        )
    );
    return { liked: on, count, toggle };
}

/**
 * useToggleArticleBookmark
 *
 * @description
 * Optimistic bookmark toggle for one article. Wraps {@link useToggle} over the bookmark /
 * unbookmark use cases. Returns `{ bookmarked, count, toggle }`.
 *
 * @param articleId - The article to bookmark/unbookmark.
 * @param initialCount - The entity's `bookmarkCount` baseline.
 */
export function useToggleArticleBookmark(articleId: string, initialCount: number) {
    const { on, count, toggle } = useToggle(initialCount, (next) =>
        runInteraction(() =>
            (next
                ? container.cradle.bookmarkArticleUseCase
                : container.cradle.unbookmarkArticleUseCase
            ).execute(articleId)
        )
    );
    return { bookmarked: on, count, toggle };
}

/**
 * useShareArticle
 *
 * @description
 * Opens the native share sheet for an article and, when available, records the share via
 * the share use case (fire-and-forget telemetry — failures are swallowed). Falls back to
 * copying the URL when the Web Share API is unavailable.
 *
 * @param articleId - The article being shared.
 * @param slug - The article slug (used to build the share URL).
 */
export function useShareArticle(articleId: string, slug: string) {
    return async () => {
        const url = `${window.location.origin}/articles/${slug}`;
        if (navigator.share) {
            try {
                await navigator.share({ url });
            } catch {
                return;
            }
            container.cradle.shareArticleUseCase.execute(articleId, "web-share");
            return;
        }
        await navigator.clipboard.writeText(url);
        container.cradle.shareArticleUseCase.execute(articleId, "clipboard");
    };
}
```

## 3. `ArticleCardEngagement`

```tsx
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import {
    HeartIcon, MessageSquareIcon, ShareIcon, BookmarkPlusIcon
} from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";
import { useToggleArticleLike } from "@/modules/articles/presentation/hooks/useToggleArticleLike";
import { useToggleArticleBookmark } from "@/modules/articles/presentation/hooks/useToggleArticleBookmark";
import { useShareArticle } from "@/modules/articles/presentation/hooks/useShareArticle";

/**
 * Props for ArticleCardEngagement.
 *
 * @interface ArticleCardEngagementProps
 * @property {string} articleId - The article the mutations target.
 * @property {string} slug - The article slug (comment link target).
 * @property {number} likeCount - Baseline like count for the optimistic toggle.
 * @property {number} commentCount - Comment count shown on the (navigating) comment button.
 * @property {number} [bookmarkCount] - Baseline bookmark count for the optimistic toggle.
 */
export interface ArticleCardEngagementProps {
    articleId: string;
    slug: string;
    likeCount: number;
    commentCount: number;
    bookmarkCount?: number;
}

/**
 * ArticleCardEngagement
 *
 * @description
 * The card's action row with four interactions: like (optimistic toggle, auth-gated),
 * comment (navigates to the article's comments), share, and bookmark (optimistic toggle,
 * auth-gated). Every button stops propagation so it never follows the card's article
 * link.
 *
 * @param articleId - The article the mutations target.
 * @param slug - The article slug (comment link target).
 * @param likeCount - Baseline like count.
 * @param commentCount - Comment count shown on the comment button.
 * @param bookmarkCount - Baseline bookmark count.
 */
export function ArticleCardEngagement({
    articleId,
    slug,
    likeCount,
    commentCount,
    bookmarkCount
}: ArticleCardEngagementProps) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const like = useToggleArticleLike(articleId, likeCount);
    const bookmark = useToggleArticleBookmark(articleId, bookmarkCount ?? 0);
    const share = useShareArticle(articleId, slug);

    const stop = (fn: () => void) => (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); fn(); };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" aria-label={t("articles.card.like")}
                    className="h-8 gap-1 px-2 text-muted-foreground"
                    onClick={stop(requireAuth(like.toggle))}>
                    <HeartIcon className={cn("size-4", like.liked && "fill-destructive text-destructive")} />
                    <span className={cn(like.liked && "text-destructive")}>{like.count}</span>
                </Button>

                <Button asChild variant="ghost" size="sm" aria-label={t("articles.card.comments")}
                    className="h-8 gap-1 px-2 text-muted-foreground">
                    <Link href={`/articles/${slug}?comments=1`} onClick={(e) => e.stopPropagation()}>
                        <MessageSquareIcon className="size-4" />
                        <span>{commentCount}</span>
                    </Link>
                </Button>

                <Button variant="ghost" size="sm" aria-label={t("articles.card.share")}
                    className="h-8 gap-1 px-2 text-muted-foreground"
                    onClick={stop(share)}>
                    <ShareIcon className="size-4" />
                    <span>{t("articles.card.share")}</span>
                </Button>
            </div>

            <Button variant="ghost" size="icon" aria-label={t("articles.card.bookmark")}
                className="size-8 text-muted-foreground"
                onClick={stop(requireAuth(bookmark.toggle))}>
                <BookmarkPlusIcon className={cn("size-4", bookmark.bookmarked && "fill-primary text-primary")} />
            </Button>
        </div>
    );
}
```

The comment `Link` calls `stopPropagation` **only** — never `preventDefault` — so it
still navigates (opening the article with the `?comments=1` intent) while not triggering
the card's outer article link. The like/bookmark buttons use the `stop` helper (stop +
prevent) because they must not navigate at all. The comments **drawer** the flag opens
is deferred detail-page work — see [../10-interactions.md](../10-interactions.md).

> Colors are tokens (`fill-destructive` for a liked heart, `fill-primary` for a saved
> bookmark) — not the brief's `red-500` / `primary` literals. A dedicated `--like` token
> is an option (see [../15-open-questions.md](../15-open-questions.md)).

## 4. Dummy data

`src/modules/articles/presentation/data/articles.dummy.ts` — **48** deterministic,
fully-populated articles plus a paging helper, so the dummy feed drives infinite scroll
like the real one (48 ÷ 12 = 4 pages). See [../11-dummy-data.md](../11-dummy-data.md).

Rotation pools + a deterministic date helper feed the generator (all index-seeded — no
`Math.random` / `Date.now`, so SSR and client agree):

```ts
/** Fixed epoch the dummy dates count back from (deterministic, SSR-safe). */
const DUMMY_BASE_MS = Date.parse("2026-06-01T09:00:00Z");

/** One day in milliseconds. */
const DAY_MS = 86_400_000;

const CATEGORIES = ["Music", "Arts & Culture", "Interviews", "Film", "Fashion", "Tech"];

const TITLES = [
    "How Independent Artists Are Finding Success in the Streaming Era",
    "Inside the Studio: A Day With Rising Producers",
    "The Return of Vinyl and What It Means for Fans",
    "Festival Season: The Acts You Can't Miss",
    "Behind the Lens of a Music Video Director",
    "The New Wave of Afrobeats Crossing Borders"
];

const HEADLINES = [
    "With traditional labels losing influence, musicians are building direct fan relationships.",
    "A look at the tools and rituals shaping tomorrow's records.",
    "Physical media is thriving in a streaming-first world — here's why.",
    "From headliners to hidden gems, the season's essential line-up.",
    "How a single frame becomes a story audiences remember.",
    "The sound taking global charts by storm, one collaboration at a time."
];

const COVERS = [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80"
];

const AUTHORS: IArticleAuthor[] = [
    { userName: "Sarah Wilson", avatarUrl: "https://i.pravatar.cc/80?img=1" },
    { userName: "James Carter", avatarUrl: "https://i.pravatar.cc/80?img=12" },
    { userName: "Amara Okafor", avatarUrl: "https://i.pravatar.cc/80?img=45" },
    { userName: "Liam Nguyen", avatarUrl: "https://i.pravatar.cc/80?img=32" }
];

/**
 * Deterministic ISO published date for a dummy article: `DUMMY_BASE_MS` minus `index`
 * days, so newer items sort first and the value never depends on the current time.
 *
 * @param index - The article index.
 * @returns An ISO 8601 date string.
 */
function isoOffsetFromBase(index: number): string {
    return new Date(DUMMY_BASE_MS - index * DAY_MS).toISOString();
}

/**
 * generateDummyArticles
 *
 * @description
 * Deterministic list of fully-populated article summaries for the feed grid while the
 * backend has no published content. Index-seeded (no Math.random / Date.now) so SSR and
 * client render identically. Populates every field the card reads, including the
 * card-only additions (`readTimeInMinutes`, `author`).
 *
 * @param count - How many to generate (default 48).
 * @returns An array of article summaries.
 */
export function generateDummyArticles(count = 48): IArticleSummaryEntity[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `dummy-article-${i}`,
        slug: `dummy-article-${i}`,
        categoryId: `dummy-category-${i % CATEGORIES.length}`,
        categoryName: CATEGORIES[i % CATEGORIES.length],
        title: TITLES[i % TITLES.length],
        headline: HEADLINES[i % HEADLINES.length],
        coverImageUrl: COVERS[i % COVERS.length],
        isPromoted: false,
        publishedAt: isoOffsetFromBase(i),
        readTimeInMinutes: 3 + (i % 10),
        author: AUTHORS[i % AUTHORS.length],
        likeCount: 40 + i * 7,
        commentCount: 5 + i * 2,
        shareCount: 3 + i,
        bookmarkCount: 10 + i
    }));
}

/**
 * dummyArticlePage
 *
 * @description
 * One page of the dummy articles as an `IArticlePage`, so `useArticlesFeed` can page
 * through the 48 items exactly like the backend. `hasNextPage` is derived from the slice
 * against the total, so the scroll sentinel keeps loading until the last page.
 *
 * @param pageIndex - Zero-based page to slice.
 * @param pageSize - Items per page.
 * @returns The dummy page for that index.
 */
export function dummyArticlePage(pageIndex: number, pageSize: number): IArticlePage {
    const all = generateDummyArticles();
    const start = pageIndex * pageSize;
    const items = all.slice(start, start + pageSize);
    return {
        items,
        pageIndex,
        pageSize,
        count: all.length,
        hasNextPage: start + pageSize < all.length
    };
}
```

---

## Tasks

- [x] Port + impl gain like/unlike/bookmark/unbookmark/share (`Result<boolean>`).
- [x] Five interaction use cases + DI registration + `Cradle` entries.
- [x] Shared `useToggle` + `useToggleArticleLike` / `useToggleArticleBookmark` — optimistic + rollback.
- [x] `useShareArticle` — Web Share API with clipboard fallback + fire-and-forget telemetry.
- [x] `ArticleCardEngagement` — stop-propagation, `useRequireAuth` gate, share wired, token colors, aria labels.
- [x] Dummy rotation pools (`CATEGORIES`/`TITLES`/`HEADLINES`/`COVERS`/`AUTHORS`) + `isoOffsetFromBase` (fixed base).
- [x] `generateDummyArticles` — **48** deterministic, fully-populated articles.
- [x] `dummyArticlePage(pageIndex, pageSize)` — slices the 48 into an `IArticlePage`
      with derived `hasNextPage` (drives infinite scroll for dummy).
- [x] `tsc` + biome clean.
