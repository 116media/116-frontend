/**
 * Props for MyArticleCommentsModal.
 *
 * @interface MyArticleCommentsModalProps
 * @property {boolean} open - Whether the drawer is open (controlled).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/close).
 * @property {string} articleId - The article whose own-comments to page through.
 * @property {string} articleSlug - The article slug, for the "view article" link and delete cache bump.
 */
export interface MyArticleCommentsModalProps {
    open: boolean;
    articleId: string;
    articleSlug: string;
    onOpenChange: (open: boolean) => void;
}
