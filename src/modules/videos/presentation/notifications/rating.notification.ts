import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification";

/**
 * ratingSuccessNotification
 *
 * @description
 * Success toast shown after the user's star rating is saved. Copy is resolved
 * from the videos i18n catalog so it stays localized and centralized.
 *
 * @param t - The i18next translation function bound to the active locale.
 * @returns The notification config passed to {@link showNotification}.
 */
export function ratingSuccessNotification(t: TFunction): INotificationConfig {
    return {
        type: "success",
        title: t("videos.detail.rating.success.title"),
        description: t("videos.detail.rating.success.description")
    };
}

/**
 * ratingFailedNotification
 *
 * @description
 * Error toast shown when submitting a star rating fails. Copy is resolved from
 * the videos i18n catalog so it stays localized and centralized.
 *
 * @param t - The i18next translation function bound to the active locale.
 * @returns The notification config passed to {@link showNotification}.
 */
export function ratingFailedNotification(t: TFunction): INotificationConfig {
    return {
        type: "error",
        title: t("videos.detail.rating.error.title"),
        description: t("videos.detail.rating.error.description")
    };
}
