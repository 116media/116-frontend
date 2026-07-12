"use client";

import { useTranslation } from "react-i18next";

/**
 * ArticlesGridEndOfFeed
 *
 * @description
 * The terminus shown when the feed has no further pages — a small, centered, muted line
 * giving screen-reader users a clear "end of list" cue that infinite scroll otherwise
 * hides.
 */
export function ArticlesGridEndOfFeed() {
    const { t } = useTranslation();
    return (
        <p className="py-8 text-center text-muted-foreground text-sm">{t("articles.grid.end")}</p>
    );
}
