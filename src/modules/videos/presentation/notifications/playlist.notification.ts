import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification";

/**
 * playlistCreatedNotification
 *
 * @description
 * Success toast shown after a new playlist is created from the add-to-playlist
 * modal's inline create field. Copy is resolved from the videos i18n catalog
 * so it stays localized and centralized.
 *
 * @param t - The i18next translation function bound to the active locale.
 * @returns The notification config passed to {@link showNotification}.
 */
export function playlistCreatedNotification(t: TFunction): INotificationConfig {
    return {
        type: "success",
        title: t("videos.detail.playlist.created.title")
    };
}

/**
 * playlistVideoAddedNotification
 *
 * @description
 * Success toast shown after the video is added to every selected playlist.
 * Copy is resolved from the videos i18n catalog so it stays localized and
 * centralized.
 *
 * @param t - The i18next translation function bound to the active locale.
 * @returns The notification config passed to {@link showNotification}.
 */
export function playlistVideoAddedNotification(t: TFunction): INotificationConfig {
    return {
        type: "success",
        title: t("videos.detail.playlist.added.title"),
        description: t("videos.detail.playlist.added.description")
    };
}

/**
 * playlistAddFailedNotification
 *
 * @description
 * Error toast shown when adding the video to the selected playlists fails.
 * The modal keeps the selection so the user can retry. Copy is resolved from
 * the videos i18n catalog so it stays localized and centralized.
 *
 * @param t - The i18next translation function bound to the active locale.
 * @returns The notification config passed to {@link showNotification}.
 */
export function playlistAddFailedNotification(t: TFunction): INotificationConfig {
    return {
        type: "error",
        title: t("videos.detail.playlist.error.title"),
        description: t("videos.detail.playlist.error.description")
    };
}
