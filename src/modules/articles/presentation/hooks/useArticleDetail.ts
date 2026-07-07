"use client";

import { useQuery } from "@tanstack/react-query";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import { dummyArticleDetail } from "@/modules/articles/presentation/data/article-detail.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

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
 * Query for a single article by slug via `getArticleBySlugUseCase`; a server-fetched
 * article passed as `initialData` hydrates the cache without a second fetch. Dummy-data
 * phase: a failed client refetch falls back to the dummy article matching the server fallback.
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
