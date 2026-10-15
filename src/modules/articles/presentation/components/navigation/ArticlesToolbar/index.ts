import { ArticlesToolbar as ArticlesToolbarRoot } from "./ArticlesToolbar";
import { ArticlesToolbarAllTagsPopover } from "./ArticlesToolbar.AllTagsPopover";
import { ArticlesToolbarCategoryTabs } from "./ArticlesToolbar.CategoryTabs";
import { ArticlesToolbarClearFilters } from "./ArticlesToolbar.ClearFilters";
import { ArticlesToolbarSearchInput } from "./ArticlesToolbar.SearchInput";
import { ArticlesToolbarTagStrip } from "./ArticlesToolbar.TagStrip";

/**
 * ArticlesToolbar
 *
 * @description
 * The articles feed's filter bar: the root pins the row, with `.CategoryTabs`,
 * `.TagStrip`, `.AllTagsPopover`, `.SearchInput` and `.ClearFilters` as its controls.
 */
export const ArticlesToolbar = {
    Root: ArticlesToolbarRoot,
    AllTagsPopover: ArticlesToolbarAllTagsPopover,
    CategoryTabs: ArticlesToolbarCategoryTabs,
    ClearFilters: ArticlesToolbarClearFilters,
    SearchInput: ArticlesToolbarSearchInput,
    TagStrip: ArticlesToolbarTagStrip
} as const;
