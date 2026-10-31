# Components

## Checklist

- [x] Assembler with its state files — built as `SearchContainer`
- [x] Field — built as `SearchContainer.Field` and `SearchOverlay.Field`
- [x] `SearchScopeTabs`
- [x] Hit row — built as `SearchResultRow`
- [x] Result list — built as `SearchResultList`
- [x] Recent terms — built into `SearchOverlay.Idle`
- [x] `SearchResultList.Loading` and `.Empty`; the error state is inline in the container

---

## Folder layout

```text
src/modules/search/presentation/components/
├── pages/SearchPage/
│   ├── SearchPage.tsx
│   ├── SearchPage.Loading.tsx
│   ├── SearchPage.Empty.tsx
│   ├── SearchPage.Error.tsx
│   ├── types.ts
│   └── index.ts
├── sections/SearchResults/
├── sections/SearchRecent/
├── navigation/SearchScopeTabs/
├── fields/SearchField/
└── cards/SearchHitCard/
```

State files are flat beside the component, never in a `states/` subfolder.

---

## `SearchField`

```tsx
"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { SearchIcon, XIcon } from "@/shared/presentation/components/ui/Icon";

import type { SearchFieldProps } from "./types";

/**
 * SearchField
 *
 * @description
 * The search input: a rounded field with a leading magnifier and a clear control that
 * appears once there is text. Autofocused, because the route exists to be typed into.
 */
export function SearchField({ value, onChange }: SearchFieldProps) {
    const { t } = useTranslation();

    return (
        <div className="flex h-12 items-center gap-3 rounded-full bg-muted px-4 text-muted-foreground focus-within:ring-2 focus-within:ring-ring/50">
            <SearchIcon
                aria-hidden="true"
                className="size-5 shrink-0"
            />

            <input
                autoFocus
                id="search-query"
                type="search"
                value={value}
                enterKeyHint="search"
                aria-label={t("search.field.label")}
                placeholder={t("search.field.placeholder")}
                onChange={(event) => onChange(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />

            {value.length > 0 && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onChange("")}
                    aria-label={t("search.field.clear")}
                    className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                >
                    <XIcon className="size-4" />
                </Button>
            )}
        </div>
    );
}
```

`type="search"` is deliberate: it gives mobile keyboards a Search key, which
`enterKeyHint` reinforces.

---

## `SearchScopeTabs`

Built on the shared `Tabs` primitive, so the indicator, roving focus and
`aria-selected` all come from the existing component rather than being re-authored.

```tsx
"use client";

import { useTranslation } from "react-i18next";

import { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import { Tabs, TabsList, TabsTrigger } from "@/shared/presentation/components/ui/Tabs";

import type { SearchScopeTabsProps } from "./types";

/**
 * The scopes in render order, each with the i18n key for its label.
 */
const SCOPES = [
    { value: ESearchScope.All, label: "search.scope.all" },
    { value: ESearchScope.Articles, label: "search.scope.articles" },
    { value: ESearchScope.Videos, label: "search.scope.videos" },
    { value: ESearchScope.Shorts, label: "search.scope.shorts" }
] as const;

/**
 * SearchScopeTabs
 *
 * @description
 * Narrows the results by content type. Each tab carries its hit count from the same
 * response as the results, so switching scope never waits on a request.
 */
export function SearchScopeTabs({ scope, counts, onScopeChange }: SearchScopeTabsProps) {
    const { t } = useTranslation();

    return (
        <Tabs
            size="md"
            value={scope}
            onValueChange={(next) => onScopeChange(next as ESearchScope)}
        >
            <TabsList
                aria-label={t("search.scope.label")}
                className="flex w-full"
            >
                {SCOPES.map(({ value, label }) => (
                    <TabsTrigger
                        key={value}
                        value={value}
                        className="min-h-11 flex-1 font-bold uppercase tracking-wide"
                    >
                        {t(label)}
                        <span className="ml-1.5 tabular-nums opacity-60">{counts[value]}</span>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
```

The count sits inside the trigger so it is part of the tab's accessible name: screen
readers announce "Articles 11, tab, 2 of 3".

---

## `SearchHitCard`

