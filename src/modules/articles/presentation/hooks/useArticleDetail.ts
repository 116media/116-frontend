"use client";

import { useQuery } from "@tanstack/react-query";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { articleKeys } from "../constants/articleKeys";
import { dummyArticleDetail } from "../data/article-detail.dummy";

/**
 * Options for {@link useArticleDetail}.
 *
 * @interface IUseArticleDetailOptions
 * @property {IArticleDetailEntity} [initialData] - Server-fetched article seeding the
 * query cache so the client hydrates without a second fetch on mount.
 */
export interface IUseArticleDetailOptions {
    initialData?: IArticleDetailEntity;
}

/**
 * useArticleDetail
 *
 * @description
 * Query for a single article by slug. Calls `getArticleBySlugUseCase`. When the route
 * already fetched the article server-side, pass it as `initialData` so the
 * `articleKeys.detail(slug)` cache entry hydrates without a second fetch.
 *
 * Dummy-data phase: while the backend has no published content, a failed client refetch
 * falls back to a fully-populated dummy article (matching the server fallback) so the
 * preview stays stable instead of flipping to the error view.
 *
 * @param slug - The article slug from the route.
 * @param options - Optional `initialData` seeding the cache.
 * @returns The `useQuery` result for the article detail.
 */
export function useArticleDetail(slug: string, options: IUseArticleDetailOptions = {}) {
    return useQuery<IArticleDetailEntity, Failure>({
        queryKey: articleKeys.detail(slug),
        initialData: options.initialData,
        queryFn: async () => {
            const result = await container.cradle.getArticleBySlugUseCase.execute(slug);
            return result.ok ? result.value : dummyArticleDetail(slug);
        }
    });
}
