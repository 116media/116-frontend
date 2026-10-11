# Spec 04 — Lyrics list page

`/lyrics`: a search box and a language filter above an infinite-scrolling grid of lyrics cards.
Mirrors `ArticlesFeedContainer` / `ArticlesGrid` / `ArticlesToolbar`'s shape, simplified to search +
language. The backend does now have both a category (backend spec 01/12 — commerce/free-vs-paid
classification, not a browsing facet) and tags (backend spec 07 — discovery/similar-lyrics
matching) for lyrics, but neither is exposed as a public filter here by design: category isn't a
visitor-facing concept (a visitor has no reason to filter by "Standard Lyrics" vs. a paid
placement tier), and tags back the similar-lyrics sidebar rather than a browse filter in this
spec's scope. The language filter (question 6) is the one facet that is exposed.

---

## Hook

**`src/modules/lyrics/presentation/hooks/useLyricsFeed.ts`**

```ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { ILyricsPage } from "@/modules/lyrics/domain/entities/ILyricsPage";
import { LYRICS_PAGE_SIZE, lyricsKeys } from "@/modules/lyrics/presentation/constants/lyricsKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useLyricsFeed
 *
 * @description
 * Infinite query over the published-lyrics listing, keyed by the active search term and
 * language filter.
 *
 * @param search - Optional search term scoping the feed.
 * @param language - Optional language code scoping the feed (e.g. "fr", "ln", "en").
 * @returns The `useInfiniteQuery` result for the feed.
 */
export function useLyricsFeed(search?: string, language?: string) {
    return useInfiniteQuery<ILyricsPage, Failure>({
        queryKey: lyricsKeys.feed(search, language),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const pageIndex = pageParam as number;
            const result = await container.cradle.getPublishedLyricsUseCase.execute({
                pageIndex,
                pageSize: LYRICS_PAGE_SIZE,
                search,
                language
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
```

No dummy-data fallback — unlike `useArticlesFeed`, lyrics have real backend content once spec 01
ships (no "dummy phase" for this feature).

## Card

**`src/modules/lyrics/presentation/components/cards/LyricsCard/LyricsCard.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { ILyricsSummaryEntity } from "@/modules/lyrics/domain/entities/ILyricsSummaryEntity";
import { Card } from "@/shared/presentation/components/ui/Card";
import { MusicIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for LyricsCard.
 *
 * @interface LyricsCardProps
 * @property {ILyricsSummaryEntity} lyrics - The lyrics summary to render.
 */
export interface LyricsCardProps {
    lyrics: ILyricsSummaryEntity;
}

/**
 * LyricsCard
 *
 * @description
 * One row in the lyrics listing grid: cover art (or a muted fallback), song title,
 * artist name, and a plain-text excerpt of the lyrics. Links to the standalone
 * detail page.
 */
export function LyricsCard({ lyrics }: LyricsCardProps) {
    const href = `/lyrics/${lyrics.slug}`;

    return (
        <Link href={href}>
            <Card className="flex h-full flex-col gap-3 overflow-hidden p-0 transition-colors hover:bg-accent/50">
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {lyrics.coverImageUrl ? (
                        <Image
                            fill
                            src={lyrics.coverImageUrl}
                            alt={lyrics.songTitle}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            <MusicIcon className="size-10" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2 p-4 pt-0">
                    <h3 className="font-semibold text-foreground">{lyrics.songTitle}</h3>
                    <p className="text-muted-foreground text-sm">{lyrics.artistName}</p>
                    <p className="line-clamp-3 text-muted-foreground text-sm">{lyrics.excerpt}</p>
                </div>
            </Card>
        </Link>
    );
}
```

