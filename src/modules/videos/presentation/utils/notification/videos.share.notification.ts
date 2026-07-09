import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * VideoShareNotification
 *
 * @description
 * Toast configurations for the video share surface. Each entry is a factory taking the
 * active-locale `t` so copy stays localized and centralized.
 */
export const VideoShareNotification = {
    /**
     * Success toast shown after the video URL is copied by the share modal's copy button.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The link-copied notification config.
     */
    linkCopied: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("videos.detail.shareModal.copied.title"),
        description: t("videos.detail.shareModal.copied.description")
    })
} as const;
