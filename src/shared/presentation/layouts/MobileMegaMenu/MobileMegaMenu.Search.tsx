"use client";

import { useTranslation } from "react-i18next";

import { SearchIcon } from "@/shared/presentation/components/ui/Icon";
import { useSearchOverlay } from "@/shared/presentation/providers/SearchOverlayProvider";

/**
 * Props for the MobileMegaMenu.Search component.
 *
 * @interface MobileMegaMenuSearchProps
 * @property {() => void} onOpen - Closes the menu, so the overlay is not stacked on it.
 */
export interface MobileMegaMenuSearchProps {
    onOpen: () => void;
}

/**
 * MobileMegaMenu.Search
 *
 * @description
 * The menu's entry to site search. Dismisses the menu before raising the overlay, so
 * the reader is never looking at two stacked sheets.
 */
export function MobileMegaMenuSearch({ onOpen }: MobileMegaMenuSearchProps) {
    const { t } = useTranslation();
    const { open } = useSearchOverlay();

    return (
        <button
            type="button"
            onClick={() => {
                onOpen();
                open();
            }}
            className="flex h-11 w-full items-center gap-3 rounded-lg bg-muted px-4 text-left text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
            <SearchIcon
                aria-hidden="true"
                className="size-5 shrink-0"
            />
            <span className="truncate text-base">{t("search.field.placeholder")}</span>
        </button>
    );
}
