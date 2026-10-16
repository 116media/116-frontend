"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { SearchIcon, XIcon } from "@/shared/presentation/components/ui/Icon";
import { Input } from "@/shared/presentation/components/ui/Input";
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
        <div className={cn("relative w-full sm:max-w-xs", className)}>
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
            <Input
                value={value}
                className="h-10 bg-muted px-9 dark:bg-muted"
                onChange={(event) => onChange(event.target.value)}
                placeholder={t("videos.browse.filters.searchPlaceholder")}
            />
            {value && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onChange("")}
                    aria-label={t("videos.browse.filters.clearSearch")}
                    className="-translate-y-1/2 absolute top-1/2 right-1 size-7 rounded-full text-muted-foreground"
                >
                    <XIcon className="size-4" />
                </Button>
            )}
        </div>
    );
}
