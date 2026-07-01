import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";

/**
 * IArticleCommentPage
 *
 * @description
 * One page of an article's comments plus the cursor needed to request the next page.
 * `hasNextPage` is derived by the mapper from the total `count`.
 *
 * @interface IArticleCommentPage
 *
 * @property {IArticleCommentEntity[]} items - The comments on this page
 * @property {number} pageIndex - Zero-based index of this page
 * @property {number} pageSize - Page size the server used
 * @property {number} count - Total comments across all pages
 * @property {boolean} hasNextPage - Whether a further page exists
 */
export interface IArticleCommentPage {
    items: IArticleCommentEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
