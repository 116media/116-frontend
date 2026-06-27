import { i18n } from "@/shared/presentation/i18n/config";
import type { INotificationConfig } from "@/shared/presentation/utils/notification";

/**
 * SettingsNotification
 *
 * @description
 * Toast configurations for settings lifecycle events. Each entry is a factory so the
 * copy is resolved from the settings i18n catalog against the active language at call
 * time (not frozen at import). Call sites pass these to `showNotification` — they never
 * hardcode toast text.
 */
export const SettingsNotification = {
    /**
     * Success toast shown after the avatar is updated.
     *
     * @returns The avatar-updated notification config.
     */
    avatarUpdated: (): INotificationConfig => ({
        type: "success",
        title: i18n.t("settings.notification.avatarUpdatedTitle"),
        description: i18n.t("settings.notification.avatarUpdatedDescription")
    }),

    /**
     * Success toast shown after the profile is updated.
     *
     * @returns The profile-updated notification config.
     */
    profileUpdated: (): INotificationConfig => ({
        type: "success",
        title: i18n.t("settings.notification.profileUpdatedTitle"),
        description: i18n.t("settings.notification.profileUpdatedDescription")
    }),

    /**
     * Success toast shown after the password is changed.
     *
     * @returns The password-changed notification config.
     */
    passwordChanged: (): INotificationConfig => ({
        type: "success",
        title: i18n.t("settings.notification.passwordChangedTitle"),
        description: i18n.t("settings.notification.passwordChangedDescription")
    }),

    /**
     * Success toast shown after a session is revoked.
     *
     * @returns The session-revoked notification config.
     */
    sessionRevoked: (): INotificationConfig => ({
        type: "success",
        title: i18n.t("settings.notification.sessionRevokedTitle"),
        description: i18n.t("settings.notification.sessionRevokedDescription")
    })
} as const;
