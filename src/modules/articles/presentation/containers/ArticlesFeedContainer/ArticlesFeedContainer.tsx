"use client";

import { useEffect, useMemo, useState } from "react";

import { ArticlesToolbar } from "@/modules/articles/presentation/components/navigation/ArticlesToolbar";
import { ArticlesGrid } from "@/modules/articles/presentation/components/sections/ArticlesGrid";
import { ArticlesGridEmpty } from "@/modules/articles/presentation/components/sections/ArticlesGrid/ArticlesGrid.Empty";
import { ArticlesGridEndOfFeed } from "@/modules/articles/presentation/components/sections/ArticlesGrid/ArticlesGrid.EndOfFeed";
import { ArticlesGridError } from "@/modules/articles/presentation/components/sections/ArticlesGrid/ArticlesGrid.Error";
import { ArticlesGridLoading } from "@/modules/articles/presentation/components/sections/ArticlesGrid/ArticlesGrid.Loading";
import { useArticlesFeed } from "@/modules/articles/presentation/hooks/useArticlesFeed";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

/**
 * Props for {@link ArticlesFeedContainer}.
 *
 * @interface ArticlesFeedContainerProps
 * @property {string} [initialSearch] - Initial search term, seeded from the URL `search` param.
 * @property {string} [initialCategoryId] - Initial category filter, seeded from the URL `categoryId` param.
 * @property {string} [initialTagSlug] - Initial tag filter, seeded from the URL `tagSlug` param.
 */
export interface ArticlesFeedContainerProps {
    initialSearch?: string;
    initialCategoryId?: string;
    initialTagSlug?: string;
}

/**
 * ArticlesFeedContainer
 *
 * @description
 * Owns the article feed's filter state (search / category / tag), seeded from the URL
 * query params, and drives {@link useArticlesFeed} with the debounced filters. Renders
 * {@link ArticlesToolbar} above {@link ArticlesGrid} with infinite scroll and feed states.
 */
export function ArticlesFeedContainer({
    initialSearch = "",
    initialCategoryId,
    initialTagSlug
}: ArticlesFeedContainerProps = {}) {
    const [search, setSearch] = useState(initialSearch);
    const [categoryId, setCategoryId] = useState<string | undefined>(initialCategoryId);
    const [tagSlug, setTagSlug] = useState<string | undefined>(initialTagSlug);

    const debouncedSearch = useDebouncedValue(search, 300);
    const filters = useMemo(
        () => ({ search: debouncedSearch || undefined, categoryId, tagSlug }),
        [debouncedSearch, categoryId, tagSlug]
    );
    const hasActiveFilters = Boolean(filters.search || categoryId || tagSlug);

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useArticlesFeed(filters);

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(
        INFINITE_SCROLL_SENTINEL_OPTIONS
    );

    const articles = data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const clear = () => {
        setSearch("");
        setCategoryId(undefined);
        setTagSlug(undefined);
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
            <StateRenderer
                data={articles}
                error={isError}
                loading={isLoading}
                skeleton={<ArticlesGridLoading />}
                errorState={<ArticlesGridError onRetry={refetch} />}
                empty={
                    <ArticlesGridEmpty
                        filtered={hasActiveFilters}
                        onClear={clear}
                    />
                }
                render={(items) => (
                    <div className="flex flex-col gap-8">
                        <ArticlesGrid articles={items} />
                        {isFetchingNextPage && <ArticlesGridLoading rows={1} />}
                        {hasNextPage ? (
                            <div
                                aria-hidden
                                ref={sentinelRef}
                                className="h-px"
                            />
                        ) : (
                            <ArticlesGridEndOfFeed />
                        )}
                    </div>
                )}
            />
        </div>
    );
}
