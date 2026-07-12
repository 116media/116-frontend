"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AccountActionCard } from "@/modules/settings/presentation/components/cards/AccountActionCard";
import { ConfirmDialog } from "@/shared/presentation/components/ui/ConfirmDialog";
import {
    AlertCircleIcon,
    LogOutIcon,
    SettingsIcon
} from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";

/**
 * Props for AccountSection.
 *
 * @interface AccountSectionProps
 * @property {boolean} signOutPending - Whether a sign-out request is in flight.
 * @property {(all: boolean, onSuccess: () => void) => void} onSignOut - Runs the sign-out;
 * `all` targets every device.
 */
export interface AccountSectionProps {
    signOutPending: boolean;
    onSignOut: (all: boolean, onSuccess: () => void) => void;
}

/**
 * AccountSection
 *
 * @description
 * The Account tab: two cards for signing out of this device or of all devices, each
 * gated behind a confirmation dialog (sign-out-all uses stronger copy). The sign-out
 * action itself is owned by {@link AccountSectionContainer}.
 */
export function AccountSection({ signOutPending, onSignOut }: AccountSectionProps) {
    const { t } = useTranslation();
    const [signOutOpen, setSignOutOpen] = useState(false);
    const [signOutAllOpen, setSignOutAllOpen] = useState(false);

    return (
        <div>
            <SectionHeader
                as="h1"
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
                loading={signOutPending}
                title={t("auth.session.signOutConfirmTitle")}
                description={t("auth.session.signOutConfirmDescription")}
                cancelLabel={t("auth.common.cancel")}
                confirmLabel={t("settings.account.signOut.action")}
                onConfirm={() => onSignOut(false, () => setSignOutOpen(false))}
            />

            <ConfirmDialog
                destructive
                open={signOutAllOpen}
                onOpenChange={setSignOutAllOpen}
                loading={signOutPending}
                title={t("settings.account.signOutAll.confirmTitle")}
                description={t("settings.account.signOutAll.confirmDescription")}
                cancelLabel={t("auth.common.cancel")}
                confirmLabel={t("settings.account.signOutAll.action")}
                onConfirm={() => onSignOut(true, () => setSignOutAllOpen(false))}
            />
        </div>
    );
}
