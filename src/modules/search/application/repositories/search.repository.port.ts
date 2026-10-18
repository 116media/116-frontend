import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import type { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import type { Result } from "@/shared/domain/results/result";

/**
 * ISearchContentInput
 *
 * @description
 * Arguments for one search request.
 *
 * @interface ISearchContentInput
 * @property {string} query - The reader's query, already trimmed
 * @property {ESearchScope} scope - The scope to narrow to
 * @property {number} [pageIndex] - Zero-based page index
 * @property {number} [pageSize] - Items per page
 */
export interface ISearchContentInput {
    query: string;
    scope: ESearchScope;
    pageIndex?: number;
    pageSize?: number;
}

/**
 * ISearchRepositoryPort
 *
 * @description
 * Application-layer contract for cross-content search.
 *
 * @interface ISearchRepositoryPort
 */
export interface ISearchRepositoryPort {
    /**
     * Searches the published content for a query within a scope.
     *
     * @param input - Query, scope and pagination.
     * @returns `ok(ISearchResultsEntity)` on success, `err(Failure)` on failure.
     */
    search(input: ISearchContentInput): Promise<Result<ISearchResultsEntity>>;
}
