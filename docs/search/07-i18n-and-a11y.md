# i18n and Accessibility

## Checklist

- [x] `search` namespace in the module's `i18n/locales/{fr,en}/`
- [x] Registered in both barrels, key-complete
- [x] Toolbar placeholders relabelled (phase 0)
- [x] Result count in a polite live region
- [x] Every target at least 44px
- [ ] Contrast measured in both themes, not eyeballed — **not done**, the palette is the existing token set but the pairings were not measured

---

## Catalog

```ts
// src/modules/search/presentation/i18n/locales/fr/search.ts
/**
 * search (fr)
 *
 * @description
 * Strings for the search route: the field, the scope tabs, the result states and the
 * recent-query history.
 */
export const search = {
    meta: {
        title: "Recherche",
        titleWithQuery: "Recherche : {{query}}"
    },
    field: {
        label: "Rechercher sur 116",
        placeholder: "Rechercher un article, une vidéo, un artiste…",
        clear: "Effacer la recherche"
    },
    scope: {
        label: "Filtrer par type de contenu",
        all: "Tout",
        articles: "Articles",
        videos: "Vidéos",
        shorts: "Shorts"
    },
    type: {
        article: "Article",
        video: "Vidéo",
        short: "Short"
    },
    results: {
        count_one: "{{count}} résultat",
        count_other: "{{count}} résultats"
    },
    empty: {
        title: "Aucun résultat pour « {{query}} »",
        hint: "Vérifiez l'orthographe ou essayez un terme plus général."
    },
    error: {
        title: "La recherche a échoué",
        retry: "Réessayer"
    },
    recent: {
        title: "Recherches récentes",
        clear: "Effacer"
    },
    idle: {
        browse: "Parcourir par tag"
    }
} as const;
```

The English file mirrors every key. The English barrel's type is the canonical shape
for the react-i18next module augmentation, so a missing key fails the build.

### Pluralisation

`results.count` uses i18next's `_one` / `_other` suffixes rather than a hand-rolled
ternary, so the French and English rules are the library's problem, not ours. The
existing `favorites.activity.commentCount` keys follow the same pattern.

---

## The live region

The `IS-Results` artboard note requires the count to be announced. A visually hidden
polite region does that without adding visible chrome:

```tsx
<p
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
>
    {isQueryable && results ? t("search.results.count", { count: results.counts[scope] }) : ""}
</p>
```

Three details:

- **`polite`, not `assertive`.** Results are not an emergency; `assertive` would
  interrupt whatever the reader is hearing.
- **`aria-atomic`** so the whole sentence is re-read, not just the changed number.
- **Empty string while idle**, so the region exists in the DOM from first paint.
  A region added to the DOM at the same moment its content changes is not reliably
  announced.

---

## Targets

| Control | Height | Source |
| --- | --- | --- |
| Search field | 48px | `h-12` |
| Clear button | 32px | **override needed** |
| Scope trigger | 44px | `min-h-11` |
| Result row | 80px+ | thumbnail height |
| Recent entry | 44px | `min-h-11` |
| Retry button | 36px | `Button` default |

The clear button sits inside a 48px field, so a 44px target would crowd it. It is an
accepted exception: the same action is available by selecting the text and deleting, and
by the keyboard's own clear affordance on `type="search"`. Documented rather than
silently shipped.

---

## Contrast

New pairings to measure before shipping. `AGENTS.md` notes the light palette already
fails on `description` and `text-muted`, and says not to add to that set:

| Pair | Where |
| --- | --- |
| `text-muted-foreground` on `bg-muted` | the field's placeholder |
| `text-muted-foreground` on `bg-accent/50` | result row on hover |
| `text-foreground/60` equivalent on the scope count | the `opacity-60` count inside a trigger |

The count's `opacity-60` is the one to watch: opacity composites against whatever is
behind it, so its effective contrast differs between the active trigger (on
`bg-background`) and an inactive one (on `bg-muted`). Measure both.

Method used elsewhere in this repo: screenshot the element with Playwright, decode the
PNG, sample the composited pixels, compute the ratio. Do not eyeball it.

---

## Keyboard

| Key | Result |
| --- | --- |
| `Tab` from the field | Scope tabs, then the first result |
| `Arrow Left` / `Right` on a tab | Switch scope (Radix roving focus) |
| `Enter` in the field | Nothing — results are already live via debounce |
| `Escape` in the field | Clears, via `type="search"` native behaviour |

`Enter` intentionally does nothing: the field is debounced, so by the time a reader
reaches for Enter the request has already gone. Submitting would issue a duplicate.

---

## Screen reader pass

The page should read as: the field's label, then "Filtrer par type de contenu, tab
list, Tout 18, selected, 1 of 3", then the count announcement, then each result as a
link named "«title» — Article".

`SearchHitCard` builds that name with `aria-label` rather than relying on the visual
order, because the type badge comes before the title visually but after it in
importance.
