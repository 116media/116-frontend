import type { RefObject } from "react";

/**
 * Props for ArticleDetail.Dock.
 *
 * @interface ArticleDetailDockProps
 * @property {string} articleId - The article the like, bookmark and share actions target.
 * @property {string} slug - Used to build the share URL.
 * @property {string} title - Share sheet title.
 * @property {number} likeCount - Baseline like count for the optimistic toggle.
 * @property {boolean} isLiked - Whether the viewer already liked the article.
 * @property {number} bookmarkCount - Baseline bookmark count for the optimistic toggle.
 * @property {boolean} isBookmarked - Whether the viewer already bookmarked the article.
 * @property {number} shareCount - Share count shown on the share action.
 * @property {number} commentCount - Shown as the badge on the comment action.
 * @property {RefObject<HTMLElement | null>} revealAfterRef - The element the reader must
 * scroll past before the dock appears.
 * @property {() => void} onComment - Scrolls to the comments and focuses the composer.
 */
export interface ArticleDetailDockProps {
    articleId: string;
    slug: string;
    title: string;
    likeCount: number;
    isLiked: boolean;
    bookmarkCount: number;
    isBookmarked: boolean;
    shareCount: number;
    commentCount: number;
    onComment: () => void;
    revealAfterRef: RefObject<HTMLElement | null>;
}
