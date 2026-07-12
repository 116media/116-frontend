import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Shared compact number formatter.
 *
 * @description
 * A single Intl.NumberFormat instance reused across renders, fixed to "en-US" so the
 * output is deterministic between server and client renders (no hydration mismatch)
 * and the "K"/"M"/"B" suffixes stay consistent regardless of the active UI language.
 */
const compactNumberFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
});

/**
 * formatCount
 *
 * @description
 * Formats an engagement count into a compact label (1500 → "1.5K", 2_400_000 → "2.4M");
 * values below 1000 render unchanged.
 *
 * @param value - The raw count
 * @returns The compact display string
 */
export function formatCount(value: number): string {
    return compactNumberFormatter.format(value);
}

/**
 * formatRelativeDate
 *
 * @description
 * Converts an ISO date string into a relative label in the given locale ("il y a 3 jours",
 * "3 days ago"). The locale is applied per call, not on the global dayjs instance, so the
 * result is safe under concurrent server-side rendering.
 *
 * @param publishedAt - ISO 8601 date string, or null
 * @param locale - The active language code to format against (e.g. "fr", "en")
 * @returns Relative time string in the given locale, or null
 */
export function formatRelativeDate(publishedAt: string | null, locale: string): string | null {
    if (!publishedAt) return null;
    return dayjs(publishedAt).locale(locale).fromNow();
}
