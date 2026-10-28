"use client";

import { LanguageDropdown } from "@/shared/presentation/components/common/LanguageDropdown";
import { ThemeToggle } from "@/shared/presentation/components/common/ThemeToggle";
import { UserAccountControl } from "@/shared/presentation/components/common/UserAccountControl";
import { PAGE_GUTTER } from "@/shared/presentation/constants/layout";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import type { MobileMegaMenuFooterProps } from "./types";

/**
 * MobileMegaMenu.Footer
 *
 * @description
 * Pinned bottom row: the auth control on the left, theme and language on the right.
 * The same three components the header renders above `md`, at touch size.
 */
export function MobileMegaMenuFooter({ onNavigate }: MobileMegaMenuFooterProps) {
    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-between gap-3 border-outlined border-t py-3",
                PAGE_GUTTER
            )}
        >
            <div className="flex items-center gap-1">
                <ThemeToggle size="icon-lg" />
                <LanguageDropdown.Root
                    size="lg"
                    placement="top"
                />
            </div>

            <UserAccountControl.Root onAction={onNavigate} />
        </div>
    );
}
