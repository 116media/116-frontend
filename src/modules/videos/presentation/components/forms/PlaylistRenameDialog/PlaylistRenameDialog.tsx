"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
    type PlaylistRenameFormValues,
    playlistRenameSchema
} from "@/modules/videos/presentation/validation/playlist.schema";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FloatingField } from "@/shared/presentation/components/ui/FloatingField";
import { ModalForm } from "@/shared/presentation/components/ui/ModalForm";

/**
 * Props for PlaylistRenameDialog.
 *
 * @interface PlaylistRenameDialogProps
 * @property {boolean} open - Whether the dialog is open (controlled).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/cancel).
 * @property {string} initialName - The playlist's current name, seeding the field on open.
 * @property {boolean} loading - Whether the rename mutation is in flight.
 * @property {(name: string) => void} onSubmit - Submits the validated, trimmed new name.
 */
export interface PlaylistRenameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialName: string;
    loading: boolean;
    onSubmit: (name: string) => void;
}

/**
 * PlaylistRenameDialog
 *
 * @description
 * Single-field rename dialog built on the shared `ModalForm` chrome (header, body,
 * footer) and validated by `playlistRenameSchema` through react-hook-form. Re-seeds
 * from `initialName` on each open and submits the trimmed value.
 */
export function PlaylistRenameDialog({
    open,
    onOpenChange,
    initialName,
    loading,
    onSubmit
}: PlaylistRenameDialogProps) {
    const { t } = useTranslation();

    const form = useForm<PlaylistRenameFormValues>({
        resolver: zodResolver(playlistRenameSchema),
        defaultValues: { name: initialName }
    });

    useEffect(() => {
        if (open) form.reset({ name: initialName });
    }, [open, initialName, form]);

    const submit = form.handleSubmit(({ name }) => onSubmit(name.trim()));

    return (
        <ModalForm
            open={open}
            onSubmit={submit}
            onOpenChange={onOpenChange}
            header={t("favorites.playlist.renameTitle")}
            subtitle={t("favorites.playlist.renameSubtitle")}
            footer={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={loading}
                        onClick={() => onOpenChange(false)}
                    >
                        {t("favorites.playlist.cancel")}
                    </Button>
                    <Button
                        type="submit"
                        loading={loading}
                    >
                        {t("favorites.playlist.save")}
                    </Button>
                </>
            }
        >
            <FloatingField
                autoFocus
                id="playlist-name"
                label={t("favorites.playlist.nameLabel")}
                error={form.formState.errors.name?.message}
                {...form.register("name")}
            />
        </ModalForm>
    );
}
