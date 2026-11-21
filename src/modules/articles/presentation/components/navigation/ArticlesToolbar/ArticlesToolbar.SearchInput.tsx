"use client";

import { useTranslation } from "react-i18next";
import { SearchField } from "@/shared/presentation/components/ui/SearchField";

/**
 * Props for ArticlesToolbarSearchInput.
 *
 * @interface ArticlesToolbarSearchInputProps
 * @property {string} value - The raw search text (controlled).
 * @property {(value: string) => void} onChange - Emits the search text on every change.
 */
export interface ArticlesToolbarSearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

/**
 * ArticlesToolbarSearchInput
 *
 * @description
 * Controlled article search box that emits the raw text on every keystroke; the container
 * debounces before feeding the feed query.
 */
export function ArticlesToolbarSearchInput({ value, onChange }: ArticlesToolbarSearchInputProps) {
    const { t } = useTranslation();
    return (
        <SearchField.Root className="w-full sm:max-w-xs">
            <SearchField.Icon />
            <SearchField.Input
                value={value}
                onValueChange={onChange}
                onClear={() => onChange("")}
                placeholder={t("articles.filters.searchPlaceholder")}
            />
            <SearchField.Clear
                hidden={!value}
                label={t("articles.filters.clearSearch")}
                onClear={() => onChange("")}
            />
        </SearchField.Root>
    );
}
