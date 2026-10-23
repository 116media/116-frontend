"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { Textarea } from "@/shared/presentation/components/ui/Textarea";

/**
 * Props for MyArticleCommentsModal.EditForm.
 *
 * @interface MyArticleCommentsModalEditFormProps
 * @property {string} body - The comment text the edit starts from.
 * @property {boolean} isSaving - Whether the edit mutation is in flight.
 * @property {() => void} onCancel - Leaves edit mode, discarding the draft.
 * @property {(body: string) => void} onSave - Commits the trimmed draft.
 */
export interface MyArticleCommentsModalEditFormProps {
    body: string;
    isSaving: boolean;
    onCancel: () => void;
    onSave: (body: string) => void;
}

/**
 * MyArticleCommentsModal.EditForm
 *
 * @description
 * Inline edit for one of the reader's own comments. The draft lives here, so leaving edit
 * mode discards it without the drawer having to clear anything, and an empty draft cannot
 * be submitted. The field takes the page ground rather than the row's and draws its own
 * hairline: the shared `input` border measures 1.13:1 against a light field and 1.24:1
 * against a dark one, which reads as no border at all, where this one holds 1.7:1 and
 * 2.1:1.
 *
 * @param body - The comment text the edit starts from.
 * @param isSaving - Whether the edit mutation is in flight.
 * @param onCancel - Leaves edit mode.
 * @param onSave - Commits the trimmed draft.
 */
export function MyArticleCommentsModalEditForm({
    body,
    isSaving,
    onCancel,
    onSave
}: MyArticleCommentsModalEditFormProps) {
    const { t } = useTranslation();
    const [draft, setDraft] = useState(body);

    const trimmed = draft.trim();

    return (
        <div className="flex flex-col gap-2">
            <Textarea
                value={draft}
                disabled={isSaving}
                className="border-muted-foreground/25 bg-background"
                onChange={(event) => setDraft(event.target.value)}
            />
            <div className="flex justify-end gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onCancel}
                >
                    {t("favorites.comments.cancel")}
                </Button>
                <Button
                    size="sm"
                    loading={isSaving}
                    variant="brand-outline"
                    disabled={trimmed.length === 0}
                    onClick={() => onSave(trimmed)}
                >
                    {t("favorites.comments.save")}
                </Button>
            </div>
        </div>
    );
}
