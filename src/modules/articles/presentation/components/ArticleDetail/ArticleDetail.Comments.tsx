"use client";

import { forwardRef, type RefObject, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useArticleComments } from "@/modules/articles/presentation/hooks/useArticleComments";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon, MessageSquareIcon } from "@/shared/presentation/components/ui/Icon";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

import { ArticleDetailComment } from "./ArticleDetailComment";
import { ArticleDetailCommentComposer } from "./ArticleDetailCommentComposer";

/**
 * Stable IntersectionObserver options for the comments load-more sentinel. Pre-loads the
 * next page ~200px before the sentinel enters the viewport; module scope keeps the
 * identity stable so the observer is not recreated on re-render.
 */
const SENTINEL_OPTIONS: IntersectionObserverInit = { rootMargin: "200px 0px" };

/**
 * Props for ArticleDetailComments.
 *
 * @interface ArticleDetailCommentsProps
 * @property {string} articleId - The article whose comments are listed and posted to.
 * @property {string} slug - The article slug, threaded to the composer for the count bump.
 * @property {number} commentCount - Baseline count for the section heading (kept live by the mutation).
 * @property {RefObject<HTMLTextAreaElement | null>} [composerRef] - Ref threaded to the
 * composer textarea so the engagement comment button can focus it.
 */
export interface ArticleDetailCommentsProps {
    slug: string;
    articleId: string;
    commentCount: number;
    composerRef?: RefObject<HTMLTextAreaElement | null>;
}

/**
 * CommentSkeleton
 *
 * @description
 * A single comment-shaped shimmer block (avatar, name line, two body lines) matching the
 * row layout, so replacing skeletons with real comments causes no layout shift.
 */
function CommentSkeleton() {
    return (
        <div className="flex gap-3">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
            </div>
        </div>
    );
}

/**
 * ArticleDetailComments
 *
 * @description
 * The comments section: a heading with the live comment count, the composer at the top,
 * and the infinite comment list. Drives {@link useArticleComments} (infinite), flattens
 * its pages, and renders {@link ArticleDetailComment} rows with a sentinel observed by
 * {@link useIntersectionObserver} that requests the next page as it enters the viewport,
 * plus an explicit "load more" `Button` fallback. Shows loading skeletons, an
 * {@link EmptyState} ("be the first to comment") when there are none, and a retryable
 * error state. Forwards `ref` and carries the `comments` anchor `id` so the engagement
 * comment button can scroll to it and focus the composer.
 *
 * @param articleId - The article whose comments are listed and posted to.
 * @param slug - The article slug, threaded to the composer.
 * @param commentCount - Baseline count for the heading.
 * @param composerRef - Ref threaded to the composer textarea.
 */
export const ArticleDetailComments = forwardRef<HTMLElement, ArticleDetailCommentsProps>(
    ({ articleId, slug, commentCount, composerRef }, ref) => {
        const { t } = useTranslation();
        const {
            data,
            isLoading,
            isError,
            refetch,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage
        } = useArticleComments(articleId);

        const [sentinelRef, isSentinelVisible] = useIntersectionObserver(SENTINEL_OPTIONS);

        const comments = data?.pages.flatMap((page) => page.items) ?? [];

        useEffect(() => {
            if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
        }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

        const list = () => {
            if (isLoading) {
                const slots = Array.from({ length: 4 }, (_, index) => index);
                return (
                    <div className="flex flex-col gap-6">
                        {slots.map((slot) => (
                            <CommentSkeleton key={slot} />
                        ))}
                    </div>
                );
            }
            if (isError) {
                return (
                    <EmptyState
                        context="article-comments-error"
                        icon={<AlertCircleIcon className="size-10" />}
                        title={t("articles.comments.error.title")}
                        action={
                            <Button
                                variant="outline"
                                onClick={() => refetch()}
                            >
                                {t("articles.comments.error.retry")}
                            </Button>
                        }
                        className="min-h-0 py-12"
                    />
                );
            }
            if (comments.length === 0) {
                return (
                    <EmptyState
                        context="article-comments-empty"
                        icon={<MessageSquareIcon className="size-10" />}
                        title={t("articles.comments.empty.title")}
                        subtitle={t("articles.comments.empty.body")}
                        className="min-h-0 py-12"
                    />
                );
            }
            return (
                <div className="flex flex-col gap-6">
                    {comments.map((comment) => (
                        <ArticleDetailComment
                            key={comment.id}
                            comment={comment}
                        />
                    ))}
                    {isFetchingNextPage && <CommentSkeleton />}
                    {hasNextPage && (
                        <div
                            ref={sentinelRef}
                            className="flex justify-center"
                        >
                            <Button
                                variant="ghost"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {t("articles.comments.loadMore")}
                            </Button>
                        </div>
                    )}
                </div>
            );
        };

        return (
            <section
                ref={ref}
                id="comments"
                className="flex scroll-mt-24 flex-col gap-6"
            >
                <h2 className="font-semibold text-foreground text-xl">
                    {t("articles.comments.title", { count: commentCount })}
                </h2>
                <ArticleDetailCommentComposer
                    articleId={articleId}
                    slug={slug}
                    composerRef={composerRef}
                />
                {list()}
            </section>
        );
    }
);
ArticleDetailComments.displayName = "ArticleDetailComments";
