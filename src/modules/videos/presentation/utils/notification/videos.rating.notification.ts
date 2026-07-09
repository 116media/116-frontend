import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * RatingNotification
 *
 * @description
 * Toast configurations for the star-rating flow. Each entry is a factory taking the
 * active-locale `t` so copy stays localized and centralized.
 */
export const RatingNotification = {
    /**
     * Success toast shown after the user's star rating is saved.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The rating-saved notification config.
     */
    success: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("videos.detail.rating.success.title"),
        description: t("videos.detail.rating.success.description")
    }),

    /**
     * Error toast shown when submitting a star rating fails.
     *
     * @param t - The i18next translation function bound to the active locale.
     * @returns The rating-failed notification config.
     */
    failed: (t: TFunction): INotificationConfig => ({
        type: "error",
        title: t("videos.detail.rating.error.title"),
        description: t("videos.detail.rating.error.description")
    })
} as const;
