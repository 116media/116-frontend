"use client";

import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { useFilterBarPinned } from "@/shared/presentation/hooks/useFilterBarPinned";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { ArticlesToolbarCategoryTabs } from "./ArticlesToolbar.CategoryTabs";
import { ArticlesToolbarClearFilters } from "./ArticlesToolbar.ClearFilters";
import { ArticlesToolbarSearchInput } from "./ArticlesToolbar.SearchInput";
import { ArticlesToolbarTagStrip } from "./ArticlesToolbar.TagStrip";

/**
 * Props for ArticlesToolbar.
 *
 * @interface ArticlesToolbarProps
 * @property {string} search - The current (raw) search text.
 * @property {(value: string) => void} onSearchChange - Emits the search text.
 * @property {string | undefined} categoryId - The selected category id, or undefined for all.
 * @property {(categoryId: string | undefined) => void} onCategoryChange - Emits the category.
 * @property {string | undefined} tagSlug - The selected tag slug, or undefined for none.
 * @property {(tagSlug: string | undefined) => void} onTagChange - Emits the tag.
 * @property {boolean} hasActiveFilters - Whether any filter is set (shows "Clear filters").
 * @property {() => void} onClear - Clears all filters.
 */
export interface ArticlesToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    categoryId: string | undefined;
    onCategoryChange: (categoryId: string | undefined) => void;
    tagSlug: string | undefined;
    onTagChange: (tagSlug: string | undefined) => void;
    hasActiveFilters: boolean;
    onClear: () => void;
}

/**
 * ArticlesToolbar
 *
 * @description
 * Filter region under the promoted feed: the browse title, the category rail, the article
 * search, and the popular-tags strip, as one sticky group pinned under the navbar. In its
 * natural position it scrolls like regular content; once pinned it gains a bottom border
 * and stays put, and the header stands its own search field down for as long as it is
 * pinned. Fully controlled — the container owns the filter state; a "Clear filters"
 * control shows while any filter is active.
 */
export function ArticlesToolbar(props: ArticlesToolbarProps) {
    const { t } = useTranslation();
    const { sentinelRef, isPinned, isHidden } = useFilterBarPinned();

    return (
        <Fragment>
            <div
                aria-hidden
                className="h-px"
                ref={sentinelRef}
            />
            <div
                className={cn(
                    "sticky top-28 z-30 flex flex-col gap-3 py-3",
                    "before:-z-10 before:-translate-x-1/2 before:absolute before:inset-y-0 before:left-1/2 before:w-screen before:bg-background/95 before:backdrop-blur",
                    isPinned &&
                        "before:border-b before:border-outlined transition-transform duration-300",
                    isHidden && "-translate-y-[calc(100%_+_1px)]"
                )}
            >
                <h2
                    suppressHydrationWarning
                    className="font-bold text-foreground text-xl tracking-wide sm:text-2xl lg:text-3xl"
                >
                    {t("articles.browse.title")}
                </h2>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <ArticlesToolbarCategoryTabs
                        value={props.categoryId}
                        onChange={props.onCategoryChange}
                    />
                    <ArticlesToolbarSearchInput
                        value={props.search}
                        onChange={props.onSearchChange}
                    />
                </div>
                <ArticlesToolbarTagStrip
                    value={props.tagSlug}
                    onChange={props.onTagChange}
                />
                {props.hasActiveFilters && <ArticlesToolbarClearFilters onClear={props.onClear} />}
            </div>
        </Fragment>
    );
}
