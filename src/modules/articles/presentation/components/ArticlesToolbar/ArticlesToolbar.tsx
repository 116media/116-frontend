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
 * The filter region under the promoted feed: a category dropdown on the left and a
 * search input on the right (row 1), and the tag pill strip with an "All tags" popover
 * (row 2). Fully controlled — the container owns the filter state and re-queries the
 * feed on change. Shows a "Clear filters" control when any filter is active. On mobile
 * the row stacks and the search goes full-width.
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
