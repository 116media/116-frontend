/**
 * Column ladders per content type, shared by the results and the placeholders that stand
 * in for them. Both reach four across on a desktop; below that a 16:9 cover with a
 * headline and a meta row under it needs more width than a bare 9:16 poster, so the two
 * ladders climb at different breakpoints.
 */
export const SEARCH_GRIDS = {
    wide: "grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    tall: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
} as const;

/**
 * The term field's cap. Below `xl` it tracks the page gutter; past that the line grows
 * longer than a query ever is, so it centres on a readable measure while the results
 * under it keep the full width.
 */
export const SEARCH_FIELD_WIDTH = "xl:mx-auto xl:max-w-3xl";

/**
 * The ladder the reader's own history runs on. A phone and a tablet take one term per
 * row, where the row is the whole tap target; a desktop has width to spare and a single
 * column of short terms would leave most of the panel empty.
 */
export const SEARCH_RECENT_GRID = "grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-x-6";
