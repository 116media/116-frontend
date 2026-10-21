# Route and Container

## Checklist

- [ ] `app/(public)/search/page.tsx` with metadata
- [ ] `SearchContainer` owning the query and URL state
- [ ] Scope read from and written to the URL
- [ ] Every state wired: idle, loading, results, empty, error

---

## Route

```tsx
// app/(public)/search/page.tsx
import type { Metadata } from "next";

import { SearchContainer } from "@/modules/search/presentation/containers/SearchContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * Props for the search route.
 *
 * @interface SearchPageProps
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - The
 * route query params carrying the term and the scope.
 */
export interface SearchPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * generateMetadata
 *
 * @description
 * Titles the page with the active query so a shared link reads as that search, and
 * keeps the route out of the index: a query-string page has no canonical content.
 *
 * @param props - The route props carrying the query params.
 * @returns The metadata for this search.
 */
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const { t } = await getServerTranslation();
    const params = await searchParams;
    const query = firstParam(params.q);

    return {
        robots: { index: false, follow: true },
        title: query ? t("search.meta.titleWithQuery", { query }) : t("search.meta.title")
    };
}

/**
 * SearchPage
 *
 * @description
 * The site search route. Seeds the container from the URL so a shared or reloaded
 * link renders the same results.
 *
 * @param props - The route props carrying the query params.
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;

    return (
        <SearchContainer
            initialQuery={firstParam(params.q) ?? ""}
            initialScope={parseScope(firstParam(params.scope))}
        />
    );
}
```

`robots: { index: false }` matters: search-result pages with arbitrary query strings
are the classic source of thin-content indexing problems.

`firstParam` already exists in the articles route; promote it to
`shared/presentation/utils/params/params.utils.ts` on this second use, per the reuse
ladder.

`parseScope` lives in the module's utils and falls back to `ESearchScope.All` for any
unknown value, so a hand-edited URL cannot break the page:

```ts
// src/modules/search/presentation/utils/search/search.utils.ts
import { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";

/**
 * Resolves a scope from a raw query-param value, falling back to `All` for anything
 * unrecognised so a hand-edited URL renders rather than throwing.
 *
 * @param value - The raw `scope` param.
 * @returns The resolved scope.
 */
export function parseScope(value: string | undefined): ESearchScope {
    const scopes = Object.values(ESearchScope) as string[];
    return scopes.includes(value ?? "") ? (value as ESearchScope) : ESearchScope.All;
}
```

---

## Container

```tsx
// src/modules/search/presentation/containers/SearchContainer/SearchContainer.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import { SearchPage } from "@/modules/search/presentation/components/pages/SearchPage";
import { MIN_SEARCH_LENGTH } from "@/modules/search/presentation/constants/searchKeys";
import { useRecentSearches } from "@/modules/search/presentation/hooks/useRecentSearches";
import { useSearch } from "@/modules/search/presentation/hooks/useSearch";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";

import type { SearchContainerProps } from "./types";

/**
 * SearchContainer
 *
 * @description
 * Owns the search query: the draft term, its debounced settled value, the active
 * scope, and the mirror of both into the URL. Renders the presentational page with
 * whichever state the query resolves to.
 */
export function SearchContainer({ initialQuery, initialScope }: SearchContainerProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();

    const [draft, setDraft] = useState(initialQuery);
    const [scope, setScope] = useState<ESearchScope>(initialScope);

    const settled = useDebouncedValue(draft);
    const query = settled.trim();
    const isQueryable = query.length >= MIN_SEARCH_LENGTH;

    const { recent, remember, clear } = useRecentSearches();
    const { data, isPending, isError, refetch, isPlaceholderData } = useSearch(query, scope);

    // Mirror the query and scope into the URL so a result set is shareable and the
    // back button undoes a search. `replace` keeps one entry per settled term.
    useEffect(() => {
        const params = new URLSearchParams();
        if (isQueryable) params.set("q", query);
        if (scope !== initialScope) params.set("scope", scope);

        router.replace(params.size > 0 ? `${pathname}?${params}` : pathname, { scroll: false });
    }, [query, scope, isQueryable, initialScope, pathname, router]);

    // A query only joins the history once it has actually returned something, so a
    // term typed on the way to another term is not remembered.
    useEffect(() => {
        if (isQueryable && data && data.counts.all > 0) remember(query);
    }, [isQueryable, data, query, remember]);

    return (
        <SearchPage
            draft={draft}
            scope={scope}
            recent={recent}
            results={data}
            isError={isError}
            onRetry={refetch}
            onClear={clear}
            onScopeChange={setScope}
            onDraftChange={setDraft}
            onRecentSelect={setDraft}
            isIdle={!isQueryable}
            isLoading={isQueryable && isPending}
            isRefreshing={isPlaceholderData}
        />
    );
}
```

### State matrix

The container resolves exactly one state, in this order:

| Order | Condition | Rendered |
| --- | --- | --- |
| 1 | `isError` | Error with retry |
| 2 | `!isQueryable` | Idle: recent searches, then popular tags |
| 3 | `isLoading` | Skeleton rows |
| 4 | `results.counts.all === 0` | Empty, naming the query |
| 5 | otherwise | Results, dimmed while `isRefreshing` |

Error is checked before idle so clearing the field after a failure does not leave the
error visible with nothing to retry.

### Why scope does not refetch

`searchKeys.results(query, scope)` includes the scope, and the API returns all counts
on every call, so switching tabs resolves from cache when that scope was already
fetched and issues one request when it was not. The tab labels never wait on a request,
because the counts came with the first response.
