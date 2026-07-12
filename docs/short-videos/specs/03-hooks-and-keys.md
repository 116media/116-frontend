# Spec 03 — Hooks & Keys

Design ref: [../03-domain-and-module.md](../03-domain-and-module.md),
[../07-interactions.md](../07-interactions.md). Query keys, the infinite feed hook, and the
interaction hooks. Reuses `useToggle` / `runInteraction` and `useShareVideo`'s pattern.

---

## 1. Keys + page size

`src/modules/shorts/presentation/constants/shortKeys.ts`

```ts
/**
 * IShortsFeedFilters
 *
 * @description
 * Optional scoping for the shorts feed; empty targets the full feed.
 *
 * @interface IShortsFeedFilters
 * @property {string} [search] - Optional title search term.
 */
export interface IShortsFeedFilters {
    search?: string;
}

/**
 * Stable TanStack Query keys for the shorts feature. The feed key embeds the
 * active filters so each combination caches independently; `detail` keys a
 * by-slug short for a future deep-link route.
 */
export const shortKeys = {
    all: ["shorts"] as const,
    feed: (filters: IShortsFeedFilters = {}) => [...shortKeys.all, "feed", filters] as const,
    detail: (slug: string) => [...shortKeys.all, "detail", slug] as const
};

/**
 * Page size for the shorts feed (strip + player share one infinite query).
 */
export const SHORTS_PAGE_SIZE = 10;
```

## 2. `useShortsFeed`

`src/modules/shorts/presentation/hooks/useShortsFeed.ts`

```ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IShortVideoPage } from "@/modules/shorts/domain/entities/IShortVideoPage";
import {
    type IShortsFeedFilters,
    SHORTS_PAGE_SIZE,
    shortKeys
} from "@/modules/shorts/presentation/constants/shortKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useShortsFeed
 *
 * @description
 * Infinite query over the public shorts feed, keyed by the active filters. Backs
 * both the homepage strip and the player modal, so a like or share stays
 * consistent across both through the shared cache.
 *
 * @param filters - Optional search scoping.
 * @returns The `useInfiniteQuery` result for the feed.
 */
export function useShortsFeed(filters: IShortsFeedFilters = {}) {
    return useInfiniteQuery<IShortVideoPage, Failure>({
        queryKey: shortKeys.feed(filters),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getShortsUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: SHORTS_PAGE_SIZE,
                ...filters
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        getNextPageParam: (lastPage) =>
            lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined
    });
}
```

Consumers flatten `data.pages.flatMap((p) => p.items)` to the single array both the strip and
the modal render.

## 3. `useToggleShortLike`

`src/modules/shorts/presentation/hooks/useToggleShortLike.ts`

```ts
"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "@/shared/presentation/hooks/useToggle";

/**
 * useToggleShortLike
 *
 * @description
 * Optimistic like toggle for one short, wrapping {@link useToggle} over the like /
 * unlike use cases. The DTO has no per-user like flag, so `initialLiked` is false
 * and the heart reflects only this session's actions.
 *
 * @param shortId - The short to like/unlike.
 * @param initialCount - The entity's `likeCount` baseline.
 * @param initialLiked - Session-local baseline. Defaults to false.
 * @returns `{ liked, count, toggle }` for the like button.
 */
export function useToggleShortLike(shortId: string, initialCount: number, initialLiked = false) {
    const { on, count, toggle } = useToggle(
        initialCount,
        (next) =>
            runInteraction(() =>
                (next
                    ? container.cradle.likeShortUseCase
                    : container.cradle.unlikeShortUseCase
                ).execute(shortId)
            ),
        initialLiked
    );
    return { liked: on, count, toggle };
}
```

## 4. `useShareShort`

`src/modules/shorts/presentation/hooks/useShareShort.ts`

```ts
"use client";

import { useQueryClient } from "@tanstack/react-query";

import type { IShortVideoPage } from "@/modules/shorts/domain/entities/IShortVideoPage";
import { shortKeys } from "@/modules/shorts/presentation/constants/shortKeys";
import container from "@/shared/infrastructure/service.locator";

/**
 * useShareShort
 *
 * @description
 * Records a share event against a short, fire-and-forget: failures are swallowed
 * so telemetry never blocks the share surface, and the cached feed's `shareCount`
 * for that short is bumped optimistically.
 *
 * @param shortId - The short the share event is recorded against.
 * @returns A `recordShare(shareChannel)` function for the share sheet.
 */
export function useShareShort(shortId: string) {
    const queryClient = useQueryClient();

    return (shareChannel: string) => {
        void container.cradle.shareShortUseCase.execute({ shortId, shareChannel });
        queryClient.setQueriesData<{ pages: IShortVideoPage[] }>(
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
```

## 5. `useRecordShortView`

`src/modules/shorts/presentation/hooks/useRecordShortView.ts`

```ts
"use client";

import container from "@/shared/infrastructure/service.locator";

/**
 * useRecordShortView
 *
 * @description
 * Records a view event against a short, fire-and-forget. The engagement gate and
 * per-session dedup live in the player; this hook only issues the call and
 * swallows failures.
 *
 * @returns A `recordView(shortId)` function.
 */
export function useRecordShortView() {
    return (shortId: string) => {
        void container.cradle.recordShortViewUseCase.execute(shortId);
    };
}
```

---

## Tasks

- [ ] `shortKeys` + `IShortsFeedFilters` + `SHORTS_PAGE_SIZE` created.
- [ ] `useShortsFeed` infinite query; `getNextPageParam` matches `useVideosFeed`.
- [ ] `useToggleShortLike` seeds `initialLiked = false`; wraps `useToggle` + `runInteraction`.
- [ ] `useShareShort` bumps `shareCount` across all feed-query caches; fire-and-forget.
- [ ] `useRecordShortView` fire-and-forget; no optimistic view bump.
- [ ] `tsc` + biome clean.
</content>
