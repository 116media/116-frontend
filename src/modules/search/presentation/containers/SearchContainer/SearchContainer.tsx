"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    ESearchScope,
    SEARCH_SCOPES,
    toSearchScope
} from "@/modules/search/domain/enums/ESearchScope";
import {
    SearchResultListEmpty,
    SearchResultListLoading
} from "@/modules/search/presentation/components/lists/SearchResultList";
import { SearchResultGroups } from "@/modules/search/presentation/components/sections/SearchResultGroups";
import {
    MIN_SEARCH_TERM_LENGTH,
    SEARCH_DEBOUNCE_MS
} from "@/modules/search/presentation/constants/searchKeys";
import { useRecentSearches } from "@/modules/search/presentation/hooks/useRecentSearches";
import { useSearchResults } from "@/modules/search/presentation/hooks/useSearchResults";
import { searchHref } from "@/modules/search/presentation/utils/search/search.utils";
import {
    CategoryTabs,
    type ICategoryTab
} from "@/shared/presentation/components/navigation/CategoryTabs";

import { SearchContainerField } from "./SearchContainer.Field";

/**
 * Zeroed counts, so the result tally renders before the first response lands. The tabs
 * take the live counts instead and carry no badge until there are real ones.
 */
const EMPTY_COUNTS: Record<ESearchScope, number> = {
    [ESearchScope.All]: 0,
    [ESearchScope.Articles]: 0,
    [ESearchScope.Videos]: 0,
    [ESearchScope.Shorts]: 0
};

/**
 * SearchContainer
 *
 * @description
 * The search route. The term and the scope live in the URL, so a result page is
 * shareable and the back button steps through searches. Typing rewrites the URL in
 * place rather than pushing, so a single search leaves one history entry.
 */
export function SearchContainer() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useSearchParams();
    const { remember } = useRecentSearches();

    const urlTerm = params.get("q") ?? "";
    const scope = toSearchScope(params.get("scope"));

    const [term, setTerm] = useState(urlTerm);

    useEffect(() => {
        setTerm(urlTerm);
    }, [urlTerm]);

    useEffect(() => {
        const trimmed = term.trim();
        if (trimmed === urlTerm) return;

        const timer = window.setTimeout(() => {
            router.replace(searchHref(trimmed, scope === ESearchScope.All ? undefined : scope));
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timer);
    }, [term, urlTerm, scope, router]);

    const query = urlTerm.trim();
    const isQueryable = query.length >= MIN_SEARCH_TERM_LENGTH;
    const { data, isLoading, isError } = useSearchResults(query, scope);

    useEffect(() => {
        if (data && !data.isEmpty) remember(data.query);
    }, [data, remember]);

    const onScopeChange = useCallback(
        (next: string | undefined) => {
            router.replace(searchHref(query, next));
        },
        [query, router]
    );

    const tallies = data?.counts;
    const counts = tallies ?? EMPTY_COUNTS;

    // The scope rail is the browse feeds' category rail, so search reads as the same
    // control: "all" is its leading tab, the rest carry their counts.
    const scopeTabs = useMemo<ICategoryTab[]>(
        () =>
            SEARCH_SCOPES.filter((candidate) => candidate !== ESearchScope.All).map(
                (candidate) => ({
                    id: candidate,
                    count: tallies?.[candidate],
                    name: t(`search.scope.${candidate}`)
                })
            ),
        [tallies, t]
    );
    const hits = useMemo(() => data?.items ?? [], [data]);

    return (
        <div className="flex flex-col gap-5 py-2">
            <SearchContainerField
                value={term}
                onValueChange={setTerm}
            />

            {isQueryable && (
                <CategoryTabs
                    fill
                    categories={scopeTabs}
                    onChange={onScopeChange}
                    allLabel={t("search.scope.all")}
                    value={scope === ESearchScope.All ? undefined : scope}
                />
            )}

            {!isQueryable && (
                <p className="py-10 text-center text-muted-foreground text-sm">
                    {t("search.prompt")}
                </p>
            )}

            {isQueryable && isLoading && <SearchResultListLoading scope={scope} />}

            {isQueryable && isError && (
                <p className="py-10 text-center text-muted-foreground text-sm">
                    {t("search.error")}
                </p>
            )}

            {isQueryable && !isLoading && !isError && hits.length === 0 && (
                <SearchResultListEmpty query={query} />
            )}

            {isQueryable && hits.length > 0 && (
                <>
                    <p
                        aria-live="polite"
                        className="text-muted-foreground text-sm"
                    >
                        {t("search.results.count", { count: counts[scope] ?? 0 })}
                    </p>
                    <SearchResultGroups hits={hits} />
                </>
            )}
        </div>
    );
}
