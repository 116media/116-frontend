import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";

/**
 * Props shared by Comment.Root and the ready-made Comment.View.
 *
 * @interface CommentProps
 * @property {IArticleCommentEntity} comment - The comment to render.
 * @property {string} articleId - The article the comment belongs to; targets the mutations.
 * @property {string} slug - The article slug, to keep the cached detail count in step.
 * @property {boolean} [isReply] - Renders the row as a reply: no reply affordance, no thread.
 */
export interface CommentProps {
    comment: IArticleCommentEntity;
    articleId: string;
    slug: string;
    isReply?: boolean;
}
