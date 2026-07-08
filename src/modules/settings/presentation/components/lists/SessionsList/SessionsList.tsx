"use client";

import { useTranslation } from "react-i18next";

import { useSessions } from "@/modules/session/presentation/hooks/useSessions";
import { SessionCard } from "@/modules/settings/presentation/components/cards/SessionCard";
import { SettingsCard } from "@/modules/settings/presentation/components/cards/SettingsCard";
import { Tag } from "@/shared/presentation/components/ui/Tag";

import { SessionsListLoading } from "./SessionsList.Loading";

/**
 * SessionsList
 *
 * @description
 * The Security tab's active-sessions block: a `SettingsCard` with a session-count tag,
 * listing one {@link SessionCard} per session. Shows a skeleton while loading and an
 * empty line when there are no sessions.
 */
export function SessionsList() {
    const { t } = useTranslation();
    const { data: sessions, isLoading } = useSessions();
    const count = sessions?.length ?? 0;

    return (
        <SettingsCard
            title={t("settings.security.sessions.title")}
            subtitle={t("settings.security.sessions.subtitle")}
            extra={
                count > 0 ? (
                    <Tag variant="primary">{t("settings.security.sessions.count", { count })}</Tag>
                ) : undefined
            }
        >
            {isLoading && <SessionsListLoading />}
            {!isLoading && count === 0 && (
                <p className="text-muted-foreground text-sm">
                    {t("settings.security.sessions.empty")}
                </p>
            )}
            {!isLoading && count > 0 && (
                <div className="flex flex-col gap-3">
                    {sessions?.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                        />
                    ))}
                </div>
            )}
        </SettingsCard>
    );
}
