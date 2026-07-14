"use client";

import { type InfiniteData, useQueryClient } from "@tanstack/react-query";

import type { IShortVideoFeedPage } from "@/modules/shorts/domain/entities/IShortVideoFeedPage";
import { shortKeys } from "@/modules/shorts/presentation/constants/shortKeys";
import container from "@/shared/infrastructure/service.locator";

/**
 * useShareShort
 *
 * @description
 * Records a share event against a short, fire-and-forget: failures are swallowed
 * so telemetry never blocks the share surface, and the cached feed's `shareCount`
 * for that short is bumped optimistically across every feed query.
 *
 * @param shortId - The short the share event is recorded against.
 * @returns A `recordShare(shareChannel)` function for the share sheet.
 */
export function useShareShort(shortId: string) {
    const queryClient = useQueryClient();

    return (shareChannel: string) => {
        void container.cradle.shareShortUseCase.execute({ shortId, shareChannel });
        queryClient.setQueriesData<InfiniteData<IShortVideoFeedPage>>(
            { queryKey: shortKeys.all },
            (current) =>
                current
                    ? {
                          ...current,
                          pages: current.pages.map((page) => ({
                              ...page,
                              items: page.items.map((short) =>
                                  short.id === shortId
                                      ? { ...short, shareCount: short.shareCount + 1 }
                                      : short
                              )
                          }))
                      }
                    : current
        );
    };
}
