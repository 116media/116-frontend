import { getLanguage } from "@/shared/presentation/utils/getLanguage";

/**
 * formatRelativeDate
 *
 * @description
 * Converts an ISO date string into a locale-aware relative label using the
 * native Intl.RelativeTimeFormat API (e.g. "il y a 3 jours" in French,
 * "3 days ago" in English). The locale is read from the user's stored
 * language preference via getLanguage(). Returns null when the input is null.
 *
 * @param publishedAt - ISO 8601 date string, or null
 * @returns Locale-aware relative time string, or null
 */
export function formatRelativeDate(publishedAt: string | null): string | null {
    if (!publishedAt) return null;
    const diffMs = Date.now() - new Date(publishedAt).getTime();
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    const rtf = new Intl.RelativeTimeFormat(getLanguage(), { numeric: "auto" });

    if (Math.abs(diffSeconds) < 60) return rtf.format(-diffSeconds, "second");
    if (Math.abs(diffMinutes) < 60) return rtf.format(-diffMinutes, "minute");
    if (Math.abs(diffHours) < 24) return rtf.format(-diffHours, "hour");
    if (Math.abs(diffDays) < 30) return rtf.format(-diffDays, "day");
    if (Math.abs(diffMonths) < 12) return rtf.format(-diffMonths, "month");
    return rtf.format(-diffYears, "year");
}
