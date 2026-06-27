"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useLogout } from "@/modules/auth/presentation/hooks/useLogout";
import { SettingsPageHeader } from "@/modules/settings/presentation/components/SettingsPageHeader";
import { Button } from "@/shared/presentation/components/ui/Button";
import { Card } from "@/shared/presentation/components/ui/Card";
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
                <Card className="flex items-center gap-3 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg]:size-5">
                        <LogOutIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">
                            {t("settings.account.signOut.title")}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            {t("settings.account.signOut.description")}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="text-destructive"
                        onClick={() => setSignOutOpen(true)}
                    >
                        {t("settings.account.signOut.action")}
                    </Button>
                </Card>

                <Card className="flex items-center gap-3 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive [&_svg]:size-5">
                        <AlertCircleIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">
                            {t("settings.account.signOutAll.title")}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            {t("settings.account.signOutAll.description")}
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={() => setSignOutAllOpen(true)}
                    >
                        {t("settings.account.signOutAll.action")}
                    </Button>
                </Card>
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
