"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import type { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import { SearchResultGroups } from "@/modules/search/presentation/components/sections/SearchResultGroups";
import { ErrorState } from "@/shared/presentation/components/ui/ErrorState";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

import { SearchResultListEmpty } from "./SearchResultList.Empty";
import { type SearchLoadingDensity, SearchResultListLoading } from "./SearchResultList.Loading";

/**
 * Props for the SearchResultList component.
 *
 * @interface SearchResultListProps
 * @property {string} query - The term the results belong to, echoed by the no-match state.
 * @property {ISearchHitEntity[]} hits - The hits for the active page.
 * @property {ESearchScope} scope - The active scope, which decides the placeholder shapes.
 * @property {boolean} isLoading - Whether the first page is still in flight.
 * @property {boolean} isError - Whether the search failed.
 * @property {() => void} onRetry - Runs the failed search again.
 * @property {Record<ESearchScope, number>} [counts] - Totals per scope, so a group heading
 * reports the whole match rather than the slice on screen.
 * @property {SearchLoadingDensity} [density] - How densely the placeholders fill a group.
 * @property {() => void} [onNavigate] - Called when a card is followed, so a panel can close.
 * @property {ReactNode} [header] - Sits above the groups, alongside results only.
 * @property {ReactNode} [footer] - Sits below the groups, alongside results only.
 */
export interface SearchResultListProps {
    query: string;
    isError: boolean;
    isLoading: boolean;
    scope: ESearchScope;
    hits: ISearchHitEntity[];
    density?: SearchLoadingDensity;
    counts?: Record<ESearchScope, number>;
    onRetry: () => void;
    onNavigate?: () => void;
    header?: ReactNode;
    footer?: ReactNode;
}

/**
 * SearchResultList
 *
 * @description
 * The results region: which of loading, failure, no-match or the grouped hits a surface
 * shows. Owning the ladder here is what lets the panel and the route differ only in
 * density and in what they hang above or below the groups.
 */
export function SearchResultList({
    query,
    hits,
    scope,
    isLoading,
    isError,
    onRetry,
    counts,
    density = "page",
    onNavigate,
    header,
    footer
}: SearchResultListProps) {
    const { t } = useTranslation();

    return (
        <StateRenderer
            data={hits}
            error={isError}
            loading={isLoading}
            empty={<SearchResultListEmpty query={query} />}
            skeleton={
                <SearchResultListLoading
                    scope={scope}
                    density={density}
                />
            }
            errorState={
                <ErrorState
                    onRetry={onRetry}
                    className="min-h-0 py-12"
                    context="search-results-error"
                    title={t("search.error.title")}
                    retryLabel={t("search.error.retry")}
                />
            }
            render={(items) => (
                <div className="flex flex-col gap-3">
                    {header}
                    <SearchResultGroups
                        hits={items}
                        counts={counts}
                        onNavigate={onNavigate}
                    />
                    {footer}
                </div>
            )}
        />
    );
}
