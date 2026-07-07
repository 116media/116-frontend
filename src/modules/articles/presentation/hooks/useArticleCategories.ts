"use client";

import { useQuery } from "@tanstack/react-query";

import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useArticleCategories
 *
 * @description
 * Fetches the active article categories for the filter dropdown. Cached under a stable
 * key; categories change rarely. The use case returns a `Result`; this hook unwraps the
 * value on success and throws the typed `Failure` on error.
 *
 * @returns A TanStack query resolving the active article categories.
 */
export function useArticleCategories() {
    return useQuery<IArticleCategoryEntity[], Failure>({
        queryKey: articleKeys.categories,
        queryFn: async () => {
            const result = await container.cradle.getArticleCategoriesUseCase.execute();
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
