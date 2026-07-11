"use client";

import { useTranslation } from "react-i18next";

import { formatRelativeDate } from "@/shared/presentation/utils/format/format.utils";

/**
 * Props for the RelativeDate component.
 *
 * @interface RelativeDateProps
 * @property {string | null} date - ISO date string, or null when unset.
 */
export interface RelativeDateProps {
    date: string | null;
}

/**
 * RelativeDate
 *
 * @description
 * Renders a relative published date (e.g. "3 days ago") in the user's active
 * language, read live from the i18n context. Renders nothing without a date;
 * suppressHydrationWarning guards server/client time drift.
 */
export function RelativeDate({ date }: RelativeDateProps) {
    const { i18n } = useTranslation();
    const label = formatRelativeDate(date, i18n.language);

    if (!label) return null;

    const capitalized = label.charAt(0).toUpperCase() + label.slice(1);

    return <span suppressHydrationWarning>{capitalized}</span>;
}
