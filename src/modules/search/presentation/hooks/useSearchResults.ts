"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import type { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import {
    MIN_SEARCH_TERM_LENGTH,
    SEARCH_PAGE_SIZE,
    searchKeys
} from "@/modules/search/presentation/constants/searchKeys";
import { withDummySearchResults } from "@/modules/search/presentation/data/search.dummy";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useSearchResults
 *
 * @description
 * Fetches one ranked page for a term and scope. Stays idle below the minimum term
 * length, and keeps the previous page on screen while the next one loads so switching
 * scope does not blank the list. While the catalogue is too thin to exercise the rows,
 * the dummy pool is mixed in behind a flag in `search.dummy.ts`.
 *
 * @param query - The trimmed term.
 * @param scope - The active scope.
 * @param pageIndex - Zero-based page index.
 * @returns A TanStack query resolving the page of hits and the per-scope counts.
 */
export function useSearchResults(query: string, scope: ESearchScope, pageIndex = 0) {
    const isQueryable = query.length >= MIN_SEARCH_TERM_LENGTH;

    return useQuery<ISearchResultsEntity, Failure>({
        enabled: isQueryable,
        placeholderData: keepPreviousData,
        queryKey: searchKeys.results(query, scope, pageIndex),
        queryFn: async () => {
            const result = await container.cradle.searchContentUseCase.execute({
                query,
                scope,
                pageIndex,
                pageSize: SEARCH_PAGE_SIZE
            });
            if (!result.ok) throw result.error;
            return withDummySearchResults(result.value, query, scope, SEARCH_PAGE_SIZE);
        }
    });
}
