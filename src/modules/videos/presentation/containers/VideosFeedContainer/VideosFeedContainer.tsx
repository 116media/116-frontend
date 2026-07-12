"use client";

import { useEffect, useMemo, useState } from "react";

import { VideosToolbar } from "@/modules/videos/presentation/components/navigation/VideosToolbar";
import { VideosGrid } from "@/modules/videos/presentation/components/sections/VideosGrid";
import { VideosGridEmpty } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Empty";
import { VideosGridEndOfFeed } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.EndOfFeed";
import { VideosGridError } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Error";
import { VideosGridLoading } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Loading";
import { useVideosFeed } from "@/modules/videos/presentation/hooks/useVideosFeed";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

/**
 * Props for {@link VideosFeedContainer}.
 *
 * @interface VideosFeedContainerProps
 * @property {string} [initialSearch] - Initial search term, seeded from the URL `search` param.
 * @property {string} [initialCategoryId] - Initial category filter, seeded from the URL `categoryId` param.
 * @property {string} [initialTagSlug] - Initial tag filter, seeded from the URL `tagSlug` param.
 */
export interface VideosFeedContainerProps {
    initialSearch?: string;
    initialCategoryId?: string;
    initialTagSlug?: string;
}

/**
 * VideosFeedContainer
 *
 * @description
 * Owns the videos browse feed's filter state (search / category / tag), seeded
 * from the URL query params, and drives {@link useVideosFeed} with the
 * debounced filters. Renders {@link VideosToolbar} above {@link VideosGrid}
 * with infinite scroll and feed states.
 */
export function VideosFeedContainer({
    initialSearch = "",
    initialCategoryId,
    initialTagSlug
}: VideosFeedContainerProps = {}) {
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
        useVideosFeed(filters);

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(
        INFINITE_SCROLL_SENTINEL_OPTIONS
    );

    const videos = data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const clear = () => {
        setSearch("");
        setCategoryId(undefined);
        setTagSlug(undefined);
    };

    const grid = () => {
        if (isLoading) return <VideosGridLoading />;
        if (isError) return <VideosGridError onRetry={refetch} />;
        if (videos.length === 0) {
            return hasActiveFilters ? (
                <VideosGridEmpty
                    filtered
                    onClear={clear}
                />
            ) : (
                <VideosGridEmpty />
            );
        }
        return (
            <div className="flex flex-col gap-8">
                <VideosGrid videos={videos} />
                {isFetchingNextPage && <VideosGridLoading rows={1} />}
                {hasNextPage ? (
                    <div
                        ref={sentinelRef}
                        aria-hidden
                        className="h-px"
                    />
                ) : (
                    <VideosGridEndOfFeed />
                )}
            </div>
        );
    };

    return (
        <section className="flex flex-col gap-6">
            <VideosToolbar
                search={search}
                onSearchChange={setSearch}
                categoryId={categoryId}
                onCategoryChange={setCategoryId}
                tagSlug={tagSlug}
                onTagChange={setTagSlug}
            />
            {grid()}
        </section>
    );
}
