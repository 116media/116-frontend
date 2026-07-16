import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * ICommentedArticleEntity
 *
 * @description
 * One article the authenticated user has commented on, grouped with the caller's latest
 * comment and the total number of comments they left on it. Ordered newest activity
 * first via `lastCommentedAt`.
 *
 * @interface ICommentedArticleEntity
 *
 * @property {IArticleSummaryEntity} article - The commented-on article summary
 * @property {IArticleCommentEntity} latestComment - The caller's most recent comment on the article
 * @property {number} commentCount - Total comments the caller left on the article
 * @property {string} lastCommentedAt - ISO timestamp of the caller's most recent comment
 */
export interface ICommentedArticleEntity {
    article: IArticleSummaryEntity;
    latestComment: IArticleCommentEntity;
    commentCount: number;
    lastCommentedAt: string;
}

/**
 * ICommentedArticlePage
 *
 * @description
 * One page of the articles the authenticated user has commented on plus the cursor needed
 * to request the next page. `hasNextPage` is derived by the mapper from the total `count`.
 *
 * @interface ICommentedArticlePage
 *
 * @property {ICommentedArticleEntity[]} items - The commented-on articles on this page
 * @property {number} pageIndex - Zero-based index of this page
 * @property {number} pageSize - Page size the server used
 * @property {number} count - Total commented-on articles across all pages
 * @property {boolean} hasNextPage - Whether a further page exists
 */
export interface ICommentedArticlePage {
    items: ICommentedArticleEntity[];
    pageIndex: number;
    pageSize: number;
    count: number;
    hasNextPage: boolean;
}
