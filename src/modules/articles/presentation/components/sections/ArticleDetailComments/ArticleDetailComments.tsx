"use client";

import { forwardRef, type RefObject, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArticleDetailComment } from "@/modules/articles/presentation/components/sections/ArticleDetailComment";
import { ArticleDetailCommentComposer } from "@/modules/articles/presentation/components/sections/ArticleDetailCommentComposer";
import { useArticleComments } from "@/modules/articles/presentation/hooks/useArticleComments";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon, MessageSquareIcon } from "@/shared/presentation/components/ui/Icon";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

import { ArticleDetailCommentsLoading } from "./ArticleDetailComments.Loading";

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
 * ArticleDetailComments
 *
 * @description
 * Comments section: heading with live count, composer, and the infinite comment list
 * driven by {@link useArticleComments} with loading, empty, and retryable error states.
 * Forwards `ref` and the `comments` anchor id so the engagement button can scroll here.
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

        const [sentinelRef, isSentinelVisible] = useIntersectionObserver(
            INFINITE_SCROLL_SENTINEL_OPTIONS
        );

        const comments = data?.pages.flatMap((page) => page.items) ?? [];

        useEffect(() => {
            if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
        }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

        const list = () => {
            if (isLoading) {
                return (
                    <div className="flex flex-col gap-6">
                        <ArticleDetailCommentsLoading />
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
                    {isFetchingNextPage && <ArticleDetailCommentsLoading count={1} />}
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
