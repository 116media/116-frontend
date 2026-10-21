"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import type { UserAccountControlSlotProps } from "./types";

/**
 * UserAccountControlSlot
 *
 * @description
 * Reserved footprint for the auth control, matching the guest button at each width:
 * a square icon on mobile and tablet, the labelled button from `lg` up. The invisible
 * placeholder holds that width so the header never reflows as the auth state
 * resolves; the active state renders right-aligned on top.
 */
export function UserAccountControlSlot({ className, children }: UserAccountControlSlotProps) {
    const { t } = useTranslation();

    return (
        <div className={cn("relative flex items-center justify-end", className)}>
            <Button
                aria-hidden
                tabIndex={-1}
                variant="outline"
                className="invisible size-10 p-0 font-medium text-sm [&_svg]:size-5 lg:size-auto lg:px-4 lg:py-2 lg:[&_svg]:size-4"
            >
                <span className="hidden lg:inline">{t("navigation.login")}</span>
            </Button>
            <div className="absolute inset-0 flex items-center justify-end">{children}</div>
        </div>
    );
}
