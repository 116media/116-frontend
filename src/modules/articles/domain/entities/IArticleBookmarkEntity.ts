import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * IArticleBookmarkEntity
 *
 * @description
 * One entry in the authenticated user's bookmarks list: the bookmarked article summary
 * plus the timestamp at which the bookmark was created, used to order the list newest
 * first.
 *
 * @interface IArticleBookmarkEntity
 *
 * @property {IArticleSummaryEntity} article - The bookmarked article summary
 * @property {string} bookmarkedAt - ISO timestamp of when the bookmark was created
 */
export interface IArticleBookmarkEntity {
    bookmarkedAt: string;
    article: IArticleSummaryEntity;
}

/**
 * IArticleBookmarkPage
 *
 * @description
 * One page of the authenticated user's bookmarked articles plus the cursor needed to
 * request the next page. `hasNextPage` is derived by the mapper from the total `count`.
 *
 * @interface IArticleBookmarkPage
 *
 * @property {IArticleBookmarkEntity[]} items - The bookmarks on this page
 * @property {number} pageIndex - Zero-based index of this page
 * @property {number} pageSize - Page size the server used
 * @property {number} count - Total bookmarks across all pages
 * @property {boolean} hasNextPage - Whether a further page exists
 */
export interface IArticleBookmarkPage {
    count: number;
    pageSize: number;
    pageIndex: number;
    hasNextPage: boolean;
    items: IArticleBookmarkEntity[];
}
