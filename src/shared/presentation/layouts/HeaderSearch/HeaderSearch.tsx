"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { SearchField } from "@/shared/presentation/components/ui/SearchField";
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
            <SearchField.Trigger
                onOpen={open}
                label={t("search.field.label")}
                placeholder={t("search.field.placeholder")}
            />
        </search>
    );
}
