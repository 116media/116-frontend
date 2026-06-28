"use client";

import { useEffect, useMemo, useState } from "react";

import { ArticlesToolbar } from "@/modules/articles/presentation/components/ArticlesToolbar";
import { useArticlesFeed } from "@/modules/articles/presentation/hooks/useArticlesFeed";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

import { ArticlesGrid } from "./ArticlesGrid";
import { ArticlesGridEmpty } from "./ArticlesGrid.Empty";
import { ArticlesGridEndOfFeed } from "./ArticlesGrid.EndOfFeed";
import { ArticlesGridError } from "./ArticlesGrid.Error";
import { ArticlesGridLoading } from "./ArticlesGrid.Loading";

/**
 * Stable IntersectionObserver options for the infinite-scroll sentinel. Pre-loads the
 * next page ~200px before the sentinel enters the viewport; module scope keeps the
 * identity stable so the observer is not recreated on re-render.
 */
const SENTINEL_OPTIONS: IntersectionObserverInit = { rootMargin: "200px 0px" };

/**
 * ArticlesFeedContainer
 *
 * @description
 * Owns the article feed's filter state (search / category / tag), renders
 * {@link ArticlesToolbar} above the grid, and drives {@link useArticlesFeed} with the
 * debounced filters. Flattens the query's pages and renders {@link ArticlesGrid} with a
 * sentinel observed by {@link useIntersectionObserver} that requests the next page as it
 * enters the viewport. Shows skeleton / filtered-empty / error / end-of-feed states.
 * The dummy-data fallback lives in {@link useArticlesFeed} (paged), so an empty
 * unfiltered feed pages through the dummy set here with no special branch.
 */
export function ArticlesFeedContainer() {
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
    const [tagSlug, setTagSlug] = useState<string | undefined>(undefined);

    const debouncedSearch = useDebouncedValue(search, 300);
    const filters = useMemo(
        () => ({ search: debouncedSearch || undefined, categoryId, tagSlug }),
        [debouncedSearch, categoryId, tagSlug]
    );
    const hasActiveFilters = Boolean(filters.search || categoryId || tagSlug);

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useArticlesFeed(filters);

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(SENTINEL_OPTIONS);

    const articles = data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const clear = () => {
        setSearch("");
        setCategoryId(undefined);
        setTagSlug(undefined);
    };

    const grid = () => {
        if (isLoading) return <ArticlesGridLoading />;
        if (isError) return <ArticlesGridError onRetry={refetch} />;
        if (articles.length === 0) {
            return hasActiveFilters ? (
                <ArticlesGridEmpty
                    filtered
                    onClear={clear}
                />
            ) : (
                <ArticlesGridEmpty />
            );
        }
        return (
            <div className="flex flex-col gap-8">
                <ArticlesGrid articles={articles} />
                {isFetchingNextPage && <ArticlesGridLoading rows={1} />}
                {hasNextPage ? (
                    <div
                        ref={sentinelRef}
                        aria-hidden
                        className="h-px"
                    />
                ) : (
                    <ArticlesGridEndOfFeed />
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <ArticlesToolbar
                search={search}
                onSearchChange={setSearch}
                categoryId={categoryId}
                onCategoryChange={setCategoryId}
                tagSlug={tagSlug}
                onTagChange={setTagSlug}
                hasActiveFilters={hasActiveFilters}
                onClear={clear}
            />
            {grid()}
        </div>
    );
}
