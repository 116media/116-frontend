import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * ArticleCommentNotification
 *
 * @description
 * Toast configurations for the article comments flow. Each entry is a factory taking the
 * active-locale `t` so copy stays localized and centralized.
 */
export const ArticleCommentNotification = {
    /**
     * Error toast shown when posting a comment fails. Surfacing the failure as a toast
     * (not a section swap) keeps whatever the reader typed intact in the composer.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The post-failed notification config.
     */
    postFailed: (t: TFunction): INotificationConfig => ({
        type: "error",
        title: t("articles.comments.postError.title"),
        description: t("articles.comments.postError.description")
    })
} as const;
