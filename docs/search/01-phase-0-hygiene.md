# Phase 0 — Hygiene

Ships before any backend work. Removes the duplicate-field defect and most of the query
load without touching the database.

## Checklist

- [x] `useDebouncedValue` hook in `shared/presentation/hooks/` — **already exists**
- [x] Both feed containers debounce at 300ms — **already done**
- [x] 2-character floor before a request is issued
- [x] Settled term written to the URL with `replace`
- [x] Toolbar placeholders relabelled to "filter"
- [x] `HeaderSearch` hidden on `/articles` and `/videos`

---

## The debounce hook already exists

`shared/presentation/hooks/useDebouncedValue.ts` is in place and both feed containers
already use it at 300ms:

```tsx
const debouncedSearch = useDebouncedValue(search, 300);
```

An earlier draft of this spec claimed the toolbars fired a request per keystroke. That
was wrong: `ArticlesToolbar.SearchInput` does emit on every keystroke, but the
container debounces before querying, so the request count was already correct.

---

## The actual defects

### 1. No minimum length

A one-character term is sent to the API, where it matches most of the corpus for no
information and costs a sequential scan.

### 2. No URL state

```tsx
const [search, setSearch] = useState(initialSearch);
```

The term is seeded from the URL once and never written back. A filtered view is
therefore not shareable, not bookmarkable, and the back button does not undo it.

---

## The fix

The container keeps the input responsive with local state, debounces what it *queries*
with, and mirrors the settled term into the URL.

```tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";

const MIN_QUERY_LENGTH = 2;

export function ArticlesFeedContainer({ initialSearch = "", initialCategoryId, initialTagSlug }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const [draft, setDraft] = useState(initialSearch);
    const settled = useDebouncedValue(draft);

    // A term below the floor matches most of the corpus for no information, so it
    // is treated as no filter at all rather than as a query.
    const search = settled.trim().length >= MIN_QUERY_LENGTH ? settled.trim() : "";

    // Mirror the settled term into the URL so a filtered view is shareable and the
    // back button undoes it. `replace` keeps one history entry per search, not per
    // keystroke.
    useEffect(() => {
        const next = new URLSearchParams(params);

        if (search) next.set("search", search);
        else next.delete("search");

        router.replace(`${pathname}?${next}`, { scroll: false });
    }, [search, pathname, params, router]);

    const feed = useArticlesFeed({ search, categoryId: initialCategoryId, tagSlug: initialTagSlug });

    return (
        <>
            <ArticlesToolbar
                search={draft}
                onSearchChange={setDraft}
                /* … */
            />
            {/* … */}
        </>
    );
}
```

Two details that matter:

- **`draft` versus `search`.** The input is bound to `draft` so typing stays instant;
  only `search` reaches the query and the URL.
- **`replace`, not `push`.** Pushing per settled term would make the back button walk
  backwards through every partial query.

`VideosFeedContainer` takes the identical change.

---

## Relabelling

The toolbar field filters the list on screen; it is not site search. Catalog changes:

```ts
// src/modules/articles/presentation/i18n/locales/fr/articles.ts
toolbar: {
    searchPlaceholder: "Filtrer dans les articles…"
}
```

| Key | fr | en |
| --- | --- | --- |
| `articles.toolbar.searchPlaceholder` | Filtrer dans les articles… | Filter these articles… |
| `videos.toolbar.searchPlaceholder` | Filtrer dans les vidéos… | Filter these videos… |

---

## Hiding the duplicate

Until `/search` exists, the global field has no destination worth keeping on a page
that already owns a search. Hide it where it duplicates:

```tsx
"use client";

import { usePathname } from "next/navigation";

import { ARTICLES_PATH, VIDEOS_PATH } from "@/shared/presentation/constants/paths";

/**
 * Routes that own an in-list search field, where the global header field would be the
 * second search box on the same screen.
 */
const ROUTES_WITH_OWN_SEARCH = [ARTICLES_PATH, VIDEOS_PATH];

export function HeaderSearch({ className }: HeaderSearchProps) {
    const pathname = usePathname();

    if (ROUTES_WITH_OWN_SEARCH.includes(pathname)) return null;

    /* … */
}
```

Exact match, not `startsWith`: `/articles/[slug]` is a detail page with no toolbar, so
the global field belongs there.

Phase 3 replaces this list with a single `/search` exclusion once the header becomes a
true entry point; see [05-header-integration.md](05-header-integration.md).
