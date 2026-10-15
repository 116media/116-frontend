"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import { Comment } from "@/modules/articles/presentation/components/comments/Comment";
import { CommentComposer } from "@/modules/articles/presentation/components/comments/CommentComposer";
import { CommentListLoading } from "@/modules/articles/presentation/components/comments/CommentList";
import { useArticleComments } from "@/modules/articles/presentation/hooks/useArticleComments";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon, MessageSquareIcon } from "@/shared/presentation/components/ui/Icon";
import { Sheet } from "@/shared/presentation/components/ui/Sheet";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/presentation/components/ui/Tabs";

import type { CommentsSheetProps, CommentsSheetSort } from "./types";

/**
 * byLikes
 *
 * @description
 * Most-liked first, keeping the API's order among equals, so the popular tab reorders the
 * thread without shuffling comments that are level on likes.
 *
 * @param comments - The loaded comments.
 * @returns A sorted copy.
 */
function byLikes(comments: IArticleCommentEntity[]): IArticleCommentEntity[] {
    return [...comments].sort((a, b) => b.likeCount - a.likeCount);
}

/**
 * CommentsSheet
 *
 * @description
 * The full comment thread in a bottom sheet, for surfaces that only preview it — the
 * article page below `lg`. Reads the same query as the inline list, so opening it shows
 * what is already cached, and reuses the page's own comment rows and composer; the sort
 * tabs reorder the loaded comments client-side.
 */
export function CommentsSheet({
    slug,
    open,
    articleId,
    commentCount,
    onOpenChange
}: CommentsSheetProps) {
    const { t } = useTranslation();
    const [sort, setSort] = useState<CommentsSheetSort>("recent");
    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useArticleComments(articleId);

    const comments = data?.pages.flatMap((page) => page.items) ?? [];

    const rows = (items: IArticleCommentEntity[]) => (
        <div className="flex flex-col gap-6 py-2">
            {items.map((comment) => (
                <Comment.View
                    slug={slug}
                    key={comment.id}
                    comment={comment}
                    articleId={articleId}
                />
            ))}
            {isFetchingNextPage && <CommentListLoading count={1} />}
            {hasNextPage && (
                <Button
                    variant="ghost"
                    className="self-center"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {t("articles.comments.loadMore")}
                </Button>
            )}
        </div>
    );

    return (
        <Sheet.Root
            open={open}
            onOpenChange={onOpenChange}
        >
            <Sheet.Content
                detent="large"
                aria-describedby={undefined}
            >
                <Tabs
                    size="md"
                    value={sort}
                    className="flex min-h-0 flex-1 flex-col"
                    onValueChange={(next) => setSort(next as CommentsSheetSort)}
                >
                    <Sheet.Header
                        closeLabel={t("articles.comments.close")}
                        title={t("articles.comments.title", { count: commentCount })}
                    >
                        <TabsList className="w-full">
                            <TabsTrigger
                                value="popular"
                                className="flex-1"
                            >
                                {t("articles.comments.sort.popular")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="recent"
                                className="flex-1"
                            >
                                {t("articles.comments.sort.recent")}
                            </TabsTrigger>
                        </TabsList>
                    </Sheet.Header>

                    <Sheet.Body>
                        <StateRenderer
                            data={comments}
                            error={isError}
                            loading={isLoading}
                            skeleton={
                                <div className="flex flex-col gap-6 py-2">
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
                                <>
                                    <TabsContent
                                        value="popular"
                                        className="mt-0"
                                    >
                                        {rows(byLikes(items))}
                                    </TabsContent>
                                    <TabsContent
                                        value="recent"
                                        className="mt-0"
                                    >
                                        {rows(items)}
                                    </TabsContent>
                                </>
                            )}
                        />
                    </Sheet.Body>
                </Tabs>

                <Sheet.Footer>
                    <CommentComposer
                        slug={slug}
                        articleId={articleId}
                    />
                </Sheet.Footer>
            </Sheet.Content>
        </Sheet.Root>
    );
}
