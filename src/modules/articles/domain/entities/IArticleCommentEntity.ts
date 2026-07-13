import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * IArticleCommentEntity
 *
 * @description
 * One comment on an article, mapped from ArticleCommentDto. The server-resolved `author`
 * projection stays undefined when the commenter could not be resolved. Deleted comments
 * arrive with `body: null`, `isDeleted: true`, and no author. A reply carries its parent
 * comment's id; top-level comments carry `parentCommentId: null`.
 *
 * @interface IArticleCommentEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} userId - Author's user UUID
 * @property {string | null} body - Comment text, or null when the comment is deleted
 * @property {boolean} isDeleted - Whether the comment has been removed
 * @property {string | null} createdAt - ISO creation timestamp, or null
 * @property {string | null} parentCommentId - Parent comment UUID for a reply, null for a top-level comment
 * @property {number} replyCount - Number of replies under this comment
 * @property {number} likeCount - Number of likes on this comment
 * @property {boolean} isLiked - Whether the requesting user liked this comment
 * @property {IArticleAuthor} [author] - Resolved author for the row byline, when the backend projects it
 */
export interface IArticleCommentEntity {
    id: string;
    userId: string;
    body: string | null;
    isDeleted: boolean;
    createdAt: string | null;
    parentCommentId: string | null;
    replyCount: number;
    likeCount: number;
    isLiked: boolean;
    author?: IArticleAuthor;
}
