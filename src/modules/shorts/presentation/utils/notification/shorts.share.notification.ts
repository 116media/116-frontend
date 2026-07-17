import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * ShortShareNotification
 *
 * @description
 * Toast configurations for the short share surface. Only the clipboard copy
 * surfaces a toast; other channels are silent. Each entry is a factory taking the
 * active-locale `t` so copy stays localized and centralized.
 */
export const ShortShareNotification = {
    /**
     * Success toast shown when the short's link is copied to the clipboard.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns {INotificationConfig} The copied-link notification config.
     */
    linkCopied: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("shorts.share.copied.title"),
        description: t("shorts.share.copied.description")
    })
} as const;
