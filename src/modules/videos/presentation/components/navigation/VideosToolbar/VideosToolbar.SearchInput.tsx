"use client";

import { useTranslation } from "react-i18next";
import { SearchField } from "@/shared/presentation/components/ui/SearchField";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for VideosToolbarSearchInput.
 *
 * @interface VideosToolbarSearchInputProps
 * @property {string} value - The raw search text (controlled).
 * @property {(value: string) => void} onChange - Emits the search text on every change.
 * @property {string} [className] - Sizing for the row the box sits in.
 */
export interface VideosToolbarSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

/**
 * VideosToolbarSearchInput
 *
 * @description
 * Controlled video search box that emits the raw text on every keystroke; the
 * container debounces before feeding the feed query.
 */
export function VideosToolbarSearchInput({
    value,
    onChange,
    className
}: VideosToolbarSearchInputProps) {
    const { t } = useTranslation();
    return (
        <SearchField.Root className={cn("w-full sm:max-w-xs", className)}>
            <SearchField.Icon />
            <SearchField.Input
                value={value}
                onValueChange={onChange}
                onClear={() => onChange("")}
                placeholder={t("videos.browse.filters.searchPlaceholder")}
            />
            <SearchField.Clear
                hidden={!value}
                label={t("videos.browse.filters.clearSearch")}
                onClear={() => onChange("")}
            />
        </SearchField.Root>
    );
}
