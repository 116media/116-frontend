"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortsPlayer } from "@/modules/shorts/presentation/components/modals/ShortsPlayer";
import { useShortBySlug } from "@/modules/shorts/presentation/hooks/useShortBySlug";
import { useShortsFeed } from "@/modules/shorts/presentation/hooks/useShortsFeed";
import { SHORTS_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for ShortsOverlayContainer.
 *
 * @interface ShortsOverlayContainerProps
 * @property {string} slug - The short the overlay opens on.
 * @property {IShortVideoEntity} [initialData] - Server-fetched short, seeding the query so
 * a deep link opens without a second fetch.
 */
export interface ShortsOverlayContainerProps {
    slug: string;
    initialData?: IShortVideoEntity;
}

/**
 * ShortsOverlayContainer
 *
 * @description
 * The player as an intercepted overlay over the page that opened it. It reads the feed
 * query the strip already filled, so the reader keeps swiping the whole feed rather than
 * the one short the URL names; a short reached by deep link, and therefore absent from
 * that feed, plays on its own. Closing pops the history entry the open pushed, so Back
 * closes the overlay instead of leaving the page.
 */
export function ShortsOverlayContainer({ slug, initialData }: ShortsOverlayContainerProps) {
    const router = useRouter();
    const { data, hasNextPage, fetchNextPage } = useShortsFeed();
    const { data: single } = useShortBySlug(slug, { initialData });

    const feed = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
    const indexInFeed = feed.findIndex((short) => short.slug === slug);
    const isInFeed = indexInFeed >= 0;

    const shorts = isInFeed ? feed : single ? [single] : [];

    // Swiping stays inside the open overlay, so the address bar follows the visible short
    // without a routing round trip; a refresh then lands on that short's own page.
    const syncUrlToShort = useCallback((short: IShortVideoEntity) => {
        window.history.replaceState(window.history.state, "", `${SHORTS_PATH}/${short.slug}`);
    }, []);

    if (shorts.length === 0) return null;

    return (
        <ShortsPlayer.Root
            shorts={shorts}
            hasNextPage={isInFeed && hasNextPage}
            initialIndex={isInFeed ? indexInFeed : 0}
            onActiveShortChange={syncUrlToShort}
            onClose={() => router.back()}
            onLoadMore={() => {
                void fetchNextPage();
            }}
        />
    );
}
