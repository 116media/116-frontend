"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useLogout } from "@/modules/auth/presentation/hooks/useLogout";
import { AccountActionCard } from "@/modules/settings/presentation/components/AccountActionCard";
import { SettingsPageHeader } from "@/modules/settings/presentation/components/SettingsPageHeader";
import { ConfirmDialog } from "@/shared/presentation/components/ui/ConfirmDialog";
import {
    AlertCircleIcon,
    LogOutIcon,
    SettingsIcon
} from "@/shared/presentation/components/ui/Icon";

/**
 * AccountSection
 *
 * @description
 * The Account tab: two cards for signing out of this device or of all devices. Each
 * action is gated behind a confirmation dialog; sign-out-all uses stronger copy. Both
 * are wired to `useLogout` (`{ all: true }` for the all-devices variant), which tears
 * down auth state and toasts. After success the route guard bounces the guest home.
 */
export function AccountSection() {
    const { t } = useTranslation();
    const logout = useLogout();
    const [signOutOpen, setSignOutOpen] = useState(false);
    const [signOutAllOpen, setSignOutAllOpen] = useState(false);

    return (
        <div>
            <SettingsPageHeader
                icon={<SettingsIcon />}
                title={t("settings.account.title")}
                subtitle={t("settings.account.subtitle")}
            />

            <div className="flex flex-col gap-4">
                <AccountActionCard
                    icon={<LogOutIcon />}
                    title={t("settings.account.signOut.title")}
                    description={t("settings.account.signOut.description")}
                    actionLabel={t("settings.account.signOut.action")}
                    onAction={() => setSignOutOpen(true)}
                />

                <AccountActionCard
                    danger
                    icon={<AlertCircleIcon />}
                    title={t("settings.account.signOutAll.title")}
                    description={t("settings.account.signOutAll.description")}
                    actionLabel={t("settings.account.signOutAll.action")}
                    onAction={() => setSignOutAllOpen(true)}
                />
            </div>

            <ConfirmDialog
                destructive
                open={signOutOpen}
                onOpenChange={setSignOutOpen}
                loading={logout.isPending}
                title={t("auth.session.signOutConfirmTitle")}
                description={t("auth.session.signOutConfirmDescription")}
                cancelLabel={t("auth.common.cancel")}
                confirmLabel={t("settings.account.signOut.action")}
                onConfirm={() => logout.mutate({}, { onSuccess: () => setSignOutOpen(false) })}
            />

            <ConfirmDialog
                destructive
                open={signOutAllOpen}
                onOpenChange={setSignOutAllOpen}
                loading={logout.isPending}
                title={t("settings.account.signOutAll.confirmTitle")}
                description={t("settings.account.signOutAll.confirmDescription")}
                cancelLabel={t("auth.common.cancel")}
                confirmLabel={t("settings.account.signOutAll.action")}
                onConfirm={() =>
                    logout.mutate({ all: true }, { onSuccess: () => setSignOutAllOpen(false) })
                }
            />
        </div>
    );
}
