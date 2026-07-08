"use client";

import { useTranslation } from "react-i18next";

import { ChangePasswordForm } from "@/modules/settings/presentation/components/forms/ChangePasswordForm";
import { SessionsList } from "@/modules/settings/presentation/components/lists/SessionsList";
import { LockIcon } from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";

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
            <SectionHeader
                as="h1"
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