One row for both content types, with guards rather than a union. A `cva` carries the
type badge so the variant lives on the component.

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { EContentType } from "@/shared/domain/enums/EContentType";
import { ClockIcon, StarIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { ARTICLES_PATH, VIDEOS_PATH } from "@/shared/presentation/constants/paths";

import type { SearchHitCardProps } from "./types";

/**
 * SearchHitCard
 *
 * @description
 * One search result: thumbnail, type badge, title, excerpt and the meta that applies
 * to its content type. Renders as a single link so assistive tech announces one name.
 */
export function SearchHitCard({ hit }: SearchHitCardProps) {
    const { t } = useTranslation();

    const isVideo = hit.type === EContentType.Video;
    const href = `${isVideo ? VIDEOS_PATH : ARTICLES_PATH}/${hit.slug}`;
    const typeLabel = t(isVideo ? "search.type.video" : "search.type.article");

    return (
        <Link
            href={href}
            aria-label={`${hit.title} — ${typeLabel}`}
            className="group flex gap-4 rounded-lg p-3 transition-colors hover:bg-accent/50"
        >
            <span className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
                {hit.imageUrl && (
                    <Image
                        fill
                        alt=""
                        sizes="128px"
                        src={hit.imageUrl}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex items-center gap-2">
                    <Tag
                        as="span"
                        size="sm"
                        variant="ghost"
                        className="bg-foreground/10 text-foreground"
                    >
                        {typeLabel}
                    </Tag>
                    {hit.categoryName && (
                        <span className="truncate text-muted-foreground text-xs">
                            {hit.categoryName}
                        </span>
                    )}
                </span>

                <span className="line-clamp-2 font-bold text-foreground text-sm">{hit.title}</span>

                {hit.excerpt && (
                    <span className="line-clamp-2 text-muted-foreground text-xs">{hit.excerpt}</span>
                )}

                <span className="flex items-center gap-3 text-muted-foreground text-xs">
                    <RelativeDate date={hit.publishedAt} />


                    {isVideo && hit.ratingAverage !== null && hit.ratingAverage > 0 && (
                        <span className="flex items-center gap-1">
                            <StarIcon className="size-3 fill-amber-400 text-amber-400" />
                            {hit.ratingAverage.toFixed(1)}
                        </span>
                    )}
                </span>
            </span>
        </Link>
    );
}
```

Every child is a `span`, not a `div`: the whole row is one `<a>`, and block elements
inside an inline-context anchor are invalid HTML.

---

## `SearchResults`

```tsx
"use client";

import { SearchHitCard } from "@/modules/search/presentation/components/cards/SearchHitCard";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { SearchResultsProps } from "./types";

/**
 * SearchResults
 *
 * @description
 * The ranked result list. Dims while a newer query resolves, so the previous results
 * stay readable instead of being replaced by a skeleton on every settled keystroke.
 */
export function SearchResults({ hits, isRefreshing }: SearchResultsProps) {
    return (
        <div
            aria-busy={isRefreshing}
            className={cn(
                "flex flex-col divide-y divide-outlined/50 transition-opacity",
                isRefreshing && "opacity-60"
            )}
        >
            {hits.map((hit) => (
                <SearchHitCard
                    hit={hit}
                    key={`${hit.type}-${hit.id}`}
                />
            ))}
        </div>
    );
}
```

The key is `type-id`: ids are unique per table, not across tables.

---

## State files

### `SearchPage.Empty.tsx`

```tsx
"use client";

import { useTranslation } from "react-i18next";

import { SearchXIcon } from "@/shared/presentation/components/ui/Icon";

import type { SearchPageEmptyProps } from "./types";

/**
 * SearchPage.Empty
 *
 * @description
 * Zero-result state. Names the query back to the reader so it is clear what was
 * searched, which matters when the term came from a shared link.
 */
export function SearchPageEmpty({ query }: SearchPageEmptyProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
            <SearchXIcon
                aria-hidden="true"
                className="size-10 text-muted-foreground"
            />
            <p className="font-bold text-foreground text-lg">{t("search.empty.title", { query })}</p>
            <p className="max-w-sm text-muted-foreground text-sm">{t("search.empty.hint")}</p>
        </div>
    );
}
```

### `SearchPage.Loading.tsx`

Skeleton rows in the result layout: a `h-20 w-32` thumbnail block beside three lines,
repeated six times. Mirrors `SearchHitCard` so nothing shifts when results land.

### `SearchPage.Error.tsx`

Uses the shared `Alert` with a retry `Button`. The query stays in the field and in the
URL, so retry re-runs the same search.

---

## Shorts rows

A short has no category and no description, so `categoryName` is `null` and `excerpt` is
`""`. Both are guarded above rather than rendered empty: an always-present wrapper would
hold its line-height and leave a gap where the text would be, so a shorts-only page would
read as a column of broken rows.

Its thumbnail is portrait where article and video covers are landscape. The row's fixed
`128px` media box crops it with `object-cover`, which is the intended behaviour here: the
row is a dense list item, not a shorts card.

Opening a short goes to the shorts viewer, not a `/videos/[slug]` page, so the row's
href comes from a per-type resolver.

**The scope tabs are built from `SCOPES`, so lyrics and artists each cost one entry plus
an i18n key when their scopes land.**

---

## Built names

The components exist under the module's own naming rather than the names sketched here,
and the overlay took on work this file gave to the page:

| This spec | Built as |
| --- | --- |
| `SearchPage` | `SearchContainer` |
| `SearchField` | `SearchContainer.Field`, `SearchOverlay.Field` |
| `SearchHitCard` | `SearchResultRow` |
| `SearchResults` | `SearchResultList` |
| `SearchRecent` | folded into `SearchOverlay.Idle` |
| — | `SearchOverlay`, `SearchOverlay.Idle`, `SearchScopeTabs` |

The error state is a paragraph in `SearchContainer` rather than its own file: it carries
one line and no layout, so a file for it would be indirection without content.
