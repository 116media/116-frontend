"use client";

import { useQuery } from "@tanstack/react-query";

import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import { dummyPopularArticles } from "@/modules/articles/presentation/data/article-detail.dummy";
import container from "@/shared/infrastructure/service.locator";

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
 * weighted engagement server-side with the open article excluded via `excludeId`.
 * Dummy-data phase: a failed or empty result falls back to dummy popular articles.
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
                excludeId: currentArticleId
            });
            if (result.ok && result.value.length > 0) return result.value;
            return dummyPopularArticles(currentArticleId, POPULAR_SIDEBAR_LIMIT);
        }
    });
}
