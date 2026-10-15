"use client";

import { forwardRef, type RefObject, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Comment } from "@/modules/articles/presentation/components/comments/Comment";
import { CommentComposer } from "@/modules/articles/presentation/components/comments/CommentComposer";
import { CommentsSheet } from "@/modules/articles/presentation/components/comments/CommentsSheet";
import { useArticleComments } from "@/modules/articles/presentation/hooks/useArticleComments";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon, MessageSquareIcon } from "@/shared/presentation/components/ui/Icon";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { CommentListLoading } from "./CommentList.Loading";

/**
 * How many comments a phone shows inline. The rest of the thread lives in the sheet the
 * button below the preview opens, so a long thread never buries the article's own tail.
 */
const MOBILE_PREVIEW_COUNT = 3;

/**
 * Props for CommentList.
 *
 * @interface CommentListProps
 * @property {string} articleId - The article whose comments are listed and posted to.
 * @property {string} slug - The article slug, threaded to the composer and rows.
 * @property {number} commentCount - Baseline count for the section heading (kept live by the mutation).
 * @property {RefObject<HTMLTextAreaElement | null>} [composerRef] - Ref threaded to the
 * composer textarea so the engagement comment button can focus it.
 */
export interface CommentListProps {
    slug: string;
    articleId: string;
    commentCount: number;
    composerRef?: RefObject<HTMLTextAreaElement | null>;
}

/**
 * CommentList
 *
 * @description
 * Comments section island: heading with live count, the top-level composer, and the
 * infinite comment list driven by {@link useArticleComments} with loading, empty, and
 * retryable error states. Below `lg` the list stops after three comments and a button
 * opens the rest in {@link CommentsSheet}, where the thread can be sorted and replied to. Each row is a {@link Comment} compound. Forwards `ref` and the
 * `comments` anchor id so the engagement button can scroll here.
 */
export const CommentList = forwardRef<HTMLElement, CommentListProps>(
    ({ articleId, slug, commentCount, composerRef }, ref) => {
        const { t } = useTranslation();
        const [isSheetOpen, setIsSheetOpen] = useState(false);
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

        return (
            <section
                ref={ref}
                id="comments"
                className="flex scroll-mt-24 flex-col gap-6"
            >
                <h2 className="font-semibold text-foreground text-xl">
                    {t("articles.comments.title", { count: commentCount })}
                </h2>
                <CommentComposer
                    slug={slug}
                    articleId={articleId}
                    composerRef={composerRef}
                />
                <StateRenderer
                    data={comments}
                    error={isError}
                    loading={isLoading}
                    skeleton={
                        <div className="flex flex-col gap-6">
                            <CommentListLoading />
                        </div>
                    }
                    errorState={
                        <EmptyState
                            className="min-h-0 py-12"
                            context="article-comments-error"
                            title={t("articles.comments.error.title")}
                            icon={<AlertCircleIcon className="size-10" />}
                            action={
                                <Button
                                    variant="outline"
                                    onClick={() => refetch()}
                                >
                                    {t("articles.comments.error.retry")}
                                </Button>
                            }
                        />
                    }
                    empty={
                        <EmptyState
                            className="min-h-0 py-12"
                            context="article-comments-empty"
                            title={t("articles.comments.empty.title")}
                            subtitle={t("articles.comments.empty.body")}
                            icon={<MessageSquareIcon className="size-10" />}
                        />
                    }
                    render={(items) => (
                        <div className="flex flex-col gap-6">
                            {items.map((comment, index) => (
                                <div
                                    key={comment.id}
                                    className={cn(index >= MOBILE_PREVIEW_COUNT && "max-lg:hidden")}
                                >
                                    <Comment.View
                                        slug={slug}
                                        comment={comment}
                                        articleId={articleId}
                                    />
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                className="lg:hidden"
                                onClick={() => setIsSheetOpen(true)}
                            >
                                {t("articles.comments.showAll", { count: commentCount })}
                            </Button>

                            {isFetchingNextPage && (
                                <div className="max-lg:hidden">
                                    <CommentListLoading count={1} />
                                </div>
                            )}
                            {hasNextPage && (
                                <div
                                    ref={sentinelRef}
                                    className="flex justify-center max-lg:hidden"
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
                    )}
                />

                <CommentsSheet
                    slug={slug}
                    open={isSheetOpen}
                    articleId={articleId}
                    commentCount={commentCount}
                    onOpenChange={setIsSheetOpen}
                />
            </section>
        );
    }
);
CommentList.displayName = "CommentList";
