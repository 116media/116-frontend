"use client";

import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import type { ISessionEntity } from "@/modules/session/domain/entities/ISessionEntity";
import { useRevokeSession } from "@/modules/session/presentation/hooks/useRevokeSession";
import { DEVICE_ICONS } from "@/modules/settings/presentation/constants/deviceIcons";
import { SettingsNotification } from "@/modules/settings/presentation/utils/notification/settings.notification";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ConfirmDialog } from "@/shared/presentation/components/ui/ConfirmDialog";
import { CircleHelpIcon, ClockIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * Props for the SessionCard component.
 *
 * @interface SessionCardProps
 * @property {ISessionEntity} session - The session to render.
 */
export interface SessionCardProps {
    session: ISessionEntity;
}

/**
 * SessionCard
 *
 * @description
 * One row in the active-sessions list. Up to `lg` it is shaped like a phone's device list,
 * carrying no surface and marking the caller's own session inline; from `lg` it is the
 * bordered field it has always been, with the tag and the filled revoke button. Revoking is
 * confirmation-gated via `useRevokeSession`; expired sessions show an "expired" tag.
 */
export function SessionCard({ session }: SessionCardProps) {
    const { t } = useTranslation();
    const revoke = useRevokeSession();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const DeviceIcon = DEVICE_ICONS[session.device.toLowerCase()] ?? CircleHelpIcon;
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
        <Fragment>
            <div className="flex items-center gap-3 py-3 lg:rounded-md lg:border lg:p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground lg:size-12 [&_svg]:size-5">
                    <DeviceIcon />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-foreground text-sm">{summary}</p>
                        {session.isCurrent && (
                            <Tag
                                variant="primary"
                                className="hidden lg:inline-flex"
                            >
                                {t("settings.security.sessions.current")}
                            </Tag>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground text-xs lg:gap-3">
                        <span className="truncate">
                            {session.isCurrent && (
                                <span className="font-medium text-primary lg:hidden dark:text-secondary">
                                    {t("settings.security.sessions.current")} ·{" "}
                                </span>
                            )}
                            <span className="hidden lg:inline">IP: </span>
                            {session.ipAddress ?? t("settings.security.sessions.unknownIp")}
                        </span>
                        {session.createdAt && (
                            <span className="inline-flex shrink-0 items-center gap-1">
                                <span className="lg:hidden">·</span>
                                <ClockIcon className="hidden size-3 lg:block" />
                                <RelativeDate date={session.createdAt} />
                            </span>
                        )}
                    </div>
                </div>

                {session.isActive ? (
                    <Button
                        size="sm"
                        variant="ghost"
                        loading={revoke.isPending}
                        onClick={() => setConfirmOpen(true)}
                        className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive lg:bg-destructive lg:text-destructive-foreground lg:hover:bg-destructive/90 lg:hover:text-destructive-foreground"
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
        </Fragment>
    );
}
