"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { BellIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the NotificationBell component.
 *
 * @interface NotificationBellProps
 * @property {number} [unreadCount] - Unread notifications; the badge is hidden at zero.
 * @property {string} [className] - Extra classes merged onto the trigger.
 */
export interface NotificationBellProps {
    unreadCount?: number;
    className?: string;
}

/**
 * NotificationBell
 *
 * @description
 * The notifications entry point: a bell carrying the unread count as a corner badge.
 * Counts above 9 render as "9+" so the badge keeps its circular footprint.
 */
export function NotificationBell({ unreadCount = 0, className }: NotificationBellProps) {
    const { t } = useTranslation();
    const hasUnread = unreadCount > 0;

    return (
        <Button
            size="icon-sm"
            type="button"
            variant="ghost"
            className={cn(
                "relative size-10 text-muted-foreground hover:text-foreground [&_svg]:size-5 surface-pro-portrait:size-11.25 surface-pro-portrait:[&_svg]:size-5.5 lg:size-9 lg:[&_svg]:size-4",
                className
            )}
            aria-label={t("navigation.notifications", { count: unreadCount })}
        >
            <BellIcon />

            {hasUnread && (
                <span className="-right-0.5 -top-0.5 absolute flex size-4 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground tabular-nums dark:bg-secondary dark:text-secondary-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
        </Button>
    );
}
