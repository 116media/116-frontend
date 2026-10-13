"use client";

import { useTranslation } from "react-i18next";

import { FavoriteCard } from "@/shared/presentation/components/common/FavoriteCard";
import { Button } from "@/shared/presentation/components/ui/Button";
import { TrashIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for playlist-card actions.
 *
 * @property {() => void} onOpen - Opens the playlist.
 * @property {() => void} onRename - Starts the rename flow.
 * @property {() => void} onDelete - Starts the delete flow.
 */
export interface PlaylistCardActionsProps {
    onOpen: () => void;
    onRename: () => void;
    onDelete: () => void;
}

/**
 * Bottom-anchored open, rename, and delete controls for a playlist card.
 */
export function PlaylistCardActions({ onOpen, onRename, onDelete }: PlaylistCardActionsProps) {
    const { t } = useTranslation();

    return (
        <FavoriteCard.Actions className="-mx-3 -mb-3 mt-auto flex items-center justify-start gap-1 rounded-lg border-0 bg-accent/50 p-3 transition-colors group-hover:bg-accent">
            <Button
                size="sm"
                onClick={onOpen}
                variant="brand-outline"
                className="self-center"
            >
                {t("favorites.playlist.open")}
            </Button>
            <Button
                size="sm"
                onClick={onRename}
                variant="brand-outline"
                className="self-center"
            >
                {t("favorites.playlist.rename")}
            </Button>
            <Button
                size="icon"
                variant="outline"
                onClick={onDelete}
                aria-label={t("favorites.playlist.delete")}
                className="ml-auto self-center p-0 text-muted-foreground hover:border-destructive/12 hover:bg-destructive/25 hover:text-destructive"
            >
                <TrashIcon />
            </Button>
        </FavoriteCard.Actions>
    );
}
