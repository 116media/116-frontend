"use client";

import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import type { ArticlesMegaMenuCardBodyProps } from "./types";

/**
 * ArticlesMegaMenuCardBody
 *
 * @description
 * Shared text content piece composed into both ArticlesMegaMenuCard.Featured
 * and ArticlesMegaMenuCard.Compact. Renders the article title (2-line clamp),
 * headline excerpt (2-line clamp, muted), and a locale-aware relative
 * publication date at the bottom.
 */
export function ArticlesMegaMenuCardBody({
    title,
    headline,
    publishedAt
}: ArticlesMegaMenuCardBodyProps) {
    return (
        <div className="flex flex-1 flex-col gap-1 min-w-0">
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-accent-foreground">
                {title}
            </p>
            {headline && (
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {headline}
                </p>
            )}
            {publishedAt && (
                <p className="mt-auto pt-1 text-xs text-muted-foreground/70">
                    <RelativeDate date={publishedAt} />
                </p>
            )}
        </div>
    );
}
