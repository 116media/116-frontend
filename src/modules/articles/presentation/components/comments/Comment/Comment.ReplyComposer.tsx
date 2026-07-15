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
 * Comment.ReplyComposer
 *
 * @description
 * Inline reply composer below the bubble, shown only while replying. Posting runs behind
 * the reply mutation's auth gate (in context), which opens the login modal when needed.
 * Renders nothing on reply rows or when closed.
 */
export function CommentReplyComposer() {
    const { t } = useTranslation();
    const { isReply } = useCommentData();
    const { isReplying, cancelReply } = useCommentDisclosure();
    const { submitReply, isReplyPending } = useCommentInteractions();
    const [value, setValue] = useState("");

    if (isReply || !isReplying) return null;

    const trimmed = value.trim();
    const isValid = trimmed.length > 0 && trimmed.length <= MAX_COMMENT_LENGTH;

    const onSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        if (!isValid) return;
        submitReply(trimmed);
        setValue("");
    };

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-2"
        >
            <Textarea
                autoFocus
                value={value}
                disabled={isReplyPending}
                maxLength={MAX_COMMENT_LENGTH}
                aria-label={t("articles.comments.reply")}
                onChange={(event) => setValue(event.target.value)}
                placeholder={t("articles.comments.replyPlaceholder")}
            />
            <div className="flex items-center justify-end gap-2">
                <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={cancelReply}
                    disabled={isReplyPending}
                >
                    {t("articles.comments.replyCancel")}
                </Button>
                <Button
                    size="sm"
                    type="submit"
                    loading={isReplyPending}
                    disabled={!isValid || isReplyPending}
                >
                    {t("articles.comments.replySubmit")}
                </Button>
            </div>
        </form>
    );
}
