import { MyArticleCommentsModalRoot } from "./MyArticleCommentsModal";
import { MyArticleCommentsModalEditForm } from "./MyArticleCommentsModal.EditForm";
import { MyArticleCommentsModalHeader } from "./MyArticleCommentsModal.Header";
import { MyArticleCommentsModalRow } from "./MyArticleCommentsModal.Row";

export type { MyArticleCommentsModalProps } from "./types";

/**
 * MyArticleCommentsModal
 *
 * @description
 * Compound for the reader's own comments on one article: a bottom sheet on phones and the
 * right-side drawer from `sm` up. The root is the ready-made surface, with `.Header`,
 * `.Row` and `.EditForm` as the regions it arranges.
 */
export const MyArticleCommentsModal = {
    Root: MyArticleCommentsModalRoot,
    Header: MyArticleCommentsModalHeader,
    Row: MyArticleCommentsModalRow,
    EditForm: MyArticleCommentsModalEditForm
} as const;
