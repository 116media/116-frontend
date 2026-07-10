import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification";

/**
 * videoLinkCopiedNotification
 *
 * @description
 * Success toast shown after the video URL is copied to the clipboard by the
 * share modal's copy-link button. Copy is resolved from the videos i18n
 * catalog so it stays localized and centralized.
 *
 * @param t - The i18next translation function bound to the active locale.
 * @returns The notification config passed to {@link showNotification}.
 */
export function videoLinkCopiedNotification(t: TFunction): INotificationConfig {
    return {
        type: "success",
        title: t("videos.detail.shareModal.copied.title"),
        description: t("videos.detail.shareModal.copied.description")
    };
}
