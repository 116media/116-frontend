"use client";

import { useTranslation } from "react-i18next";
import { CommentListLoading } from "@/modules/articles/presentation/components/comments/CommentList/CommentList.Loading";
import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { useCommentDisclosure } from "@/modules/articles/presentation/context/CommentDisclosureContext";
import { useCommentReplies } from "@/modules/articles/presentation/hooks/useCommentReplies";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ErrorState } from "@/shared/presentation/components/ui/ErrorState";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

import { CommentView } from "./Comment.View";

/**
 * Comment.Replies
 *
 * @description
 * The expanded reply thread under a top-level comment, indented behind a left rule. Mounts
 * (and so fetches) only while expanded; pages load behind a "load more" button. Each reply
 * is the same Comment compound one level deep. Renders nothing on reply rows, when
 * collapsed, or when the thread comes back empty.
 */
export function CommentReplies() {
    const { t } = useTranslation();
    const { comment, articleId, slug, isReply } = useCommentData();
    const { showReplies } = useCommentDisclosure();
    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useCommentReplies(comment.id, showReplies && !isReply);

    if (isReply || !showReplies) return null;

    const replies = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <StateRenderer
            data={replies}
            error={isError}
            loading={isLoading}
            skeleton={
                <div className="flex flex-col gap-4 border-outlined border-l-2 pl-4">
                    <CommentListLoading count={2} />
                </div>
            }
            errorState={
                <ErrorState
                    onRetry={refetch}
                    context="comment-replies-error"
                    className="min-h-0 bg-transparent py-6"
                    title={t("articles.comments.repliesError.title")}
                    retryLabel={t("articles.comments.repliesError.retry")}
                />
            }
            render={(items) => (
                <div className="flex flex-col gap-4 border-outlined border-l-2 pl-4">
                    {items.map((reply) => (
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
            )}
        />
    );
}
