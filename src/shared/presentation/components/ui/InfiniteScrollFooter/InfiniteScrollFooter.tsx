"use client";

import { type ReactNode, useEffect } from "react";

import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

/**
 * Props for InfiniteScrollFooter.
 *
 * @interface InfiniteScrollFooterProps
 * @property {boolean} hasNextPage - Whether a further page exists.
 * @property {boolean} isFetchingNextPage - Whether the next page is currently loading.
 * @property {() => void} onLoadMore - Requests the next page when the sentinel is reached.
 * @property {string} endLabel - The end-of-results line shown once paging is exhausted.
 * @property {ReactNode} [loader] - Placeholder shown while the next page loads.
 */
export interface InfiniteScrollFooterProps {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    endLabel: string;
    loader?: ReactNode;
}

/**
 * InfiniteScrollFooter
 *
 * @description
 * Generic infinite-scroll footer for any paged feed: an observed sentinel that requests
 * the next page, the in-flight loader, and a terminus line once paging is exhausted.
 * Copy is supplied by the caller so it stays content-agnostic.
 */
export function InfiniteScrollFooter({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    endLabel,
    loader
}: InfiniteScrollFooterProps) {
    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(
        INFINITE_SCROLL_SENTINEL_OPTIONS
    );

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) onLoadMore();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, onLoadMore]);

    return (
        <>
            {isFetchingNextPage && loader}
            {hasNextPage ? (
                <div
                    aria-hidden
                    ref={sentinelRef}
                    className="h-px"
                />
            ) : (
                <p className="text-center text-muted-foreground text-sm">{endLabel}</p>
            )}
        </>
    );
}
