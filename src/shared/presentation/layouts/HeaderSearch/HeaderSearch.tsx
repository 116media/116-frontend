"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { SearchIcon } from "@/shared/presentation/components/ui/Icon";
import { SEARCH_PATH } from "@/shared/presentation/constants/paths";
import { useFilterBarPin } from "@/shared/presentation/providers/FilterBarPinProvider";
import { useSearchOverlay } from "@/shared/presentation/providers/SearchOverlayProvider";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the HeaderSearch component.
 *
 * @interface HeaderSearchProps
 * @property {string} [className] - Extra classes merged onto the search landmark.
 */
export interface HeaderSearchProps {
    className?: string;
}

/**
 * HeaderSearch
 *
 * @description
 * The mobile and tablet entry to site search. A button dressed as a field rather than a
 * real input: typing happens in the overlay, which is a bottom sheet at this width, so
 * the keyboard opens over the sheet instead of under the header. Stands down while a
 * page's filter bar is pinned on screen, so no screen shows two search boxes.
 */
export function HeaderSearch({ className }: HeaderSearchProps) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const { open, isOpen } = useSearchOverlay();
    const { isPinned, isHidden } = useFilterBarPin();

    if (isOpen) return null;
    if (pathname === SEARCH_PATH) return null;
    if (isPinned && !isHidden) return null;

    return (
        <search
            className={cn(
                "-mx-3 block border-outlined/50 border-t px-3 py-3",
                "sm:-mx-6 sm:px-6",
                "surface-pro-portrait:-mx-18 surface-pro-portrait:px-18",
                className
            )}
        >
            <button
                type="button"
                onClick={open}
                aria-label={t("search.field.label")}
                className="flex h-10 w-full items-center gap-3 rounded-md border border-surface-hover bg-surface-sunken px-4 text-left text-subtle-foreground/65 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
                <SearchIcon
                    aria-hidden="true"
                    className="size-5 shrink-0"
                />
                <span className="truncate text-base">{t("search.field.placeholder")}</span>
            </button>
        </search>
    );
}
