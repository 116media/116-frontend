"use client";

import { useQuery } from "@tanstack/react-query";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { shortKeys } from "@/modules/shorts/presentation/constants/shortKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * Options for {@link useShortBySlug}.
 *
 * @interface IUseShortBySlugOptions
 * @property {IShortVideoEntity} [initialData] - Server-fetched short seeding the cache
 * so the client hydrates without a second fetch on mount.
 */
export interface IUseShortBySlugOptions {
    initialData?: IShortVideoEntity;
}

/**
 * useShortBySlug
 *
 * @description
 * Query for a single short by slug via `getShortBySlugUseCase`, backing the
 * `/shorts/{slug}` deep-link. Pass the server-fetched short as `initialData` to
 * hydrate without a second fetch.
 *
 * @param slug - The short slug from the route.
 * @param options - Optional `initialData` seeding the cache.
 * @returns The `useQuery` result for the short.
 */
export function useShortBySlug(slug: string, options: IUseShortBySlugOptions = {}) {
    return useQuery<IShortVideoEntity, Failure>({
        queryKey: shortKeys.detail(slug),
        initialData: options.initialData,
        queryFn: async () => {
            const result = await container.cradle.getShortBySlugUseCase.execute(slug);
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
