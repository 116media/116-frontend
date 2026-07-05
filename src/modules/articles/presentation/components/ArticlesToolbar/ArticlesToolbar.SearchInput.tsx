"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { SearchIcon, XIcon } from "@/shared/presentation/components/ui/Icon";
import { Input } from "@/shared/presentation/components/ui/Input";

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
 * The article search box: the shared Input with a leading search icon and a trailing
 * clear button when non-empty. Controlled and instant — it emits the raw text on every
 * keystroke; the container debounces before feeding the feed query, so paging refires
 * once the user pauses rather than on every keypress.
 *
 * @param value - The raw search text.
 * @param onChange - Emits the search text.
 */
export function ArticlesToolbarSearchInput({ value, onChange }: ArticlesToolbarSearchInputProps) {
    const { t } = useTranslation();
    return (
        <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
            <Input
                value={value}
                className="h-10 bg-muted px-9 dark:bg-muted"
                onChange={(e) => onChange(e.target.value)}
                placeholder={t("articles.filters.searchPlaceholder")}
            />
            {value && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onChange("")}
                    aria-label={t("articles.filters.clearSearch")}
                    className="-translate-y-1/2 absolute top-1/2 right-1 size-7 rounded-full text-muted-foreground"
                >
                    <XIcon className="size-4" />
                </Button>
            )}
        </div>
    );
}
