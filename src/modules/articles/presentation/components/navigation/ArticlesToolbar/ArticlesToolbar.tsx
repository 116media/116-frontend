"use client";

import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";
import { useScrollDirection } from "@/shared/presentation/hooks/useScrollDirection";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { ArticlesToolbarCategorySelect } from "./ArticlesToolbar.CategorySelect";
import { ArticlesToolbarClearFilters } from "./ArticlesToolbar.ClearFilters";
import { ArticlesToolbarSearchInput } from "./ArticlesToolbar.SearchInput";
import { ArticlesToolbarTagStrip } from "./ArticlesToolbar.TagStrip";

/**
 * Sentinel options matching the toolbar's sticky offset (`top-28`, under the
 * sticky TopBar + Header stack): the sentinel counts as gone — the toolbar as
 * pinned — once it crosses that line. Module-level so the observer is stable.
 */
const PINNED_SENTINEL_OPTIONS: IntersectionObserverInit = {
    rootMargin: "-112px 0px 0px 0px"
};

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
 * Filter region under the promoted feed: category dropdown, search input, and the tag
 * strip with the "All tags" popover, as one sticky group pinned under the navbar. In its
 * natural position it scrolls like regular content; once pinned it gains a bottom border,
 * hides while scrolling down, and reveals on scroll-up. Fully controlled — the container
 * owns the filter state; a "Clear filters" control shows while any filter is active.
 */
export function ArticlesToolbar(props: ArticlesToolbarProps) {
    const direction = useScrollDirection();
    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(PINNED_SENTINEL_OPTIONS);
    const isPinned = !isSentinelVisible;
    const isHidden = isPinned && direction === "down";

    return (
        <>
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
                        "before:border-b before:border-border/50 transition-all duration-300",
                    isHidden && "-translate-y-2 pointer-events-none opacity-0"
                )}
            >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <ArticlesToolbarCategorySelect
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
        </>
    );
}
