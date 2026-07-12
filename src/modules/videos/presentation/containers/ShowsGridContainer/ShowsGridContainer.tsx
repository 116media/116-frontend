"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ShowsGrid } from "@/modules/videos/presentation/components/sections/ShowsGrid";
import { ShowsGridLoading } from "@/modules/videos/presentation/components/sections/ShowsGrid/ShowsGrid.Loading";
import { SHOWS_PAGE_SIZE } from "@/modules/videos/presentation/constants/videoKeys";
import { useShows } from "@/modules/videos/presentation/hooks/useShows";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon, PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

/**
 * ShowsGridContainer
 *
 * @description
 * Client container for the shows page: fetches every active show via
 * {@link useShows} and reveals the grid one window at a time as the scroll
 * sentinel enters the viewport (the categories endpoint is not paginated, so
 * the loaded list is windowed client-side).
 */
export function ShowsGridContainer() {
    const { t } = useTranslation();
    const { data: shows = [], isPending, isError, refetch } = useShows();

    const [visibleCount, setVisibleCount] = useState(SHOWS_PAGE_SIZE);
    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(
        INFINITE_SCROLL_SENTINEL_OPTIONS
    );

    const hasMore = visibleCount < shows.length;

    useEffect(() => {
        if (isSentinelVisible && hasMore) setVisibleCount((count) => count + SHOWS_PAGE_SIZE);
    }, [isSentinelVisible, hasMore]);

    return (
        <section className="flex flex-col gap-6">
            <h2
                suppressHydrationWarning
                className="text-center text-xl font-bold tracking-wide text-foreground sm:text-2xl lg:text-3xl"
            >
                {t("videos.shows.title")}
            </h2>
            <StateRenderer
                data={shows}
                loading={isPending}
                error={isError}
                skeleton={<ShowsGridLoading />}
                errorState={
                    <EmptyState
                        context="shows-grid-error"
                        title={t("videos.shows.error.title")}
                        icon={<AlertCircleIcon className="size-10 text-destructive" />}
                        action={
                            <Button
                                variant="outline"
                                onClick={() => refetch()}
                            >
                                {t("videos.shows.error.retry")}
                            </Button>
                        }
                    />
                }
                empty={
                    <EmptyState
                        context="shows-grid-empty"
                        title={t("videos.shows.empty.title")}
                        subtitle={t("videos.shows.empty.body")}
                        icon={<PlayIcon className="size-16" />}
                    />
                }
                render={(items) => (
                    <div className="flex flex-col gap-8">
                        <ShowsGrid shows={items.slice(0, visibleCount)} />
                        {hasMore && (
                            <div
                                ref={sentinelRef}
                                aria-hidden
                                className="h-px"
                            />
                        )}
                    </div>
                )}
            />
        </section>
    );
}
