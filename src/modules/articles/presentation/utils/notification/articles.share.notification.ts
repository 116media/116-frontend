import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * ArticleShareNotification
 *
 * @description
 * Toast configurations for the article share surface. Each entry is a factory taking the
 * active-locale `t` so copy stays localized and centralized.
 */
export const ArticleShareNotification = {
    /**
     * Success toast shown after the article URL is copied by the share rail's copy button.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The link-copied notification config.
     */
    linkCopied: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("articles.share.copied.title"),
        description: t("articles.share.copied.description")
    })
} as const;
