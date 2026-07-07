"use client";

import { useQuery } from "@tanstack/react-query";

import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useArticlePopularTags
 *
 * @description
 * Fetches the popular article tags shown inline in the tag strip. The use case returns
 * a `Result`; this hook unwraps the value on success and throws the typed `Failure` on
 * error.
 *
 * @returns A TanStack query resolving the popular article tags.
 */
export function useArticlePopularTags() {
    return useQuery<IArticleTagEntity[], Failure>({
        queryKey: articleKeys.popularTags,
        queryFn: async () => {
            const result = await container.cradle.getArticlePopularTagsUseCase.execute();
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
