"use client";

import { useQuery } from "@tanstack/react-query";

import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useAllTags
 *
 * @description
 * Fetches every tag for the "All tags" popover, filtered by a (debounced) search term,
 * enabled only while the popover is open. Unwraps the use case's `Result` on success and
 * throws the typed `Failure` on error.
 *
 * @param search - The popover's tag search term.
 * @param enabled - Whether the popover is open.
 * @returns A TanStack query resolving the matching tags.
 */
export function useAllTags(search: string, enabled: boolean) {
    return useQuery<IArticleTagEntity[], Failure>({
        queryKey: articleKeys.allTags(search),
        enabled,
        queryFn: async () => {
            const result = await container.cradle.getAllTagsUseCase.execute(search || undefined);
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
