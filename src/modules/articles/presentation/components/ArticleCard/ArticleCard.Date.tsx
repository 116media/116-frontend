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
 * The relative, locale-aware publication date shown at the end of the byline row, aligned
 * to the card's right corner. Rendered via the shared RelativeDate so formatting stays
 * consistent with the rest of the app.
 *
 * @param publishedAt - ISO publication date, or null.
 */
export function ArticleCardDate({ publishedAt }: ArticleCardDateProps) {
    return (
        <span className="flex items-center text-muted-foreground text-xs">
            <CalendarIcon className="mr-1 size-3.5" />
            <RelativeDate date={publishedAt} />
        </span>
    );
}
