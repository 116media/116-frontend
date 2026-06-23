/**
 * Shared compact number formatter.
 *
 * @description
 * A single Intl.NumberFormat instance reused across renders (constructing one
 * per call is comparatively expensive). Fixed to "en-US" so the output is
 * deterministic between the server and client renders — avoiding hydration
 * mismatches — and so the "K"/"M"/"B" suffixes stay consistent regardless of
 * the active UI language.
 */
const compactNumberFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
});

/**
 * formatCount
 *
 * @description
 * Formats an engagement count (likes, shares, comments, ratings, views) into a
 * compact label using Intl.NumberFormat's compact notation — 1500 → "1.5K",
 * 2_400_000 → "2.4M" — while values below 1000 render unchanged. Centralizes the
 * formatting that was previously hand-rolled and duplicated across the article
 * and video card stat rows.
 *
 * @param value - The raw count
 * @returns The compact display string
 */
export function formatCount(value: number): string {
    return compactNumberFormatter.format(value);
}
