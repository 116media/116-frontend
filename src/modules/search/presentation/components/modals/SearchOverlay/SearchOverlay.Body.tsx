"use client";

import { useTranslation } from "react-i18next";

import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import { SearchResultList } from "@/modules/search/presentation/components/lists/SearchResultList";
import {
    CategoryTabs,
    type ICategoryTab
} from "@/shared/presentation/components/navigation/CategoryTabs";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";

import { SearchOverlayIdle } from "./SearchOverlay.Idle";

/**
 * Props for the SearchOverlay.Body component.
 *
 * @interface SearchOverlayBodyProps
 * @property {string} query - The settled term the results belong to.
 * @property {boolean} isQueryable - Whether the term is long enough to have been searched.
 * @property {boolean} isLoading - Whether the first page is still in flight.
 * @property {boolean} isError - Whether the search failed.
 * @property {ISearchHitEntity[]} hits - The hits to preview.
 * @property {number} total - How many the active scope matched, for the hand-off link.
 * @property {Record<ESearchScope, number>} counts - Totals per scope, so a group heading
 * reports the whole match rather than the slice previewed here.
 * @property {ESearchScope} scope - The active scope.
 * @property {ICategoryTab[]} scopeTabs - The scope rail's tabs.
 * @property {(scope: ESearchScope) => void} onScopeChange - Called when a tab is picked.
 * @property {string[]} recent - The reader's recent terms.
 * @property {() => void} onClearRecent - Clears the history.
 * @property {() => void} onNavigate - Called when anything inside navigates away.
 * @property {() => void} onSeeAll - Opens the full results route for the active term.
 * @property {() => void} onRetry - Runs the failed search again.
 */
export interface SearchOverlayBodyProps {
    query: string;
    isQueryable: boolean;
    isLoading: boolean;
    isError: boolean;
    hits: ISearchHitEntity[];
    total: number;
    counts: Record<ESearchScope, number>;
    scope: ESearchScope;
    scopeTabs: ICategoryTab[];
    onScopeChange: (scope: ESearchScope) => void;
    recent: string[];
    onClearRecent: () => void;
    onNavigate: () => void;
    onSeeAll: () => void;
    onRetry: () => void;
}

/**
 * SearchOverlay.Body
 *
 * @description
 * Everything under the panel's field: the idle state before a term, then the scope rail
 * and whichever of loading, error, empty or results the search produced. The rail stays
 * up through a failure, so a reader can still switch scope. Separated from the panel so
 * the panel is only the surface, and this is only what fills it.
 */
export function SearchOverlayBody({
    query,
    isQueryable,
    isLoading,
    isError,
    hits,
    total,
    counts,
    scope,
    scopeTabs,
    onScopeChange,
    recent,
    onClearRecent,
    onNavigate,
    onSeeAll,
    onRetry
}: SearchOverlayBodyProps) {
    const { t } = useTranslation();

    if (!isQueryable) {
        return (
            <PageContainer>
                <SearchOverlayIdle
                    recent={recent}
                    onNavigate={onNavigate}
                    onClearRecent={onClearRecent}
                />
            </PageContainer>
        );
    }

    return (
        <PageContainer className="flex flex-col gap-5">
            <CategoryTabs
                fill
                categories={scopeTabs}
                allLabel={t("search.scope.all")}
                value={scope === ESearchScope.All ? undefined : scope}
                onChange={(next) => onScopeChange((next as ESearchScope) ?? ESearchScope.All)}
            />

            <SearchResultList
                hits={hits}
                query={query}
                scope={scope}
                counts={counts}
                density="preview"
                isError={isError}
                onRetry={onRetry}
                isLoading={isLoading}
                onNavigate={onNavigate}
                footer={
                    <button
                        type="button"
                        onClick={onSeeAll}
                        className="rounded-lg py-2 text-center font-semibold text-primary text-sm transition-colors hover:bg-muted dark:text-secondary"
                    >
                        {t("search.overlay.seeAll", { count: total })}
                    </button>
                }
            />
        </PageContainer>
    );
}
