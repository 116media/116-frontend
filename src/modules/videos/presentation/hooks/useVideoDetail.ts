"use client";

import { useQuery } from "@tanstack/react-query";

import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { dummyVideoDetail } from "@/modules/videos/presentation/data/video-detail.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

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
 * Query for a single video by slug via `getVideoBySlugUseCase`. Pass the
 * server-fetched video as `initialData` to hydrate without a second fetch;
 * a failed client refetch falls back to a dummy video during the dummy phase.
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
