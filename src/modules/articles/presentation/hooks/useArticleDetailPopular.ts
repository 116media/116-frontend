"use client";

import { useQuery } from "@tanstack/react-query";

import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import {
    dummyPopularArticles,
    paddedPopularArticles
} from "@/modules/articles/presentation/data/article-detail.dummy";
import container from "@/shared/infrastructure/service.locator";
import { apiIdOrUndefined } from "@/shared/presentation/utils/id/id.utils";

/**
 * POPULAR_SIDEBAR_LIMIT
 *
 * @description
 * The maximum number of popular articles the sidebar shows.
 */
const POPULAR_SIDEBAR_LIMIT = 5;

/**
 * useArticleDetailPopular
 *
 * @description
 * Sources the popular-articles sidebar from `getPopularArticlesUseCase`, ranked by
 * weighted engagement server-side with the open article excluded via `excludeId`, which
 * is sent only when its id is one the API can bind (a dummy article's is not a UUID).
 * Dummy-data phase: a short list is topped up with dummy articles and a failed one is
 * replaced by them, so the block is never part-filled.
 *
 * @param currentArticleId - The article currently open, excluded from the results.
 * @returns The TanStack Query result whose `data` is up to five `IArticleSummaryEntity`.
 */
export function useArticleDetailPopular(currentArticleId: string) {
    return useQuery<IArticleSummaryEntity[]>({
        queryKey: articleKeys.popular(currentArticleId),
        queryFn: async () => {
            const result = await container.cradle.getPopularArticlesUseCase.execute({
                limit: POPULAR_SIDEBAR_LIMIT,
                excludeId: apiIdOrUndefined(currentArticleId)
            });
            if (result.ok) {
                return paddedPopularArticles(result.value, currentArticleId, POPULAR_SIDEBAR_LIMIT);
            }

            return dummyPopularArticles(currentArticleId, POPULAR_SIDEBAR_LIMIT);
        }
    });
}
