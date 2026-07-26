"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useDeleteArticleComment } from "@/modules/articles/presentation/hooks/useDeleteArticleComment";
import { useEditArticleComment } from "@/modules/articles/presentation/hooks/useEditArticleComment";
import { useMyCommentsForArticle } from "@/modules/articles/presentation/hooks/useMyCommentsForArticle";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ConfirmDialog } from "@/shared/presentation/components/ui/ConfirmDialog";
import { Dialog, DialogContent, DialogTitle } from "@/shared/presentation/components/ui/Dialog";
import { EditIcon, SpinnerIcon, TrashIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { Textarea } from "@/shared/presentation/components/ui/Textarea";
import { ARTICLE_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for MyArticleCommentsDrawer.
 *
 * @interface MyArticleCommentsDrawerProps
 * @property {boolean} open - Whether the drawer is open (controlled).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/close).
 * @property {string} articleId - The article whose own-comments to page through.
 * @property {string} articleSlug - The article slug, for the "view article" link and delete cache bump.
 */
export interface MyArticleCommentsDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    articleId: string;
    articleSlug: string;
}

/**
 * MyArticleCommentsDrawer
 *
 * @description
 * Right-side drawer listing the caller's own comments on one article, fetched lazily and
 * paged via {@link useMyCommentsForArticle}. Each row edits inline or deletes behind a
 * confirm; edits/deletes apply locally so the list reflects them without a refetch. Built
 * on the Dialog primitive, which traps and restores focus.
 */
export function MyArticleCommentsDrawer({
    open,
    onOpenChange,
    articleId,
    articleSlug
}: MyArticleCommentsDrawerProps) {
    const { t } = useTranslation();

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMyCommentsForArticle(articleId, open);

    const editComment = useEditArticleComment(articleId);
    const deleteComment = useDeleteArticleComment(articleId, articleSlug);

    const [edits, setEdits] = useState<Record<string, string>>({});
    const [removed, setRemoved] = useState<ReadonlySet<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState("");
    const [pendingDelete, setPendingDelete] = useState<string | null>(null);

    const comments = (data?.pages.flatMap((page) => page.items) ?? []).filter(
        (comment) => !comment.isDeleted && !removed.has(comment.id)
    );

    const startEdit = (id: string, body: string) => {
        setEditingId(id);
        setDraft(body);
    };

    const saveEdit = (id: string, parentCommentId: string | null) => {
        const body = draft.trim();
        if (!body) return;
        editComment.submit({ commentId: id, body, parentCommentId }, () => {
            setEdits((current) => ({ ...current, [id]: body }));
            setEditingId(null);
        });
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        const id = pendingDelete;
        deleteComment.submit({ commentId: id, parentCommentId: null });
        setRemoved((current) => new Set(current).add(id));
        setPendingDelete(null);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="left-auto top-0 right-0 flex h-dvh max-h-dvh w-full max-w-md translate-x-0 translate-y-0 flex-col border-l bg-card">
                <div className="flex flex-col gap-1 border-b p-6 pr-12">
                    <DialogTitle className="font-bold text-foreground text-lg">
                        {t("favorites.comments.drawerTitle")}
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm">
                        {t("favorites.comments.drawerSubtitle")}
                    </p>
                    <Link
                        href={ARTICLE_DETAIL_PATH.replace(":slug", articleSlug)}
                        className="mt-1 font-medium text-primary text-sm hover:underline dark:text-secondary"
                    >
                        {t("favorites.comments.viewArticle")}
                    </Link>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-6">
                    <StateRenderer
                        data={comments}
                        loading={isLoading}
                        error={isError}
                        skeleton={
                            <div className="flex justify-center py-8">
                                <SpinnerIcon className="size-6 animate-spin text-muted-foreground" />
                            </div>
                        }
                        errorState={
                            <div className="flex flex-col items-center gap-3 py-8 text-center">
                                <p className="text-muted-foreground text-sm">
                                    {t("favorites.states.error")}
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetch()}
                                >
                                    {t("favorites.states.retry")}
                                </Button>
                            </div>
                        }
                        empty={
                            <p className="py-8 text-center text-muted-foreground text-sm">
                                {t("favorites.comments.empty")}
                            </p>
                        }
                        render={(items) => (
                            <ul className="flex flex-col gap-4">
                                {items.map((comment) => {
                                    const body = edits[comment.id] ?? comment.body ?? "";
                                    const isEditing = editingId === comment.id;
                                    return (
                                        <li
                                            key={comment.id}
                                            className="rounded-lg border bg-background p-4"
                                        >
                                            {isEditing ? (
                                                <div className="flex flex-col gap-2">
                                                    <Textarea
                                                        value={draft}
                                                        onChange={(event) =>
                                                            setDraft(event.target.value)
                                                        }
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            {t("favorites.comments.cancel")}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            loading={editComment.isPending}
                                                            onClick={() =>
                                                                saveEdit(
                                                                    comment.id,
                                                                    comment.parentCommentId
                                                                )
                                                            }
                                                        >
                                                            {t("favorites.comments.save")}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <p className="whitespace-pre-wrap text-foreground text-sm">
                                                        {body}
                                                    </p>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-muted-foreground text-xs">
                                                            <RelativeDate
                                                                date={comment.createdAt}
                                                            />
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                aria-label={t(
                                                                    "favorites.comments.edit"
                                                                )}
                                                                onClick={() =>
                                                                    startEdit(comment.id, body)
                                                                }
                                                            >
                                                                <EditIcon />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                aria-label={t(
                                                                    "favorites.comments.delete"
                                                                )}
                                                                onClick={() =>
                                                                    setPendingDelete(comment.id)
                                                                }
                                                            >
                                                                <TrashIcon />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}

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
            </DialogContent>

            <ConfirmDialog
                destructive
                open={pendingDelete !== null}
                onOpenChange={(next) => !next && setPendingDelete(null)}
                title={t("favorites.comments.confirmDeleteTitle")}
                description={t("favorites.comments.confirmDeleteBody")}
                confirmLabel={t("favorites.comments.confirmDelete")}
                cancelLabel={t("favorites.comments.cancel")}
                loading={deleteComment.isPending}
                onConfirm={confirmDelete}
            />
        </Dialog>
    );
}
