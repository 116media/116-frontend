"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IShortVideoFeedPage } from "@/modules/shorts/domain/entities/IShortVideoFeedPage";
import { SHORTS_PAGE_SIZE, shortKeys } from "@/modules/shorts/presentation/constants/shortKeys";
import { generateDummyShorts } from "@/modules/shorts/presentation/data/shorts.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * Dummy shorts appended after the real feed's first page so the strip and player
 * feel populated while the backend has only a handful of active shorts. Remove
 * once the feed is seeded server-side.
 */
const DUMMY_SHORTS_COUNT = 200;

/**
 * useShortsFeed
 *
 * @description
 * Infinite query over the seeded "for you" shorts feed. Backs both the homepage
 * strip and the player modal, so a like or share stays consistent across both
 * through the shared cache. An empty cursor starts a fresh randomized session;
 * each page carries the cursor for the next.
 *
 * @returns The `useInfiniteQuery` result for the feed.
 */
export function useShortsFeed() {
    return useInfiniteQuery<IShortVideoFeedPage, Failure>({
        queryKey: shortKeys.feed(),
        initialPageParam: "",
        queryFn: async ({ pageParam }) => {
            const cursor = (pageParam as string) || undefined;
            const result = await container.cradle.getShortsFeedUseCase.execute({
                cursor,
                pageSize: SHORTS_PAGE_SIZE
            });
            if (!result.ok) throw result.error;

            const page = result.value;
            if (cursor) return page;
            return { ...page, items: [...page.items, ...generateDummyShorts(DUMMY_SHORTS_COUNT)] };
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
    });
}
