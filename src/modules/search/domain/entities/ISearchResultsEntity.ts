import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import type { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";

/**
 * ISearchResultsEntity
 *
 * @description
 * One page of search results plus the per-scope counts for the whole query, so the
 * scope tabs label themselves without a second request.
 *
 * @interface ISearchResultsEntity
 * @property {string} query - The trimmed term that was run
 * @property {ESearchScope} scope - The scope these items were narrowed to
 * @property {Record<ESearchScope, number>} counts - Hit counts per scope
 * @property {ISearchHitEntity[]} items - The hits for this page
 * @property {number} pageIndex - Zero-based page index
 * @property {number} pageSize - Items per page
 * @property {number} count - Total hits in the active scope
 * @property {boolean} hasMore - Whether a further page exists
 * @property {boolean} isEmpty - Whether the query matched nothing at all
 */
export interface ISearchResultsEntity {
    query: string;
    scope: ESearchScope;
    counts: Record<ESearchScope, number>;
    items: ISearchHitEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasMore: boolean;
    isEmpty: boolean;
}
