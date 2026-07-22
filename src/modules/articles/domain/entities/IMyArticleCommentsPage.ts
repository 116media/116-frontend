import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";

/**
 * IMyArticleCommentsPage
 *
 * @description
 * One page of the authenticated user's own comments on a single article, newest first,
 * plus the cursor needed to request the next page. `hasNextPage` is derived by the mapper
 * from the total `count`.
 *
 * @interface IMyArticleCommentsPage
 *
 * @property {IArticleCommentEntity[]} items - The caller's comments on this page
 * @property {number} pageIndex - Zero-based index of this page
 * @property {number} pageSize - Page size the server used
 * @property {number} count - Total comments across all pages
 * @property {boolean} hasNextPage - Whether a further page exists
 */
export interface IMyArticleCommentsPage {
    items: IArticleCommentEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
