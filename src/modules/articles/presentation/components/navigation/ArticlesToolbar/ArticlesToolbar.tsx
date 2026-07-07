"use client";

import { ArticlesToolbarCategorySelect } from "./ArticlesToolbar.CategorySelect";
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
 * Filter region under the promoted feed: category dropdown, search input, and the tag
 * strip with the "All tags" popover. Fully controlled — the container owns the filter
 * state; a "Clear filters" control shows while any filter is active.
 */
export function ArticlesToolbar(props: ArticlesToolbarProps) {
    return (
        <div className="flex flex-col gap-3">
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
    );
}
