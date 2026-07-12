"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import type { UserAccountControlSlotProps } from "./types";

/**
 * UserAccountControlSlot
 *
 * @description
 * Reserved footprint for the auth control. An invisible "Log in" button holds the
 * button's width so the header never reflows as the auth state resolves; the active
 * state renders right-aligned on top.
 */
export function UserAccountControlSlot({ className, children }: UserAccountControlSlotProps) {
    const { t } = useTranslation();

    return (
        <div className={cn("relative flex items-center justify-end", className)}>
            <Button
                aria-hidden
                tabIndex={-1}
                variant="outline"
                className="invisible text-sm font-medium"
            >
                {t("navigation.login")}
            </Button>
            <div className="absolute inset-0 flex items-center justify-end">{children}</div>
        </div>
    );
}
