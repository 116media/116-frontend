"use client";

import { useUnreadNotificationCount } from "@/modules/notifications/presentation/hooks/useUnreadNotificationCount";
import { NotificationBell } from "@/shared/presentation/components/common/NotificationBell";

/**
 * NotificationBellContainer
 *
 * @description
 * Binds the unread-count query to the presentational bell. Signed-out callers get
 * the bell with no badge, since the endpoint is authenticated.
 */
export function NotificationBellContainer() {
    const unreadCount = useUnreadNotificationCount();

    return <NotificationBell unreadCount={unreadCount} />;
}
