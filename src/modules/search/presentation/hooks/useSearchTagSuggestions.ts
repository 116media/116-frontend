"use client";

import { useQuery } from "@tanstack/react-query";

import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import { searchKeys } from "@/modules/search/presentation/constants/searchKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * How many tags the idle state offers before the list reads as a wall.
 */
const SUGGESTION_LIMIT = 8;

/**
 * useSearchTagSuggestions
 *
 * @description
 * The tags the overlay offers before a term is typed. Popular tags stand in for the
 * popular *queries* the design asks for, which would need query telemetry the backend
 * does not collect; a tag is real, and always leads somewhere.
 *
 * @returns A TanStack query resolving the tags to offer.
 */
export function useSearchTagSuggestions() {
    return useQuery<IArticleTagEntity[], Failure>({
        queryKey: [...searchKeys.all, "tag-suggestions"] as const,
        queryFn: async () => {
            const result = await container.cradle.getArticlePopularTagsUseCase.execute();
            if (!result.ok) throw result.error;
            return result.value.slice(0, SUGGESTION_LIMIT);
        }
    });
}
