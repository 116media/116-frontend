"use client";

import { useTranslation } from "react-i18next";

import { ChangePasswordForm } from "@/modules/settings/presentation/components/ChangePasswordForm";
import { SessionsList } from "@/modules/settings/presentation/components/SessionsList";
import { SettingsPageHeader } from "@/modules/settings/presentation/components/SettingsPageHeader";
import { LockIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * SecuritySection
 *
 * @description
 * The Security tab: the change-password form followed by the active-sessions list,
 * under a shared page header. Mirrors the dashboard's security settings, without the
 * roles-and-permissions block.
 */
export function SecuritySection() {
    const { t } = useTranslation();

    return (
        <div>
            <SettingsPageHeader
                icon={<LockIcon />}
                title={t("settings.security.title")}
                subtitle={t("settings.security.subtitle")}
            />

            <div className="flex flex-col gap-6">
                <ChangePasswordForm />
                <SessionsList />
            </div>
        </div>
    );
}
