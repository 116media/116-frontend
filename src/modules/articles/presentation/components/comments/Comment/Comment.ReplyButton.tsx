"use client";

import { useTranslation } from "react-i18next";

import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { useCommentDisclosure } from "@/modules/articles/presentation/context/CommentDisclosureContext";
import { Button } from "@/shared/presentation/components/ui/Button";
import { CornerDownRightIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Comment.ReplyButton
 *
 * @description
 * Opens the inline reply composer. Renders nothing on a reply row (threads are one level
 * deep).
 */
export function CommentReplyButton() {
    const { t } = useTranslation();
    const { isReply } = useCommentData();
    const { toggleReply } = useCommentDisclosure();

    if (isReply) return null;

    return (
        <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={toggleReply}
            className="h-auto gap-1 px-1.5 py-1 font-normal text-muted-foreground text-xs hover:bg-transparent hover:text-foreground [&_svg]:size-3.5"
        >
            <CornerDownRightIcon />
            {t("articles.comments.reply")}
        </Button>
    );
}