(`Card` is a plain styled `<div>` — `cardVariants` + a `className` override, no `CardHeader`/
`CardContent` sub-parts in this codebase's version, unlike some shadcn-derived libraries.)

## Grid

**`src/modules/lyrics/presentation/components/sections/LyricsGrid/LyricsGrid.tsx`** — same shape as
`ArticlesGrid.tsx`, `LyricsCard` instead of `ArticleCard.Feed`, one column count (no `compact`
variant needed — this grid has only one placement). Sibling state files
(`.Empty.tsx`, `.Error.tsx`, `.EndOfFeed.tsx`, `.Loading.tsx`) mirror `ArticlesGrid`'s siblings,
copy adjusted to "lyrics" (see spec 07 for the i18n keys they read).

## Container

**`src/modules/lyrics/presentation/containers/LyricsFeedContainer/LyricsFeedContainer.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";

import { LyricsGridEmpty } from "@/modules/lyrics/presentation/components/sections/LyricsGrid/LyricsGrid.Empty";
import { LyricsGridEndOfFeed } from "@/modules/lyrics/presentation/components/sections/LyricsGrid/LyricsGrid.EndOfFeed";
import { LyricsGridError } from "@/modules/lyrics/presentation/components/sections/LyricsGrid/LyricsGrid.Error";
import { LyricsGridLoading } from "@/modules/lyrics/presentation/components/sections/LyricsGrid/LyricsGrid.Loading";
import { LyricsGrid } from "@/modules/lyrics/presentation/components/sections/LyricsGrid";
import { LyricsLanguageSelect } from "@/modules/lyrics/presentation/components/navigation/LyricsLanguageSelect";
import { LyricsSearchInput } from "@/modules/lyrics/presentation/components/navigation/LyricsSearchInput";
import { useLyricsFeed } from "@/modules/lyrics/presentation/hooks/useLyricsFeed";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

/**
 * Props for {@link LyricsFeedContainer}.
 *
 * @interface LyricsFeedContainerProps
 * @property {string} [initialSearch] - Initial search term, seeded from the URL `search` param.
 * @property {string} [initialLanguage] - Initial language filter, seeded from the URL `language` param.
 */
export interface LyricsFeedContainerProps {
    initialSearch?: string;
    initialLanguage?: string;
}

/**
 * LyricsFeedContainer
 *
 * @description
 * Owns the lyrics feed's search and language filter state, seeded from the URL query
 * params, and drives {@link useLyricsFeed} with the debounced search value. Renders the
 * search input and language select above {@link LyricsGrid} with infinite scroll and
 * feed states.
 */
export function LyricsFeedContainer({
    initialSearch = "",
    initialLanguage
}: LyricsFeedContainerProps = {}) {
    const [search, setSearch] = useState(initialSearch);
    const [language, setLanguage] = useState<string | undefined>(initialLanguage);
    const debouncedSearch = useDebouncedValue(search, 300);
    const activeSearch = debouncedSearch || undefined;
    const hasActiveFilters = Boolean(activeSearch || language);

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useLyricsFeed(activeSearch, language);

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(
        INFINITE_SCROLL_SENTINEL_OPTIONS
    );

    const items = data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const clear = () => {
        setSearch("");
        setLanguage(undefined);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <LyricsSearchInput
                    value={search}
                    onChange={setSearch}
                />
                <LyricsLanguageSelect
                    value={language}
                    onChange={setLanguage}
                />
            </div>
            <StateRenderer
                data={items}
                error={isError}
                loading={isLoading}
                skeleton={<LyricsGridLoading />}
                errorState={<LyricsGridError onRetry={refetch} />}
                empty={
                    <LyricsGridEmpty
                        filtered={hasActiveFilters}
                        onClear={clear}
                    />
                }
                render={(pageItems) => (
                    <div className="flex flex-col gap-8">
                        <LyricsGrid lyrics={pageItems} />
                        {isFetchingNextPage && <LyricsGridLoading rows={1} />}
                        {hasNextPage ? (
                            <div
                                aria-hidden
                                ref={sentinelRef}
                                className="h-px"
                            />
                        ) : (
                            <LyricsGridEndOfFeed />
                        )}
                    </div>
                )}
            />
        </div>
    );
}
```

`LyricsSearchInput` is a small, module-local presentational component (a text input + clear
button) — not spec'd in full detail here since it's a straightforward reduction of
`ArticlesToolbar.SearchInput.tsx`'s shape with no category/tag siblings to coordinate with.

**`src/modules/lyrics/presentation/components/navigation/LyricsLanguageSelect/LyricsLanguageSelect.tsx`**

**Correction**: an earlier draft of this spec modeled this as a 3-option `DropdownMenu` (French /
Lingala / English only). That was wrong — lyrics content is not restricted to those three
languages. The **dashboard's** lyrics form already proves this: its `LyricsForm` uses a
`LanguageSelect` bound to the full ISO 639-1 list
(`apps/dashboard/src/shared/infrastructure/constants/languages.ts`, ~180 languages, each with a
`code`, English `name`, and `nativeName`), rendered as a searchable dropdown
(`apps/dashboard/src/shared/presentation/ui/LanguageSelect`) — an admin can tag lyrics with *any*
of them, not a fixed set. The public filter must search the same space, or a real record's
language could be unfindable in the filter.

This codebase's frontend app doesn't have that list yet — only a small, unrelated **UI-language**
`LANGUAGE_LIST` (`src/shared/presentation/constants/languages.ts`, just `fr`/`en`, the site's own
interface language — a different concept from lyrics *content* language, already discussed in
[03-frontend-module.md](../03-frontend-module.md)). This spec ports the dashboard's content-language
list into the frontend app as its own constant, then builds the filter as a **searchable** control
— a plain `DropdownMenu` doesn't scale to ~180 items — mirroring
`src/shared/presentation/components/ui/CountrySelect`'s exact internals (the existing precedent for
"searchable dropdown over a large static list": local `query` state, `useDismiss` to close on
outside click, autofocused search input, filtered results, a compound `Trigger` + `Menu` split).

