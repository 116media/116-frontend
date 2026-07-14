# Spec 06 — Bookmarks

Design ref: [../07-bookmarks.md](../07-bookmarks.md). The article bookmark toggle is
**shipped** — documented here. The **my-bookmarks** list + `/bookmarks` route is new,
reusing the article feed grid wholesale.

---

## 1. `useToggleArticleBookmark` (shipped)

`src/modules/articles/presentation/hooks/useToggleArticleBookmark.ts`

```ts
"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "@/shared/presentation/hooks/useToggle";

/**
 * useToggleArticleBookmark
 *
 * @description
 * Optimistic bookmark toggle for one article, wrapping {@link useToggle} over the
 * bookmark / unbookmark use cases. `initialBookmarked` seeds from the entity's per-user
 * `isBookmarked` flag; it defaults to false on surfaces without the flag.
 *
 * @param articleId - The article to bookmark/unbookmark.
 * @param initialCount - The entity's `bookmarkCount` baseline.
 * @param initialBookmarked - The entity's per-user `isBookmarked` baseline. Defaults to false.
 * @returns `{ bookmarked, count, toggle }` for the bookmark button.
 */
export function useToggleArticleBookmark(
    articleId: string,
    initialCount: number,
    initialBookmarked = false
) {
    const { on, count, toggle } = useToggle(
        initialCount,
        (next) =>
            runInteraction(() =>
                (next
                    ? container.cradle.bookmarkArticleUseCase
                    : container.cradle.unbookmarkArticleUseCase
                ).execute(articleId)
            ),
        initialBookmarked
    );
    return { bookmarked: on, count, toggle };
}
```

The bookmark button is the like button's twin — auth-gated, active state `fill-primary`
(`BookmarkIcon`), no toast. Same contract as [04-likes.md](04-likes.md).

---

## 2. `useMyArticleBookmarks` (new)

In [03-hooks-and-keys.md](03-hooks-and-keys.md) — an infinite query over
`getMyArticleBookmarks`, page size `ARTICLES_PAGE_SIZE`.

---

## 3. `MyBookmarksContainer` (new)

`src/modules/articles/presentation/containers/MyBookmarksContainer/MyBookmarksContainer.tsx`

Reuses `ArticlesGrid` + its state files + the infinite-scroll sentinel — only the data source
differs from the feed.

```tsx
"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ArticlesGrid } from "@/modules/articles/presentation/components/sections/ArticlesGrid";
import { ArticlesGridEndOfFeed } from "@/modules/articles/presentation/components/sections/ArticlesGrid/ArticlesGrid.EndOfFeed";
import { ArticlesGridError } from "@/modules/articles/presentation/components/sections/ArticlesGrid/ArticlesGrid.Error";
import { ArticlesGridLoading } from "@/modules/articles/presentation/components/sections/ArticlesGrid/ArticlesGrid.Loading";
import { useMyArticleBookmarks } from "@/modules/articles/presentation/hooks/useMyArticleBookmarks";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { BookmarkIcon } from "@/shared/presentation/components/ui/Icon";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

/**
 * MyBookmarksContainer
 *
 * @description
 * The signed-in user's saved articles: the article feed grid driven by
 * {@link useMyArticleBookmarks} with infinite scroll and feed states. Empty copy points
 * back to browsing; the route is Visitor-gated upstream.
 */
export function MyBookmarksContainer() {
    const { t } = useTranslation();
    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMyArticleBookmarks();

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(INFINITE_SCROLL_SENTINEL_OPTIONS);
    const articles = data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <section className="flex flex-col gap-6">
            <h1 className="text-xl font-bold tracking-wide text-foreground sm:text-2xl lg:text-3xl">
                {t("articles.bookmarks.title")}
            </h1>
            <StateRenderer
                data={articles}
                loading={isLoading}
                error={isError}
                skeleton={<ArticlesGridLoading />}
                errorState={<ArticlesGridError onRetry={refetch} />}
                empty={
                    <EmptyState
                        context="my-bookmarks"
                        icon={<BookmarkIcon className="size-16" />}
                        title={t("articles.bookmarks.empty.title")}
                        subtitle={t("articles.bookmarks.empty.body")}
                        action={
                            <Button
                                asChild
                                variant="outline"
                            >
                                <a href={ARTICLES_PATH}>{t("articles.bookmarks.browse")}</a>
                            </Button>
                        }
                    />
                }
                render={(items) => (
                    <div className="flex flex-col gap-8">
                        <ArticlesGrid articles={items} />
                        {isFetchingNextPage && <ArticlesGridLoading rows={1} />}
                        {hasNextPage ? (
                            <div ref={sentinelRef} aria-hidden className="h-px" />
                        ) : (
                            <ArticlesGridEndOfFeed />
                        )}
                    </div>
                )}
            />
        </section>
    );
}
```

---

## 4. The route (new)

`app/(public)/bookmarks/page.tsx`

Visitor-gated (redirect to sign-in when unauthenticated), rendering the container. Gating
follows the existing settings/authenticated-route pattern.

---

## Tasks

- [ ] `useToggleArticleBookmark` present and wired (shipped); active state `fill-primary`, no toast.
- [ ] `useMyArticleBookmarks` infinite query (spec 03).
- [ ] `MyBookmarksContainer` reuses `ArticlesGrid` + states + sentinel; empty state links to browse.
- [ ] `/bookmarks` route Visitor-gated; logged-out access redirects to sign-in.
- [ ] `articles.bookmarks.*` strings in en + fr (spec 09).
- [ ] `tsc` + biome clean.
