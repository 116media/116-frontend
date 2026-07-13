"use client";

import { useTranslation } from "react-i18next";

import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { useCommentDisclosure } from "@/modules/articles/presentation/context/CommentDisclosureContext";
import { Button } from "@/shared/presentation/components/ui/Button";

/**
 * Comment.RepliesToggle
 *
 * @description
 * The "View N replies" / "Hide replies" button. Renders only on a top-level comment that
 * has at least one reply.
 */
export function CommentRepliesToggle() {
    const { t } = useTranslation();
    const { isReply, replyCount } = useCommentData();
    const { showReplies, toggleReplies } = useCommentDisclosure();

    if (isReply || replyCount === 0) return null;

    return (
        <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={toggleReplies}
            className="h-auto self-start px-1.5 py-1 font-normal text-muted-foreground text-xs hover:bg-transparent hover:text-foreground"
        >
            {showReplies
                ? t("articles.comments.hideReplies")
                : t("articles.comments.viewReplies", { count: replyCount })}
        </Button>
    );
}
