"use client";

import { useTranslation } from "react-i18next";

import { SEARCH_RECENT_GRID } from "@/modules/search/presentation/constants/searchLayout";
import { useSearchTagSuggestions } from "@/modules/search/presentation/hooks/useSearchTagSuggestions";
import { searchHref } from "@/modules/search/presentation/utils/search/search.utils";
import { MegaMenuRow } from "@/shared/presentation/components/ui/MegaMenuRow";
import { Tag } from "@/shared/presentation/components/ui/Tag";

/**
 * How many tags the idle state offers before the cloud reads as a wall.
 */
const TAG_LIMIT = 12;

/**
 * Props for the SearchOverlay.Idle component.
 *
 * @interface SearchOverlayIdleProps
 * @property {string[]} recent - The reader's own recent terms, most recent first.
 * @property {() => void} onNavigate - Called when a row or chip is followed, so the panel closes.
 * @property {() => void} onClearRecent - Called when the history is cleared.
 */
export interface SearchOverlayIdleProps {
    recent: string[];
    onNavigate: () => void;
    onClearRecent: () => void;
}

/**
 * SearchOverlay.Idle
 *
 * @description
 * What the panel shows before a term is typed: the reader's own history as mega-menu
 * rows, then tags as the same pills the mega menus use. Tags stand in for the "popular
 * searches" the design calls for because query telemetry does not exist yet, and unlike
 * a trending term a tag can never lead to an empty result page. Both are real links, so
 * the keyboard and the middle button work as they do everywhere else.
 */
export function SearchOverlayIdle({ recent, onNavigate, onClearRecent }: SearchOverlayIdleProps) {
    const { t } = useTranslation();
    const { data: tags = [] } = useSearchTagSuggestions();

    return (
        <div className="flex flex-col gap-6">
            {recent.length > 0 && (
                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <p className="pr-3 font-bold text-muted-foreground text-xs uppercase tracking-wider">
                            {t("search.idle.recent")}
                        </p>
                        <button
                            type="button"
                            onClick={onClearRecent}
                            className="font-semibold text-muted-foreground text-xs transition-colors hover:text-foreground"
                        >
                            {t("search.idle.clear")}
                        </button>
                    </div>
                    <div className="h-px bg-outlined/60" />
                    <div className={SEARCH_RECENT_GRID}>
                        {recent.map((term) => (
                            <MegaMenuRow
                                key={term}
                                label={term}
                                onNavigate={onNavigate}
                                href={searchHref(term)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {tags.length > 0 && (
                <section>
                    <p className="mb-3 font-bold text-muted-foreground text-xs uppercase tracking-wider">
                        {t("search.idle.explore")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tags.slice(0, TAG_LIMIT).map((tag) => (
                            <Tag
                                size="lg"
                                prefix="#"
                                shape="pill"
                                key={tag.id}
                                variant="default"
                                onClick={onNavigate}
                                href={searchHref(tag.name)}
                            >
                                {tag.name}
                            </Tag>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
