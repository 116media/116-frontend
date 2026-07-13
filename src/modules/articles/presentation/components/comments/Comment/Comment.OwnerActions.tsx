"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { useCommentDisclosure } from "@/modules/articles/presentation/context/CommentDisclosureContext";
import { useCommentInteractions } from "@/modules/articles/presentation/context/CommentInteractionsContext";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EditIcon, TrashIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Comment.OwnerActions
 *
 * @description
 * Edit and delete controls shown only to the comment's author. Delete swaps to an inline
 * confirm in place, so a stray click never removes anything; like and reply stay visible.
 */
export function CommentOwnerActions() {
    const { t } = useTranslation();
    const { isOwn } = useCommentData();
    const { beginEdit } = useCommentDisclosure();
    const { confirmDelete, isDeletePending } = useCommentInteractions();
    const [confirming, setConfirming] = useState(false);

    if (!isOwn) return null;

    if (confirming) {
        return (
            <span className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs">
                    {t("articles.comments.deleteConfirmTitle")}
                </span>
                <Button
                    variant="destructive"
                    size="sm"
                    loading={isDeletePending}
                    disabled={isDeletePending}
                    onClick={() => {
                        confirmDelete();
                        setConfirming(false);
                    }}
                >
                    {t("articles.comments.deleteConfirm")}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={isDeletePending}
                    onClick={() => setConfirming(false)}
                >
                    {t("articles.comments.deleteCancel")}
                </Button>
            </span>
        );
    }

    return (
        <>
            <Button
                size="sm"
                type="button"
                variant="ghost"
                onClick={beginEdit}
                className="h-auto gap-1 px-1.5 py-1 font-normal text-muted-foreground text-xs hover:bg-transparent hover:text-foreground [&_svg]:size-3.5"
            >
                <EditIcon />
                {t("articles.comments.edit")}
            </Button>
            <Button
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => setConfirming(true)}
                className="h-auto gap-1 px-1.5 py-1 font-normal text-muted-foreground text-xs hover:bg-transparent hover:text-destructive [&_svg]:size-3.5"
            >
                <TrashIcon />
                {t("articles.comments.delete")}
            </Button>
        </>
    );
}
