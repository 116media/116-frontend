import { i18n } from "@/shared/presentation/i18n/config";
import type { INotificationConfig } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * NewsletterNotification
 *
 * @description
 * Toast configurations for newsletter events. Each entry is a factory so copy
 * resolves against the active language at call time.
 */
export const NewsletterNotification = {
    /**
     * Success toast shown once the confirmation mail has been dispatched.
     *
     * @returns The subscription success notification config.
     */
    subscribed: (): INotificationConfig => ({
        type: "success",
        title: i18n.t("newsletter.notification.subscribedTitle"),
        description: i18n.t("newsletter.notification.subscribedDescription")
    })
} as const;
