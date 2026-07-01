import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * IArticleCommentEntity
 *
 * @description
 * One comment on an article, mapped from ArticleCommentDto. The `author` projection is
 * resolved server-side (user name plus avatar URL) and mapped when the DTO carries it;
 * it stays undefined when the commenter could not be resolved. Deleted comments arrive
 * with `body: null`, `isDeleted: true`, and no author.
 *
 * @interface IArticleCommentEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} userId - Author's user UUID
 * @property {string | null} body - Comment text, or null when the comment is deleted
 * @property {boolean} isDeleted - Whether the comment has been removed
 * @property {string | null} createdAt - ISO creation timestamp, or null
 * @property {IArticleAuthor} [author] - Resolved author for the row byline, when the backend projects it
 */
export interface IArticleCommentEntity {
    id: string;
    userId: string;
    body: string | null;
    isDeleted: boolean;
    createdAt: string | null;
    author?: IArticleAuthor;
}
