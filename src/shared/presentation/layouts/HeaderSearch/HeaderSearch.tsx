"use client";

import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { SearchIcon } from "@/shared/presentation/components/ui/Icon";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import { MIN_SEARCH_LENGTH } from "@/shared/presentation/constants/search";
import { useProgressRouter } from "@/shared/presentation/hooks/useProgressRouter";
import { useFilterBarPin } from "@/shared/presentation/providers/FilterBarPinProvider";
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
 * The mobile and tablet search field. Submitting navigates to the articles feed with
 * the query as its `search` filter, which the route already reads. Stands down while a
 * page's filter bar is pinned under the header, so no screen shows two search boxes.
 */
export function HeaderSearch({ className }: HeaderSearchProps) {
    const router = useProgressRouter();
    const { isPinned, isHidden } = useFilterBarPin();
    const { t } = useTranslation();
    const [query, setQuery] = useState("");

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmed = query.trim();
        if (trimmed.length < MIN_SEARCH_LENGTH) return;
        router.push(`${ARTICLES_PATH}?search=${encodeURIComponent(trimmed)}`);
    };

    // The bar owns the row only while it is pinned *and* on screen; once it scrolls
    // away this field takes the row back, so search is never absent from the chrome.
    if (isPinned && !isHidden) return null;

    return (
        <search className={cn("block pb-3", className)}>
            <form onSubmit={onSubmit}>
                <label
                    htmlFor="header-search"
                    className="flex h-10 items-center gap-3 rounded-lg bg-muted px-4 text-muted-foreground focus-within:ring-2 focus-within:ring-ring/50"
                >
                    <SearchIcon
                        aria-hidden="true"
                        className="size-5 shrink-0"
                    />
                    <input
                        type="search"
                        value={query}
                        id="header-search"
                        enterKeyHint="search"
                        aria-label={t("navigation.search.label")}
                        placeholder={t("navigation.search.placeholder")}
                        onChange={(event) => setQuery(event.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                    />
                </label>
            </form>
        </search>
    );
}
