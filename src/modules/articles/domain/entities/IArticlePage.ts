import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * IArticlePage
 *
 * @description
 * One page of the published-articles feed plus the cursor needed to request the next
 * page. `hasNextPage` is derived by the mapper from the total `count`.
 *
 * @interface IArticlePage
 *
 * @property {IArticleSummaryEntity[]} items - The articles on this page
 * @property {number} pageIndex - Zero-based index of this page
 * @property {number} pageSize - Page size the server used
 * @property {number} count - Total articles across all pages
 * @property {boolean} hasNextPage - Whether a further page exists
 */
export interface IArticlePage {
    items: IArticleSummaryEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
