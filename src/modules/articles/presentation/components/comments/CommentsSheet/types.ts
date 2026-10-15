/**
 * Which order the sheet lists the loaded comments in.
 */
export type CommentsSheetSort = "popular" | "recent";

/**
 * Props for CommentsSheet.
 *
 * @interface CommentsSheetProps
 * @property {string} slug - The article slug, threaded to the rows and the composer.
 * @property {string} articleId - The article whose comments are listed and posted to.
 * @property {number} commentCount - Count shown in the sheet's title.
 * @property {boolean} open - Whether the sheet is open.
 * @property {(open: boolean) => void} onOpenChange - Emits the next open state.
 */
export interface CommentsSheetProps {
    slug: string;
    open: boolean;
    articleId: string;
    commentCount: number;
    onOpenChange: (open: boolean) => void;
}
