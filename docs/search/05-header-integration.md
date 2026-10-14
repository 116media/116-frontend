# Header Integration

## Checklist

- [ ] `HeaderSearch` submits to `/search?q=`
- [ ] `HeaderSearch` hidden on `/search`
- [ ] Phase 0's `/articles` and `/videos` exclusions removed
- [ ] Desktop magnifier in `DesktopNav` links to `/search`
- [ ] Field clears on navigation

---

## The destination changes

Phase 0 points the header field at `/articles?search=` because that is the only route
that can answer. Once `/search` exists it becomes the destination, and the
`ROUTES_WITH_OWN_SEARCH` exclusion list collapses to one entry.

```diff
-/**
- * Routes that own an in-list search field, where the global header field would be the
- * second search box on the same screen.
- */
-const ROUTES_WITH_OWN_SEARCH = [ARTICLES_PATH, VIDEOS_PATH];
-
 export function HeaderSearch({ className }: HeaderSearchProps) {
     const pathname = usePathname();
-
-    if (ROUTES_WITH_OWN_SEARCH.includes(pathname)) return null;
+
+    // The search route owns the field itself; rendering this one too would put two
+    // search boxes on the same screen.
+    if (pathname === SEARCH_PATH) return null;
 
     const onSubmit = (event: FormEvent<HTMLFormElement>) => {
         event.preventDefault();
         const trimmed = query.trim();
-        if (trimmed.length === 0) return;
-        router.push(`${ARTICLES_PATH}?search=${encodeURIComponent(trimmed)}`);
+        if (trimmed.length < MIN_SEARCH_LENGTH) return;
+        router.push(`${SEARCH_PATH}?q=${encodeURIComponent(trimmed)}`);
     };
```

`/articles` and `/videos` keep their toolbar fields, and the header field is now
allowed to coexist with them: the two no longer do the same thing. One searches the
site, the other filters the list on screen, and the relabelling from phase 0 makes that
legible.

If that still reads as crowded in review, the fallback is to collapse the header field
to a magnifier below `lg` as well, matching the desktop treatment. Decide with the
rendered page, not in the spec.

---

## New path constant

```ts
// src/shared/presentation/constants/paths.ts
export const SEARCH_PATH = "/search";
```

---

## Minimum length

The header field applies the same 2-character floor as the route and the API, so
pressing Enter on a single character does nothing rather than navigating to a page that
immediately renders its idle state.

```ts
import { MIN_SEARCH_LENGTH } from "@/modules/search/presentation/constants/searchKeys";
```

A `shared/` layout importing from a module is the inverse of the usual direction. Two
options, decide at implementation:

1. Move `MIN_SEARCH_LENGTH` to `shared/presentation/constants/search.ts`, since three
   surfaces now share it.
2. Keep `HeaderSearch` in the search module as `SearchEntryField` and have the header
   import it, which is the same direction `Header` already takes for the mega menus.

**Option 2 is preferred**: it matches how `Header` already imports
`ArticlesMegaMenu` and `VideosMegaMenu` from their modules, and it keeps every search
concern in one module.

---

## Desktop

`DesktopNav` already renders a magnifier `Button` with no handler. It becomes a link:

```diff
-<Button size="icon" variant="ghost" aria-label="Rechercher">
-    <SearchIcon />
-</Button>
+<Button
+    asChild
+    size="icon"
+    variant="ghost"
+>
+    <Link
+        href={SEARCH_PATH}
+        aria-label={t("search.field.label")}
+    >
+        <SearchIcon />
+    </Link>
+</Button>
```

That button has been inert since it was written. This is the change that gives it a
job, and it is the desktop entry point to the same route the mobile field reaches.

---

## Clearing on navigation

`HeaderSearch` holds its draft in `useState`, which survives client-side navigation.
After submitting, the field would still show the previous term on the destination page.

```tsx
const pathname = usePathname();

// The draft is per-visit: a term left in the field after navigating reads as the
// state of the page the reader just landed on, which it is not.
useEffect(() => {
    setQuery("");
}, [pathname]);
```

---

## Result

| Surface | `< lg` | `>= lg` |
| --- | --- | --- |
| Header | Field → `/search?q=` | Magnifier → `/search` |
| `/search` | Owns the field | Owns the field |
| `/articles`, `/videos` | Header field + toolbar filter | Magnifier + toolbar filter |
| Everywhere else | Header field | Magnifier |

No screen renders two fields that do the same thing.
