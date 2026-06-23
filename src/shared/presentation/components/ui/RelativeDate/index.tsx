"use client";

import { useTranslation } from "react-i18next";

import { formatRelativeDate } from "@/shared/presentation/utils/formatRelativeDate";

interface RelativeDateProps {
    date: string | null;
}

/**
 * RelativeDate
 *
 * @description
 * Renders a relative published date (e.g. "il y a 3 jours", "3 days ago") in the user's
 * active language. The locale is read from the i18n context rather than threaded through
 * props, so the label follows the user's choice everywhere it is used and updates live when
 * the language changes — instead of being frozen at server-render time. Renders nothing when
 * no date is supplied. suppressHydrationWarning guards the harmless time drift between the
 * server render and client hydration.
 *
 * @param date - ISO 8601 date string, or null
 */
export function RelativeDate({ date }: RelativeDateProps) {
    const { i18n } = useTranslation();
    const label = formatRelativeDate(date, i18n.language);

    if (!label) return null;

    const capitalized = label.charAt(0).toUpperCase() + label.slice(1);

    return <span suppressHydrationWarning>{capitalized}</span>;
}
