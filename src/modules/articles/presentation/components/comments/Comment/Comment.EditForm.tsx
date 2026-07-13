"use client";

import { type SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { MAX_COMMENT_LENGTH } from "@/modules/articles/presentation/constants/articleKeys";
import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { useCommentDisclosure } from "@/modules/articles/presentation/context/CommentDisclosureContext";
import { useCommentInteractions } from "@/modules/articles/presentation/context/CommentInteractionsContext";
import { Button } from "@/shared/presentation/components/ui/Button";
import { Textarea } from "@/shared/presentation/components/ui/Textarea";

/**
 * Comment.EditForm
 *
 * @description
 * Inline edit form swapped in place of the body. Seeds from the current text, validates a
 * trimmed, length-bounded value, and delegates save/cancel to the comment context.
 */
export function CommentEditForm() {
    const { t } = useTranslation();
    const { comment } = useCommentData();
    const { cancelEdit } = useCommentDisclosure();
    const { submitEdit, isEditPending } = useCommentInteractions();
    const [value, setValue] = useState(comment.body ?? "");

    const trimmed = value.trim();
    const isValid = trimmed.length > 0 && trimmed.length <= MAX_COMMENT_LENGTH;

    const onSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        if (!isValid) return;
        submitEdit(trimmed);
    };

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-2"
        >
            <Textarea
                value={value}
                disabled={isEditPending}
                maxLength={MAX_COMMENT_LENGTH}
                aria-label={t("articles.comments.edit")}
                onChange={(event) => setValue(event.target.value)}
            />
            <div className="flex items-center justify-end gap-2">
                <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={isEditPending}
                >
                    {t("articles.comments.editCancel")}
                </Button>
                <Button
                    size="sm"
                    type="submit"
                    loading={isEditPending}
                    disabled={!isValid || isEditPending}
                >
                    {t("articles.comments.editSave")}
                </Button>
            </div>
        </form>
    );
}