**`src/shared/infrastructure/constants/contentLanguages.ts`** (new — ports the dashboard's list
verbatim; this is lyrics **content** language, unrelated to the site's UI language toggle)

```ts
export interface IContentLanguage {
    code: string;
    name: string;
    nativeName: string;
}

/**
 * Full ISO 639-1 language list, for tagging content by the language it's actually
 * written in (e.g. a lyrics page) — distinct from LANGUAGE_LIST in
 * shared/presentation/constants/languages.ts, which is this site's own UI language
 * toggle (fr/en only). Ported from the dashboard's identical list
 * (apps/dashboard/src/shared/infrastructure/constants/languages.ts) so both apps
 * agree on the same codes/names for the same backend field.
 */
export const CONTENT_LANGUAGE_LIST: IContentLanguage[] = [
    { code: "fr", name: "French", nativeName: "français, langue française" },
    { code: "en", name: "English", nativeName: "English" },
    { code: "ln", name: "Lingala", nativeName: "Lingála" }
    // ...the remaining ~180 entries, copied verbatim from the dashboard's LANGUAGE_LIST
];

const CONTENT_LANGUAGE_MAP = new Map(CONTENT_LANGUAGE_LIST.map((l) => [l.code, l]));

/**
 * Resolves an ISO 639-1 code to its language entry.
 *
 * @param code - ISO 639-1 two-letter code, or null/undefined.
 * @returns The matching language entry, or undefined when not found or absent.
 */
export function findContentLanguageByCode(code?: string | null): IContentLanguage | undefined {
    if (!code) return undefined;
    return CONTENT_LANGUAGE_MAP.get(code);
}
```

**`LyricsLanguageSelect.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
    CONTENT_LANGUAGE_LIST,
    findContentLanguageByCode
} from "@/shared/infrastructure/constants/contentLanguages";
import { CheckIcon, ChevronsUpDownIcon, FilterIcon } from "@/shared/presentation/components/ui/Icon";
import { Input } from "@/shared/presentation/components/ui/Input";
import { useDismiss } from "@/shared/presentation/hooks/useDismiss";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { useTranslation } from "react-i18next";

/**
 * Props for LyricsLanguageSelect.
 *
 * @interface LyricsLanguageSelectProps
 * @property {string} [value] - The active language filter (ISO 639-1 code), or undefined
 * for "all languages".
 * @property {(value: string | undefined) => void} onChange - Emits the selected code, or
 * undefined when "all languages" is chosen.
 */
export interface LyricsLanguageSelectProps {
    value?: string;
    onChange: (value: string | undefined) => void;
}

/**
 * LyricsLanguageSelect
 *
 * @description
 * Searchable language filter for the lyrics feed, over the full ISO 639-1 list — the
 * same list the dashboard's lyrics form uses to tag content, so every real record's
 * language is always findable here. Mirrors CountrySelect's searchable-popover
 * internals; styled as a filter trigger (ArticlesToolbarCategorySelect's shape)
 * rather than a form field.
 */
export function LyricsLanguageSelect({ value, onChange }: LyricsLanguageSelectProps) {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const selected = findContentLanguageByCode(value);
    const isActive = Boolean(selected);

    const results = useMemo(() => {
        const search = query.trim().toLowerCase();
        if (!search) return CONTENT_LANGUAGE_LIST;
        return CONTENT_LANGUAGE_LIST.filter(
            (lang) =>
                lang.name.toLowerCase().includes(search) ||
                lang.nativeName.toLowerCase().includes(search) ||
                lang.code.toLowerCase().includes(search)
        );
    }, [query]);

    const close = useCallback(() => setOpen(false), []);
    useDismiss(open, close, containerRef);

    useEffect(() => {
        if (open) searchRef.current?.focus();
    }, [open]);

    const select = (code: string | undefined) => {
        onChange(code);
        setOpen(false);
        setQuery("");
    };

    return (
        <div
            ref={containerRef}
            className="relative"
        >
            <button
                type="button"
                onClick={() => setOpen((previous) => !previous)}
                className={cn(
                    "flex h-10 w-full items-center gap-2 rounded-md px-3 font-medium text-sm sm:w-auto",
                    isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-foreground hover:bg-muted/80"
                )}
            >
                <FilterIcon className="size-4 shrink-0" />
                <span className="truncate">
                    {selected ? selected.name : t("lyrics.languageFilter.all")}
                </span>
                <ChevronsUpDownIcon className="ml-auto size-4 shrink-0 opacity-70" />
            </button>

            {open && (
                <div className="absolute z-10 mt-2 w-64 rounded-md border bg-popover p-2 shadow-md">
                    <Input
                        ref={searchRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("lyrics.languageFilter.search")}
                        className="mb-2"
                    />
                    <div className="max-h-72 overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => select(undefined)}
                            className="flex w-full items-center gap-2 rounded-sm p-2 text-left text-sm hover:bg-accent"
                        >
                            {t("lyrics.languageFilter.all")}
                            {!value && <CheckIcon className="ml-auto size-4 shrink-0" />}
                        </button>
                        {results.map((lang) => (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => select(lang.code)}
                                className="flex w-full items-center gap-2 rounded-sm p-2 text-left text-sm hover:bg-accent"
                            >
                                <span className="truncate">{lang.name}</span>
                                <span className="truncate text-muted-foreground">{lang.nativeName}</span>
                                {value === lang.code && <CheckIcon className="ml-auto size-4 shrink-0" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
```

Language **names** (`"French"`, `"Lingala"`, …) come from the canonical list's own `name`/
`nativeName` fields, the same way the dashboard already displays them (`getLanguageName`) — they
are **not** run through `t()` per-language. Only two UI strings need translation:
`lyrics.languageFilter.all` ("All languages" / "Toutes les langues") and
`lyrics.languageFilter.search` (the search input's placeholder). Translating ~180 language names
into fr/en would be its own large, separate effort with no clear payoff (a French speaker doesn't
need "Lingala" translated — it's already displayed in both English and native form).

## Route

**`app/(public)/lyrics/page.tsx`**

```tsx
import type { Metadata } from "next";
import { LyricsFeedContainer } from "@/modules/lyrics/presentation/containers/LyricsFeedContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * Props for the lyrics listing route.
 *
 * @interface LyricsPageProps
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - The route
 * query params promise carrying the optional `search` and `language` filters.
 */
interface LyricsPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * firstParam
 *
 * @description
 * Normalizes a query-param value to a single string. A repeated param arrives as an array,
 * from which the first entry is taken; a missing param stays undefined.
 *
 * @param value - The raw query-param value.
 * @returns The single string value, or undefined when absent.
 */
function firstParam(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

/**
 * generateMetadata
 *
 * @description
 * Sets the lyrics listing's title from the active server language.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("lyrics.pageTitle") };
}

/**
 * LyricsPage
 *
 * @description
 * The public lyrics listing (`/lyrics`): a search box and language filter above an
 * infinite-scrolling grid of every lyrics page. Awaits the route query params and seeds
 * the feed's search term and language filter from them, so deep links like
 * `/lyrics?search=eloko&language=ln` open pre-filtered.
 *
 * @param searchParams - The route query params promise carrying the optional filters.
 */
export default async function LyricsPage({ searchParams }: LyricsPageProps) {
    const params = await searchParams;

    return (
        <LyricsFeedContainer
            initialSearch={firstParam(params.search)}
            initialLanguage={firstParam(params.language)}
        />
    );
}
```

## Task checklist

- [ ] Add `useLyricsFeed.ts`.
- [ ] Add `src/shared/infrastructure/constants/contentLanguages.ts` (ported from the dashboard's
  `LANGUAGE_LIST`, ~180 entries — copy verbatim, don't re-derive).
- [ ] Add `LyricsCard`, `LyricsGrid` (+ `.Empty`/`.Error`/`.EndOfFeed`/`.Loading` siblings),
  `LyricsSearchInput`, `LyricsLanguageSelect`.
- [ ] Add `LyricsFeedContainer`.
- [ ] Add `app/(public)/lyrics/page.tsx`.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
- [ ] Load `/lyrics` in both languages; confirm the grid renders, search filters it (debounced),
  the language filter narrows the list correctly, both filters combine (search + language
  together), clearing restores the full list, infinite scroll loads further pages, and the
  empty/error states render correctly (simulate by searching for nonsense text / stopping the
  backend).
- [ ] Every card links to `/lyrics/{slug}` and resolves to the matching detail page.
