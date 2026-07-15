"use client";

import { useTranslation } from "react-i18next";

import { useCommentInteractions } from "@/modules/articles/presentation/context/CommentInteractionsContext";
import { Button } from "@/shared/presentation/components/ui/Button";
import { HeartIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Comment.LikeButton
 *
 * @description
 * The like toggle with its live count. The toggle is auth-gated in the provider, so a
 * guest press opens the login modal.
 */
export function CommentLikeButton() {
    const { t } = useTranslation();
    const { like } = useCommentInteractions();

    return (
        <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={like.toggle}
            aria-pressed={like.liked}
            aria-label={like.liked ? t("articles.comments.unlike") : t("articles.comments.like")}
            className={cn(
                "h-auto gap-1 px-1.5 py-1 font-normal text-muted-foreground text-xs hover:bg-transparent hover:text-foreground [&_svg]:size-3.5",
                like.liked && "text-destructive hover:text-destructive"
            )}
        >
            <HeartIcon className={cn(like.liked && "fill-destructive")} />
            {like.count > 0 && <span>{like.count}</span>}
        </Button>
    );
}
