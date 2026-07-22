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
    }),

    /**
     * Success toast shown after a playlist is renamed from the favorites view.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The playlist-renamed notification config.
     */
    renamed: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("videos.favorites.playlist.renamed.title")
    }),

    /**
     * Error toast shown when renaming a playlist fails.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The rename-failed notification config.
     */
    renameFailed: (t: TFunction): INotificationConfig => ({
        type: "error",
        title: t("videos.favorites.playlist.renameError.title")
    }),

    /**
     * Success toast shown after a playlist is deleted from the favorites view.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The playlist-deleted notification config.
     */
    deleted: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("videos.favorites.playlist.deleted.title")
    }),

    /**
     * Error toast shown when deleting a playlist fails.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The delete-failed notification config.
     */
    deleteFailed: (t: TFunction): INotificationConfig => ({
        type: "error",
        title: t("videos.favorites.playlist.deleteError.title")
    }),

    /**
     * Success toast shown after a video is removed from a playlist.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The video-removed notification config.
     */
    videoRemoved: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("videos.favorites.playlist.videoRemoved.title")
    }),

    /**
     * Error toast shown when removing a video from a playlist fails.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The remove-failed notification config.
     */
    removeFailed: (t: TFunction): INotificationConfig => ({
        type: "error",
        title: t("videos.favorites.playlist.removeError.title")
    })
} as const;
