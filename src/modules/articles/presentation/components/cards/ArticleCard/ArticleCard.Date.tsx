"use client";

import { CalendarIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";

/**
 * Props for ArticleCardDate.
 *
 * @interface ArticleCardDateProps
 * @property {string | null} publishedAt - ISO publication date, or null.
 */
export interface ArticleCardDateProps {
    publishedAt: string | null;
}

/**
 * ArticleCardDate
 *
 * @description
 * Relative, locale-aware publication date for the byline row, rendered via the shared
 * RelativeDate so formatting stays consistent with the rest of the app.
 */
export function ArticleCardDate({ publishedAt }: ArticleCardDateProps) {
    return (
        <span className="flex items-center text-muted-foreground text-xs">
            <CalendarIcon className="mr-1 size-3.5" />
            <RelativeDate date={publishedAt} />
        </span>
    );
}
