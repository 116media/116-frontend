"use client";

import { useTranslation } from "react-i18next";

import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { useCommentDisclosure } from "@/modules/articles/presentation/context/CommentDisclosureContext";
import { useCommentReplies } from "@/modules/articles/presentation/hooks/useCommentReplies";
import { Button } from "@/shared/presentation/components/ui/Button";
import { SpinnerIcon } from "@/shared/presentation/components/ui/Icon";

import { CommentView } from "./Comment.View";

/**
 * Comment.Replies
 *
 * @description
 * The expanded reply thread under a top-level comment, indented behind a left rule. Mounts
 * (and so fetches) only while expanded; pages load behind a "load more" button. Each reply
 * is the same Comment compound one level deep. Renders nothing on reply rows or collapsed.
 */
export function CommentReplies() {
    const { t } = useTranslation();
    const { comment, articleId, slug, isReply } = useCommentData();
    const { showReplies } = useCommentDisclosure();
    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useCommentReplies(comment.id, showReplies && !isReply);

    if (isReply || !showReplies) return null;

    const replies = data?.pages.flatMap((page) => page.items) ?? [];

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-2 text-muted-foreground text-xs">
                <SpinnerIcon className="size-4 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center gap-3 py-2">
                <span className="text-muted-foreground text-xs">
                    {t("articles.comments.repliesError.title")}
                </span>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => refetch()}
                >
                    {t("articles.comments.repliesError.retry")}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 border-border border-l-2 pl-4">
            {replies.map((reply) => (
                <CommentView
                    isReply
                    slug={slug}
                    key={reply.id}
                    comment={reply}
                    articleId={articleId}
                />
            ))}
            {hasNextPage && (
                <Button
                    size="sm"
                    variant="ghost"
                    className="self-start"
                    loading={isFetchingNextPage}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {t("articles.comments.loadMoreReplies")}
                </Button>
            )}
        </div>
    );
}
