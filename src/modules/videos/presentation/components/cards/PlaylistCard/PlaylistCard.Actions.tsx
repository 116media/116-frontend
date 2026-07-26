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
        <FavoriteCard.Actions className="mt-auto flex items-baseline justify-start gap-1 border-border border-t dark:border-foreground/10">
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
                size="sm"
                variant="outline"
                onClick={onDelete}
                aria-label={t("favorites.playlist.delete")}
                className="ml-auto size-8 self-center p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
                <TrashIcon />
            </Button>
        </FavoriteCard.Actions>
    );
}
