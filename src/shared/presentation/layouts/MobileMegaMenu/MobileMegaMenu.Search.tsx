"use client";

import { useTranslation } from "react-i18next";

import { SearchField } from "@/shared/presentation/components/ui/SearchField";
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
        <SearchField.Trigger
            size="lg"
            label={t("search.field.label")}
            placeholder={t("search.field.placeholder")}
            onOpen={() => {
                onOpen();
                open();
            }}
        />
    );
}
