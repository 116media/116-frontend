import { VideosToolbar as VideosToolbarRoot } from "./VideosToolbar";
import { VideosToolbarAllTagsPopover } from "./VideosToolbar.AllTagsPopover";
import { VideosToolbarCategoryTabs } from "./VideosToolbar.CategoryTabs";
import { VideosToolbarClearFilters } from "./VideosToolbar.ClearFilters";
import { VideosToolbarSearchInput } from "./VideosToolbar.SearchInput";
import { VideosToolbarTagStrip } from "./VideosToolbar.TagStrip";

/**
 * VideosToolbar
 *
 * @description
 * The videos feed's filter bar: the root pins the row, with `.CategoryTabs`, `.TagStrip`,
 * `.AllTagsPopover`, `.SearchInput` and `.ClearFilters` as its controls.
 */
export const VideosToolbar = {
    Root: VideosToolbarRoot,
    AllTagsPopover: VideosToolbarAllTagsPopover,
    CategoryTabs: VideosToolbarCategoryTabs,
    ClearFilters: VideosToolbarClearFilters,
    SearchInput: VideosToolbarSearchInput,
    TagStrip: VideosToolbarTagStrip
} as const;
