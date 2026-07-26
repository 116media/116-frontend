"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { ChevronLeftIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for PlaylistDetailHeader.
 *
 * @interface PlaylistDetailHeaderProps
 * @property {string} name - The playlist name shown as the heading.
 * @property {() => void} onBack - Returns to the playlists grid.
 * @property {() => void} onRename - Starts the rename flow.
 * @property {() => void} onDelete - Starts the delete-confirm flow.
 */
export interface PlaylistDetailHeaderProps {
    name: string;
    onBack: () => void;
    onRename: () => void;
    onDelete: () => void;
}

/**
 * PlaylistDetailHeader
 *
 * @description
 * The playlist-detail header row: a back button, the playlist name, and the rename/delete
 * actions. The parent owns navigation and the mutations behind these triggers.
 */
export function PlaylistDetailHeader({
    name,
    onBack,
    onRename,
    onDelete
}: PlaylistDetailHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label={t("favorites.playlist.back")}
                    onClick={onBack}
                >
                    <ChevronLeftIcon />
                </Button>
                <h2 className="font-bold text-foreground text-xl">{name}</h2>
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onRename}
                >
                    {t("favorites.playlist.rename")}
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={onDelete}
                >
                    {t("favorites.playlist.delete")}
                </Button>
            </div>
        </div>
    );
}
