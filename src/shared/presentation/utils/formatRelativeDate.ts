import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * formatRelativeDate
 *
 * @description
 * Converts an ISO date string into a relative label in the given locale using dayjs's
 * relativeTime plugin (e.g. "il y a 3 jours" in French, "3 days ago" in English). The
 * locale is applied to the dayjs instance directly instead of the global dayjs locale,
 * so the result is correct per call and safe under concurrent server-side rendering.
 *
 * @param publishedAt - ISO 8601 date string, or null
 * @param locale - The active language code to format against (e.g. "fr", "en")
 * @returns Relative time string in the given locale, or null
 */
export function formatRelativeDate(publishedAt: string | null, locale: string): string | null {
    if (!publishedAt) return null;
    return dayjs(publishedAt).locale(locale).fromNow();
}
