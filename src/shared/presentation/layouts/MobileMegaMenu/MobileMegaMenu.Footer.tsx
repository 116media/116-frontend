"use client";

import { LanguageDropdown } from "@/shared/presentation/components/common/LanguageDropdown";
import { ThemeToggle } from "@/shared/presentation/components/common/ThemeToggle";
import { UserAccountControl } from "@/shared/presentation/components/common/UserAccountControl";

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
        <div className="flex flex-wrap items-center justify-between gap-3 border-outlined border-t p-3">
            <div className="flex items-center gap-1">
                <ThemeToggle size="icon-lg" />
                <LanguageDropdown
                    size="lg"
                    placement="top"
                />
            </div>

            <UserAccountControl onAction={onNavigate} />
        </div>
    );
}
