"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CommentListLoading } from "@/modules/articles/presentation/components/comments/CommentList";
import { useDeleteArticleComment } from "@/modules/articles/presentation/hooks/useDeleteArticleComment";
import { useEditArticleComment } from "@/modules/articles/presentation/hooks/useEditArticleComment";
import { useMyCommentsForArticle } from "@/modules/articles/presentation/hooks/useMyCommentsForArticle";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ConfirmDialog } from "@/shared/presentation/components/ui/ConfirmDialog";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon, MessageSquareIcon } from "@/shared/presentation/components/ui/Icon";
import { Sheet } from "@/shared/presentation/components/ui/Sheet";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

import { MyArticleCommentsModalHeader } from "./MyArticleCommentsModal.Header";
import { MyArticleCommentsModalRow } from "./MyArticleCommentsModal.Row";
import type { MyArticleCommentsModalProps } from "./types";

/**
 * MyArticleCommentsModal
 *
 * @description
 * The reader's own comments on one article, fetched lazily on open and paged via
 * {@link useMyCommentsForArticle}. A bottom sheet on phones and the right-side drawer from
 * `sm` up. Owns which row is being edited and the pending delete; edits and deletions are
 * applied locally so the list reflects them without a refetch.
 */
export function MyArticleCommentsModalRoot({
    open,
    onOpenChange,
    articleId,
    articleSlug
}: MyArticleCommentsModalProps) {
    const { t } = useTranslation();

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMyCommentsForArticle(articleId, open);

    const editComment = useEditArticleComment(articleId);
    const deleteComment = useDeleteArticleComment(articleId, articleSlug);

    const [edits, setEdits] = useState<Record<string, string>>({});
    const [removed, setRemoved] = useState<ReadonlySet<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [pendingDelete, setPendingDelete] = useState<string | null>(null);

    const comments = (data?.pages.flatMap((page) => page.items) ?? []).filter(
        (comment) => !comment.isDeleted && !removed.has(comment.id)
    );

    const saveEdit = (id: string, parentCommentId: string | null, body: string) => {
        editComment.submit({ commentId: id, body, parentCommentId }, () => {
            setEdits((current) => ({ ...current, [id]: body }));
            setEditingId(null);
        });
    };

    const confirmDelete = () => {
        if (pendingDelete === null) return;

        deleteComment.submit({ commentId: pendingDelete, parentCommentId: null });
        setRemoved((current) => new Set(current).add(pendingDelete));
        setPendingDelete(null);
    };

    return (
        <Sheet.Root
            open={open}
            onOpenChange={onOpenChange}
        >
            <Sheet.Content
                detent="large"
                showHandle={false}
                className="bg-card sm:top-0 sm:right-0 sm:bottom-0 sm:left-auto sm:h-dvh sm:max-h-dvh sm:max-w-md sm:translate-x-0 sm:rounded-none sm:border-outlined sm:border-l"
            >
                <MyArticleCommentsModalHeader articleSlug={articleSlug} />

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
                    <StateRenderer
                        data={comments}
                        error={isError}
                        loading={isLoading}
                        skeleton={
                            <div className="flex flex-col gap-6">
                                <CommentListLoading count={3} />
                            </div>
                        }
                        errorState={
                            <EmptyState
                                className="min-h-0 py-8"
                                context="my-article-comments-error"
                                title={t("favorites.states.error")}
                                icon={<AlertCircleIcon className="size-10" />}
                                action={
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => refetch()}
                                    >
                                        {t("favorites.states.retry")}
                                    </Button>
                                }
                            />
                        }
                        empty={
                            <EmptyState
                                className="min-h-0 py-8"
                                context="my-article-comments-empty"
                                title={t("favorites.comments.empty")}
                                icon={<MessageSquareIcon className="size-10" />}
                            />
                        }
                        render={(items) => (
                            <ul className="flex flex-col gap-4">
                                {items.map((comment) => (
                                    <MyArticleCommentsModalRow
                                        key={comment.id}
                                        comment={comment}
                                        isSaving={editComment.isPending}
                                        isEditing={editingId === comment.id}
                                        body={edits[comment.id] ?? comment.body ?? ""}
                                        onDelete={() => setPendingDelete(comment.id)}
                                        onStartEdit={() => setEditingId(comment.id)}
                                        onCancelEdit={() => setEditingId(null)}
                                        onSave={(body) =>
                                            saveEdit(comment.id, comment.parentCommentId, body)
                                        }
                                    />
                                ))}

                                {hasNextPage && (
                                    <Button
                                        variant="outline"
                                        loading={isFetchingNextPage}
                                        onClick={() => fetchNextPage()}
                                    >
                                        {t("favorites.states.loading")}
                                    </Button>
                                )}
                            </ul>
                        )}
                    />
                </div>
            </Sheet.Content>

            <ConfirmDialog
                destructive
                open={pendingDelete !== null}
                loading={deleteComment.isPending}
                onConfirm={confirmDelete}
                title={t("favorites.comments.confirmDeleteTitle")}
                cancelLabel={t("favorites.comments.cancel")}
                confirmLabel={t("favorites.comments.confirmDelete")}
                description={t("favorites.comments.confirmDeleteBody")}
                onOpenChange={(next) => !next && setPendingDelete(null)}
            />
        </Sheet.Root>
    );
}
