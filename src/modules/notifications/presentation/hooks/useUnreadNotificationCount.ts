"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { notificationKeys } from "@/modules/notifications/presentation/constants/notificationKeys";
import container from "@/shared/infrastructure/service.locator";

/**
 * useUnreadNotificationCount
 *
 * @description
 * Reads the caller's unread notification count. The endpoint is authenticated, so
 * the query only runs for a signed-in user; a failure resolves to zero rather than
 * surfacing, since the bell is navigation and not a critical path.
 *
 * @returns The unread count, zero while loading, signed out, or on failure.
 */
export function useUnreadNotificationCount(): number {
    const { user } = useAuth();

    const { data } = useQuery({
        enabled: user !== null,
        queryKey: notificationKeys.unreadCount,
        staleTime: 60_000,
        queryFn: async () => {
            const result = await container.cradle.getUnreadNotificationCountUseCase.execute();
            return result.ok ? result.value : 0;
        }
    });

    return data ?? 0;
}
