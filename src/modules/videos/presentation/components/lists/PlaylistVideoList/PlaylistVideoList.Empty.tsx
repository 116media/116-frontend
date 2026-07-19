"use client";

import { useTranslation } from "react-i18next";

import { ListVideoIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * PlaylistVideoListEmpty
 *
 * @description
 * Empty state for {@link PlaylistVideoList}, shown when a playlist has no videos yet.
 */
export function PlaylistVideoListEmpty() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <ListVideoIcon className="size-10" />
            <p className="text-sm">{t("favorites.playlist.emptyVideos")}</p>
        </div>
    );
}
