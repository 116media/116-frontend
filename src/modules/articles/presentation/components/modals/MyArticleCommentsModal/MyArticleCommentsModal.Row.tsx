"use client";

import { useTranslation } from "react-i18next";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EditIcon, TrashIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";

import { MyArticleCommentsModalEditForm } from "./MyArticleCommentsModal.EditForm";

/**
 * Props for MyArticleCommentsModal.Row.
 *
 * @interface MyArticleCommentsModalRowProps
 * @property {IArticleCommentEntity} comment - The comment this row shows.
 * @property {string} body - The text to display, which is the locally edited value once edited.
 * @property {boolean} isEditing - Whether this row is the one being edited.
 * @property {boolean} isSaving - Whether the edit mutation is in flight.
 * @property {() => void} onStartEdit - Puts this row into edit mode.
 * @property {() => void} onCancelEdit - Leaves edit mode.
 * @property {(body: string) => void} onSave - Commits the edited body.
 * @property {() => void} onDelete - Asks for the delete confirmation.
 */
export interface MyArticleCommentsModalRowProps {
    body: string;
    isEditing: boolean;
    isSaving: boolean;
    comment: IArticleCommentEntity;
    onSave: (body: string) => void;
    onStartEdit: () => void;
    onCancelEdit: () => void;
    onDelete: () => void;
}

/**
 * MyArticleCommentsModal.Row
 *
 * @description
 * One of the reader's own comments: its text and posting date with edit and delete
 * controls, swapped for the inline edit form while this row is the one being edited. The
 * card sits on `muted`, the one surface that differs from the drawer's ground in both
 * themes, and its controls hover to `surface-hover`, since the default ghost hover is the
 * same value as `muted` and would leave no hover to see.
 *
 * @param comment - The comment this row shows.
 * @param body - The text to display.
 * @param isEditing - Whether this row is being edited.
 * @param isSaving - Whether the edit mutation is in flight.
 * @param onStartEdit - Puts this row into edit mode.
 * @param onCancelEdit - Leaves edit mode.
 * @param onSave - Commits the edited body.
 * @param onDelete - Asks for the delete confirmation.
 */
export function MyArticleCommentsModalRow({
    body,
    comment,
    isEditing,
    isSaving,
    onSave,
    onStartEdit,
    onCancelEdit,
    onDelete
}: MyArticleCommentsModalRowProps) {
    const { t } = useTranslation();

    return (
        <li className="rounded-lg border border-outlined bg-muted p-4">
            {isEditing ? (
                <MyArticleCommentsModalEditForm
                    body={body}
                    isSaving={isSaving}
                    onSave={onSave}
                    onCancel={onCancelEdit}
                />
            ) : (
                <div className="flex flex-col gap-2">
                    <p className="whitespace-pre-wrap text-foreground text-sm">{body}</p>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-xs">
                            <RelativeDate date={comment.postedAt} />
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={onStartEdit}
                                className="hover:bg-surface-hover"
                                aria-label={t("favorites.comments.edit")}
                            >
                                <EditIcon />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={onDelete}
                                className="hover:bg-surface-hover hover:text-destructive"
                                aria-label={t("favorites.comments.delete")}
                            >
                                <TrashIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
}
