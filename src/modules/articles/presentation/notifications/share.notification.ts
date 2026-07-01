import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification";

/**
 * shareLinkCopiedNotification
 *
 * @description
 * Success toast shown after the article URL is copied to the clipboard by the share rail's
 * copy-link button. Copy is resolved from the articles i18n catalog so it stays localized
 * and centralized.
 *
 * @param t - The i18next translation function bound to the active locale.
 * @returns The notification config passed to {@link showNotification}.
 */
export function shareLinkCopiedNotification(t: TFunction): INotificationConfig {
    return {
        type: "success",
        title: t("articles.share.copied.title"),
        description: t("articles.share.copied.description")
    };
}
