import { i18n } from "@/shared/presentation/i18n/config";
import type { INotificationConfig } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * AuthNotification
 *
 * @description
 * Toast configurations for auth lifecycle events. Each entry is a factory so
 * copy resolves against the active language at call time. Call sites pass
 * these to `showNotification` — they never hardcode toast text.
 */
export const AuthNotification = {
    /**
     * Success toast shown after the user signs out.
     *
     * @returns The sign-out success notification config.
     */
    signOutSuccess: (): INotificationConfig => ({
        type: "success",
        title: i18n.t("auth.notification.signOutTitle"),
        description: i18n.t("auth.notification.signOutDescription")
    })
} as const;
