import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification";

/**
 * commentPostFailedNotification
 *
 * @description
 * Error toast shown when posting a comment fails. Surfacing the failure as a toast (not a
 * section swap) keeps whatever the reader typed intact in the composer. Copy is resolved
 * from the articles i18n catalog so it stays localized and centralized.
 *
 * @param t - The i18next translation function bound to the active locale.
 * @returns The notification config passed to {@link showNotification}.
 */
export function commentPostFailedNotification(t: TFunction): INotificationConfig {
    return {
        type: "error",
        title: t("articles.comments.postError.title"),
        description: t("articles.comments.postError.description")
    };
}
