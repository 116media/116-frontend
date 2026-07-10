"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { videoKeys } from "../constants/videoKeys";
import { dummyVideoDetail } from "../data/video-detail.dummy";

/**
 * Options for {@link useVideoDetail}.
 *
 * @interface IUseVideoDetailOptions
 * @property {IVideoDetailEntity} [initialData] - Server-fetched video seeding the
 * query cache so the client hydrates without a second fetch on mount.
 */
export interface IUseVideoDetailOptions {
    initialData?: IVideoDetailEntity;
}

/**
 * useVideoDetail
 *
 * @description
 * Query for a single video by slug. Calls `getVideoBySlugUseCase`. When the
 * route already fetched the video server-side, pass it as `initialData` so the
 * `videoKeys.detail(slug)` cache entry hydrates without a second fetch.
 *
 * Dummy-data phase: while the backend has no published content, a failed
 * client refetch falls back to a fully-populated dummy video (matching the
 * server fallback) so the preview stays stable instead of flipping to the
 * error view.
 *
 * @param slug - The video slug from the route.
 * @param options - Optional `initialData` seeding the cache.
 * @returns The `useQuery` result for the video detail.
 */
export function useVideoDetail(slug: string, options: IUseVideoDetailOptions = {}) {
    return useQuery<IVideoDetailEntity, Failure>({
        queryKey: videoKeys.detail(slug),
        initialData: options.initialData,
        queryFn: async () => {
            const result = await container.cradle.getVideoBySlugUseCase.execute(slug);
            return result.ok ? result.value : dummyVideoDetail(slug);
        }
    });
}
