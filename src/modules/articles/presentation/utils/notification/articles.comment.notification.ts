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
    }),

    /**
     * Error toast shown when posting a reply fails; the reply composer's text stays put.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The reply-failed notification config.
     */
    replyFailed: (t: TFunction): INotificationConfig => ({
        type: "error",
        title: t("articles.comments.replyError.title"),
        description: t("articles.comments.replyError.description")
    }),

    /**
     * Error toast shown when saving an edited comment fails; the edit form's text stays put.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The edit-failed notification config.
     */
    editFailed: (t: TFunction): INotificationConfig => ({
        type: "error",
        title: t("articles.comments.editError.title"),
        description: t("articles.comments.editError.description")
    }),

    /**
     * Error toast shown when deleting a comment fails; the row keeps its content.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The delete-failed notification config.
     */
    deleteFailed: (t: TFunction): INotificationConfig => ({
        type: "error",
        title: t("articles.comments.deleteError.title"),
        description: t("articles.comments.deleteError.description")
    })
} as const;
