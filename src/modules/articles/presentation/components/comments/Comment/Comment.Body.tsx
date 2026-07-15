"use client";

import { useTranslation } from "react-i18next";

import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { useCommentDisclosure } from "@/modules/articles/presentation/context/CommentDisclosureContext";

import { CommentEditForm } from "./Comment.EditForm";

/**
 * Comment.Body
 *
 * @description
 * The comment content, switching by state: a muted "removed" placeholder for a deleted
 * comment, the inline edit form while editing, else the comment text.
 */
export function CommentBody() {
    const { t } = useTranslation();
    const { comment, isRemoved } = useCommentData();
    const { isEditing } = useCommentDisclosure();

    if (isRemoved) {
        return (
            <p className="text-muted-foreground text-sm italic">{t("articles.comments.removed")}</p>
        );
    }

    if (isEditing) return <CommentEditForm />;

    return <p className="whitespace-pre-wrap text-foreground text-sm">{comment.body}</p>;
}
