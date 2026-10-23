"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { VideosToolbar } from "@/modules/videos/presentation/components/navigation/VideosToolbar";
import { VideosGrid } from "@/modules/videos/presentation/components/sections/VideosGrid";
import { VideosGridEmpty } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Empty";
import { VideosGridEndOfFeed } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.EndOfFeed";
import { VideosGridError } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Error";
import { VideosGridLoading } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Loading";
import { useVideosFeed } from "@/modules/videos/presentation/hooks/useVideosFeed";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS } from "@/shared/presentation/constants/search";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";
import { useScrollToFeedOnFilterChange } from "@/shared/presentation/hooks/useScrollToFeedOnFilterChange";

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

    const router = useRouter();
    const pathname = usePathname();
    const feedRef = useRef<HTMLDivElement | null>(null);

    const settled = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

    // A term below the floor matches most of the corpus for no information, so it is
    // treated as no filter at all rather than sent to the API.
    const debouncedSearch = settled.trim().length >= MIN_SEARCH_LENGTH ? settled.trim() : "";
    const filters = useMemo(
        () => ({ search: debouncedSearch || undefined, categoryId, tagSlug }),
        [debouncedSearch, categoryId, tagSlug]
    );
    const hasActiveFilters = Boolean(filters.search || categoryId || tagSlug);

    useScrollToFeedOnFilterChange(feedRef, [debouncedSearch, categoryId, tagSlug]);

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useVideosFeed(filters);

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(
        INFINITE_SCROLL_SENTINEL_OPTIONS
    );

    const videos = data?.pages.flatMap((page) => page.items) ?? [];

    // Mirror the settled filters into the URL so a filtered view is shareable and the
    // back button undoes it. `replace` keeps one history entry per settled term.
    useEffect(() => {
        const params = new URLSearchParams();

        if (debouncedSearch) params.set("search", debouncedSearch);
        if (categoryId) params.set("categoryId", categoryId);
        if (tagSlug) params.set("tagSlug", tagSlug);

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, [debouncedSearch, categoryId, tagSlug, pathname, router]);

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const clear = () => {
        setSearch("");
        setCategoryId(undefined);
        setTagSlug(undefined);
    };

    return (
        <section
            ref={feedRef}
            className="flex flex-col gap-6"
        >
            <VideosToolbar.Root
                search={search}
                tagSlug={tagSlug}
                categoryId={categoryId}
                onTagChange={setTagSlug}
                onSearchChange={setSearch}
                onCategoryChange={setCategoryId}
                hasActiveFilters={hasActiveFilters}
                onClear={clear}
            />
            <StateRenderer
                data={videos}
                error={isError}
                loading={isLoading}
                skeleton={<VideosGridLoading />}
                errorState={<VideosGridError onRetry={refetch} />}
                empty={
                    <VideosGridEmpty
                        filtered={hasActiveFilters}
                        onClear={clear}
                    />
                }
                render={(items) => (
                    <div className="flex flex-col gap-8">
                        <VideosGrid videos={items} />
                        {isFetchingNextPage && <VideosGridLoading rows={1} />}
                        {hasNextPage ? (
                            <div
                                aria-hidden
                                ref={sentinelRef}
                                className="h-px"
                            />
                        ) : (
                            <VideosGridEndOfFeed />
                        )}
                    </div>
                )}
            />
        </section>
    );
}
