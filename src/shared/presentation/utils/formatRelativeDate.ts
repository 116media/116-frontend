import dayjs from "dayjs";

/**
 * formatRelativeDate
 *
 * @description
 * Converts an ISO date string into a locale-aware relative label using dayjs's `relativeTime`
 * plugin (e.g. "il y a 3 jours" in French, "3 days ago" in English).
 *
 * @param publishedAt - ISO 8601 date string, or null
 * @returns Locale-aware relative time string, or null
 */
export function formatRelativeDate(publishedAt: string | null): string | null {
    if (!publishedAt) return null;
    return dayjs(publishedAt).fromNow();
}
