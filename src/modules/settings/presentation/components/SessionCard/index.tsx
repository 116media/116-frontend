"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { ISession } from "@/modules/auth/domain/entities/ISession";
import { useRevokeSession } from "@/modules/session/presentation/hooks/useRevokeSession";
import { SettingsNotification } from "@/modules/settings/presentation/notifications/settings.notification";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ConfirmDialog } from "@/shared/presentation/components/ui/ConfirmDialog";
import {
    CarIcon,
    ClockIcon,
    CpuIcon,
    HelpCircleIcon,
    MonitorIcon,
    SmartphoneIcon,
    TabletIcon
} from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { showNotification } from "@/shared/presentation/utils/notification";

/**
 * Maps a resolved device label to its icon; unknown devices fall back to a help icon.
 */
const DEVICE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
    desktop: MonitorIcon,
    tv: MonitorIcon,
    console: MonitorIcon,
    mobile: SmartphoneIcon,
    tablet: TabletIcon,
    watch: ClockIcon,
    car: CarIcon,
    iot: CpuIcon
};

/**
 * Props for the SessionCard component.
 *
 * @interface SessionCardProps
 * @property {ISession} session - The session to render.
 */
export interface SessionCardProps {
    session: ISession;
}

/**
 * SessionCard
 *
 * @description
 * One row in the active-sessions list: a device icon, the device/browser/platform
 * summary, the origin IP and relative creation time, and a trailing action. The
 * current session shows a "this device" tag (no revoke); other active sessions offer a
 * destructive revoke gated behind a confirmation; expired sessions show an "expired"
 * tag. Revoking calls `useRevokeSession`, which refreshes the list, then toasts.
 *
 * @param session - The session to render.
 */
export function SessionCard({ session }: SessionCardProps) {
    const { t } = useTranslation();
    const revoke = useRevokeSession();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const DeviceIcon = DEVICE_ICONS[session.device.toLowerCase()] ?? HelpCircleIcon;
    const summary = [session.device, session.browser, session.platform].filter(Boolean).join(" · ");

    const onConfirm = () => {
        revoke.mutate(session.id, {
            onSuccess: () => {
                showNotification(SettingsNotification.sessionRevoked());
                setConfirmOpen(false);
            }
        });
    };

    return (
        <>
            <div className="flex items-center gap-3 rounded-md border p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-5">
                    <DeviceIcon />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-foreground text-sm">{summary}</p>
                        {session.isCurrent && (
                            <Tag variant="primary">{t("settings.security.sessions.current")}</Tag>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-xs">
                        <span className="truncate">
                            IP: {session.ipAddress ?? t("settings.security.sessions.unknownIp")}
                        </span>
                        {session.createdAt && (
                            <span className="inline-flex items-center gap-1">
                                <ClockIcon className="size-3" />
                                <RelativeDate date={session.createdAt} />
                            </span>
                        )}
                    </div>
                </div>
                {session.isActive ? (
                    <Button
                        size="sm"
                        variant="destructive"
                        loading={revoke.isPending}
                        onClick={() => setConfirmOpen(true)}
                    >
                        {t("settings.security.sessions.revoke")}
                    </Button>
                ) : (
                    <Tag variant="outline">{t("settings.security.sessions.expired")}</Tag>
                )}
            </div>

            <ConfirmDialog
                destructive
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                loading={revoke.isPending}
                title={t("settings.security.sessions.revokeTitle")}
                description={t("settings.security.sessions.revokeDescription")}
                cancelLabel={t("auth.common.cancel")}
                confirmLabel={t("settings.security.sessions.revoke")}
                onConfirm={onConfirm}
            />
        </>
    );
}
