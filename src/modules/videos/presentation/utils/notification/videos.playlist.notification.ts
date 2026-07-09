import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * PlaylistNotification
 *
 * @description
 * Toast configurations for the add-to-playlist flow. Each entry is a factory taking the
 * active-locale `t` so copy stays localized and centralized; call sites pass these to
 * `showNotification` and never hardcode toast text.
 */
export const PlaylistNotification = {
    /**
     * Success toast shown after a new playlist is created from the modal's inline field.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The playlist-created notification config.
     */
    created: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("videos.detail.playlist.created.title")
    }),

    /**
     * Success toast shown after the video is added to every selected playlist.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The video-added notification config.
     */
    videoAdded: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("videos.detail.playlist.added.title"),
        description: t("videos.detail.playlist.added.description")
    }),

    /**
     * Error toast shown when adding the video to the selected playlists fails; the modal
     * keeps the selection so the user can retry.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The add-failed notification config.
     */
    addFailed: (t: TFunction): INotificationConfig => ({
        type: "error",
        title: t("videos.detail.playlist.error.title"),
        description: t("videos.detail.playlist.error.description")
    })
} as const;
