"use client";

import { useTranslation } from "react-i18next";

import { useSessions } from "@/modules/session/presentation/hooks/useSessions";
import { SessionCard } from "@/modules/settings/presentation/components/SessionCard";
import { SettingsCard } from "@/modules/settings/presentation/components/SettingsCard";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { Tag } from "@/shared/presentation/components/ui/Tag";

/**
 * SessionsListSkeleton
 *
 * @description
 * Placeholder rows shown while the sessions query resolves, built from the shared
 * Skeleton primitive.
 */
function SessionsListSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            {[0, 1].map((row) => (
                <div
                    key={row}
                    className="flex items-center gap-3 rounded-md border p-3"
                >
                    <Skeleton className="size-10 shrink-0 rounded-md" />
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-2 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

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
            {isLoading && <SessionsListSkeleton />}
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
