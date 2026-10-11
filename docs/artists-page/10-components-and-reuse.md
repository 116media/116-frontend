# 10 — Components: Reuse vs Build

What this feature borrows, what it must build, and where each piece lands under the folder rules
in `AGENTS.md` (`docs/refactoring-architecture/component-folder-structure/`).

> **Scope history.** This inventory was sized for three tabs, grew for an expanded scope that
> added merch, tour and guest credits, and is now sized for **three tabs over five content surfaces**
> ([07](07-artist-detail-tabs.md), [08](08-catalog-sections.md)) plus an identity block and a
> social row in the hero ([06](06-artist-detail-hero.md)). The `showArtist` rule is per-surface,
> not per-module.

## Reuse

| Component | Source | Used by |
|---|---|---|
| `EmptyState` | `shared/presentation/components/ui/EmptyState` | every empty / 404 state ([09](09-loading-empty-error.md)) |
| `FeedError` | `shared/presentation/components/ui/FeedError` | index and tab error states |
| `StateRenderer` | `shared/presentation/components/ui/StateRenderer` | every loading→error→empty→render branch |
| `Skeleton` | `shared/presentation/components/ui/Skeleton` | all `.Loading.tsx` files |
| `Tabs` | `shared/presentation/components/ui/Tabs` | the tab bar's ARIA and motion layer |
| `Avatar` / `AvatarFallback` | `shared/presentation/components/ui/Avatar` | the inside of `ArtistAvatar` |
| `LyricsCard` | lyrics module | every song section in `Musique` ([08](08-catalog-sections.md)) |
| `VideoCard.Vertical` | videos module | the videos tab |
| `ArticleCard.Feed` | `modules/articles/presentation/components/cards/ArticleCard` | the `Actualités` tab |
| `next/image` | — | every avatar and release cover |

`StateRenderer` already encodes the exact branch order [09](09-loading-empty-error.md) describes
(loading → error → empty → render). Nothing in this feature should hand-roll that ternary chain.

### No `ArtistNewsCard` — the articles module already owns that card

`ArticleCard` exists today as a **compound** (`ArticleCard.Feed`, `ArticleCard.Horizontal`) over
`IArticleSummaryEntity`, carrying cover, byline, meta row, title and engagement bar. The
`Actualités` tab renders `ArticleCard.Feed` unchanged — [08](08-catalog-sections.md) already says
"reuse, do not rebuild", and an `ArtistNewsCard` would be the same fork the `showArtist` argument
below rejects.

If the artist grid ever needs a denser row, the correct move is a **new variant in the articles
module's compound** (`ArticleCard.Compact`), added by that module's owner — not a card in
`modules/artists/`. The reuse ladder promotes; it never copies.

### The one shared component that does *not* fit

`InfiniteScrollFooter` is **not** reusable here. It is a sentinel-driven auto-loader — an
`IntersectionObserver` that fires `onLoadMore` when scrolled into view. [02](02-inspiration-benchmark.md)
and [04](04-artists-index-page.md) explicitly reject infinite scroll for this feature.

Build a sibling: **`LoadMoreFooter`** in `shared/presentation/components/ui/LoadMoreFooter`.

```tsx
export interface LoadMoreFooterProps {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    label: string;
    loadingLabel: string;
    endLabel: string;
}
```

Same prop shape minus the sentinel, plus the button's own labels. It goes to `shared/` from the
start rather than starting in the artists module: it is entity-agnostic by construction and is the
missing half of a pair that already lives in `shared/`, which is the reuse-ladder's stated
exception for components designed as shared library pieces.

**Do not** add a `mode="button" | "sentinel"` flag to `InfiniteScrollFooter`. The two have
different a11y contracts (a button owns focus and must not lose it — see
[11](11-accessibility-and-responsive.md); a sentinel is `aria-hidden`), different pending
presentations, and different failure modes. One component with a flag that swaps all three is two
components sharing a filename.

## `showArtist` — a prop, not a fork

[08](08-catalog-sections.md) requires the artist name to be suppressed on cards rendered inside
that artist's own sections. That is a `showArtist={false}`-style prop on the existing card, and
explicitly not an `ArtistLyricsCard` copy.

Why the prop wins, concretely:

- The card is not just markup. It carries the detail-route link, `next/image` `sizes`, date
  formatting, and engagement affordances. A fork duplicates all of it and inherits none of its
  future fixes — the second copy is already stale the first time the original changes.
- The suppression is **one line of conditional rendering** against data the card already receives.
  A fork is a folder, a barrel, a props interface, and a test file to express that one line.
- `AGENTS.md`'s reuse ladder says *promote when a second consumer appears*, never *copy*. A fork is
  the failure mode the ladder exists to prevent.
- Two near-identically named card components is a permanent import-autocomplete hazard.

The prop defaults to `true`, so every existing call site is untouched.

### Decided per-surface, even though every surface currently agrees

The prop is decided **by the section that renders the card**, and passed explicitly at every call
site inside the profile:

| Surface | `showArtist` | Why |
|---|---|---|
| Chansons populaires | `false` | It is this artist's own catalog |
| Dernières chansons | `false` | Same |
| Albums / Mixtapes | n/a | `ReleaseCard` has no artist line at all |
| Vidéos | `false` | This artist's own videos (currently a no-op — see caveat 2) |
| Actualités | n/a | `ArticleCard.Feed` shows an author byline, not an artist credit; it is untouched |

Every song surface is `false`, which makes "just set it once on the container" look reasonable. It
is not, and the reason is worth keeping: an earlier scope carried an `En featuring` section whose
entire point was showing *whose* song the artist guested on, at `showArtist={true}`. That section
was cut, but the shape of the mistake is not hypothetical — a container-level default would have
broken it invisibly, because the cards still render, just uselessly.

Two rules follow:

- **No section inherits the value.** It is passed at the call site, per section.
- **The default stays `true`.** Suppression is the exception, opted into per section; a `false`
  default would leak name-less cards into every other consumer of the card.

1. `LyricsCard` does not exist yet — the lyrics module is still design-only
   ([`../lyrics-page/`](../lyrics-page/)). `showArtist` must be part of that card's **original**
   API, not retrofitted. Raise it there before it ships.
2. `VideoCard.Vertical` as it exists today renders thumbnail, title, date, rating and category —
   **no artist name**. The suppression rule is therefore currently vacuous for videos. Add the prop
   only if and when the card starts showing an artist; do not add a dead prop now.

## New components

Module root: `src/modules/artists/presentation/`. Route folder is `/artistes` (French, locked in
[01](01-overview.md)); the module folder is `artists`, matching `videos` / `articles` / `shorts`.

All of these are **presentational** unless marked otherwise. Every folder is a leaf: the component
file, `index.ts`, optional `types.ts`, optional flat dotted state files. No nesting, no `states/`
sub-folder.

### `containers/ArtistsIndexContainer`

Smart. Owns the artist-list infinite query keyed on `letter` / `q` / `page`, seeded from
`searchParams` ([05](05-alphabet-search-and-filters.md)). Composes the header, search input,
alphabet rail, grid, and footer.

```tsx
export interface ArtistsIndexContainerProps {
    initialLetter?: string;
    initialQuery?: string;
}
```

### `containers/ArtistProfileContainer`

Smart. Receives the server-fetched profile, owns the active-tab URL state and the tab registry
derived from the totals (which tabs render at all, which is default).

```tsx
export interface ArtistProfileContainerProps {
    artist: IArtistProfileEntity;
    initialTab: ArtistTab;
}
```

### `cards/ArtistCard`

Presentational. The whole card is one `<Link>` — one tab stop, no inner button
([04](04-artists-index-page.md)).

```tsx
export interface ArtistCardProps {
    artist: IArtistSummaryEntity; // slug, name, avatarUrl, isVerified, contentCount
}
```

Files: `ArtistCard.tsx`, `index.ts`. The verified badge and count line are single-use and stay
inline (unexported) in the file, per the private-sub-component rule.

### `media/ArtistAvatar`

Presentational. The `Avatar` + `next/image` + initials-fallback triple, shared verbatim by the card
and the hero — [06](06-artist-detail-hero.md) requires it be the *identical* component, not two
that look alike.

```tsx
export interface ArtistAvatarProps {
    name: string;
    size: "sm" | "lg";          // 1:1, card vs hero
    src?: string | null;
    priority?: boolean;         // hero only — it is the route's LCP element
    className?: string;
}
```

Bucket is `media/`, not `cards/`: it is an image primitive with no card semantics, and putting it
in `cards/` implies it is one. Initials derivation and the deterministic background hash are pure
functions and live in `presentation/utils/artist/artist.utils.ts`, not in the component folder —
they are also needed by tests and potentially by other surfaces.

### `navigation/AlphabetRail`

Presentational, controlled.

```tsx
export interface AlphabetRailProps {
    activeLetter?: string;                 // undefined = "Tous"
    availableLetters?: string[];           // absent → every letter enabled ([16] 1b)
    onSelect: (letter?: string) => void;
}
```

`availableLetters` is optional on purpose: [16](16-backend-gaps-and-contracts.md) marks it a
degradable v1 gap, and the component must render correctly without it. The 27 letter definitions
are a folder-local constant map — the R13 carve-out in `AGENTS.md` — not a module constant, since
nothing else consumes them.

### `fields/ArtistSearchInput`

Presentational. Debouncing (300ms) and the 2-character minimum ([05](05-alphabet-search-and-filters.md))
live in the container's hook, not here — a field that owns a timer cannot be driven from the URL,
which is where this state actually lives.

```tsx
export interface ArtistSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}
```

### `lists/ArtistGrid`

Presentational, `children`-based — the same shape as the existing `FavoriteArticlesGrid`. Owns the
2/3/4/5/6 column definition in one place so the grid and its skeleton cannot drift.

Files: `ArtistGrid.tsx`, `ArtistGrid.Loading.tsx`, `ArtistGrid.Empty.tsx`, `index.ts`.

### `sections/ArtistHero`

Presentational. Avatar, `<h1>`, verified badge, clamped bio with its expand toggle, stat row.

```tsx
export interface ArtistHeroProps {
    artist: IArtistProfileEntity;
    onSelectTab: (tab: ArtistTab) => void; // stat entries double as tab navigation ([06])
}
```

Files: `ArtistHero.tsx`, `ArtistHero.Loading.tsx`, `index.ts`. The bio toggle holds the only local
state in the file and stays inline.

The hero now composes two further children ([06](06-artist-detail-hero.md)). Both get their own
folder rather than staying inline, because both are non-trivial conditional renderers with their own
test surface — the private-sub-component rule covers *single-use markup*, not single-use logic.

### `sections/ArtistIdentityBlock`

Presentational. Real name, aliases, birthdate, hometown ([06](06-artist-detail-hero.md), Gap 7).

```tsx
export interface ArtistIdentityBlockProps {
    identity: IArtistIdentity;  // realName?, aliases, birthdate? (YYYY-MM-DD), hometown?
    stageName: string;          // needed to suppress a duplicate real name
}
```

Everything about this component is conditional, which is why it is not four lines inside the hero:

- **Every field is independently optional and omitted entirely when null** — never a label with an
  em-dash. When nothing survives the filter the component renders `null`, not an empty container
  with margin.
- **`realName` is suppressed when it equals `stageName`**, which is why the stage name is a prop
  rather than the component reading it from the entity.
- **`birthdate` is date-only** — it never goes through `new Date()`, which would shift the day
  across timezones. Age is derived at render, never stored. Parsing lives in
  `presentation/utils/artist/artist.utils.ts`, not inline in the component.
- **`aliases` is `string[]`**; an empty array renders nothing, not an empty middot row.

### `social/ArtistSocialLinks`

Presentational. The platform-keyed icon row ([06](06-artist-detail-hero.md), Gap 8).

```tsx
export interface ArtistSocialLinksProps {
    links: IArtistSocialLink[];  // { platform, url }
    artistName: string;          // for the per-link accessible name
}
```

- Renders nothing when the array is empty. No "no socials" placeholder.
- **Unknown platform values are skipped, not rendered generically.** The icon map is a folder-local
  `Record<EnumSocialPlatform, Icon>` — the R13 carve-out — and a lookup miss drops the link, so the
  backend can add a platform before the frontend knows about it ([16](16-backend-gaps-and-contracts.md)).
- Each link is icon-only with a per-platform accessible name (*"Instagram de Fally Ipupa"*), which
  is why `artistName` is a prop. Never a bare icon with no name.
- `target="_blank"` + `rel="noopener noreferrer"` and an external affordance. **Not `sponsored`** —
  a social profile is not a commercial link; that distinction is spelled out in
  [13](13-seo-and-metadata.md).
- `url` is navigate-only. It is never parsed for a handle to display.

### `navigation/ArtistTabs`

Presentational wrapper over the shared `Tabs`. Renders only the tabs it is given, and renders
**nothing** when given one ([07](07-artist-detail-tabs.md)).

```tsx
export interface ArtistTabsProps {
    tabs: ArtistTab[];              // already filtered to non-empty, in fixed order
    activeTab: ArtistTab;
    onChange: (tab: ArtistTab) => void;
    children: ReactNode;
}
```

### `sections/` — one island container per surface

**Island containers** — each owns its own paginated query and stays in `sections/`, per the
island-container carve-out in `AGENTS.md`. This is what makes per-section loading, per-section
errors, and per-tab caching in [07](07-artist-detail-tabs.md) and [09](09-loading-empty-error.md)
possible; hoisting the queries into `ArtistProfileContainer` would couple every surface's failure to
every other surface's render.

One per surface, matching [08](08-catalog-sections.md) one-to-one:

| Section | Tab | Query |
|---|---|---|
| `ArtistPopularSongsSection` | `music` | `sort=views`, top 10, unpaginated |
| `ArtistLatestSongsSection` | `music` | `sort=publishedAt`, seeded from the profile payload |
| `ArtistReleasesSection` | `music` | one component, rendered twice — `type=Album` and `type=Mixtape` |
| `ArtistVideosSection` | `videos` | seeded from the profile payload |
| `ArtistNewsSection` | `news` | articles tagged to the artist |

Each folder: `<Section>.tsx`, `<Section>.Loading.tsx`, `index.ts`.

Notes that keep the count down:

- **`ArtistReleasesSection` is rendered twice, not duplicated.** Albums and mixtapes differ only in
  a filter and a heading ([08](08-catalog-sections.md)); the section takes the release type and its
  heading key as props.
- Sections whose gap has not shipped are simply not built yet. Every one of them degrades by not
  rendering ([16](16-backend-gaps-and-contracts.md)).

### `navigation/ArtistSectionJumpBar`

Presentational. The in-page anchor row at the top of the `Musique` panel
([07](07-artist-detail-tabs.md)).

```tsx
export interface ArtistSectionJumpBarProps {
    sections: ArtistMusicSection[]; // already filtered to non-empty, in fixed order
}
```

Hard constraints, because this component is one careless prop away from being wrong:

- It renders `<nav aria-label>` containing plain `<a href="#albums">` anchors. **It must never
  carry `role="tab"`, `aria-selected`, or a roving tabindex** — it is in-page navigation inside a
  tabpanel, not a nested tablist, and [07](07-artist-detail-tabs.md) rejects nested tabs explicitly.
- It does **not** reuse the shared `Tabs`, for the same reason. Visual similarity is not a reason to
  borrow an ARIA pattern.
- It renders nothing at ≤ 2 sections.
- Anchor fragments are the stable English keys `#popular` `#latest` `#albums` `#mixtapes`
  only the labels are translated ([12](12-i18n.md)).

### `cards/ReleaseCard`

Presentational. Cover, name, release year. **Not a link** and not styled as one — no hover-lift, no
pointer cursor, no focus ring, not in the tab order ([08](08-catalog-sections.md)). Renders as a
`<div>`, not an `<a href="#">`.

```tsx
export interface ReleaseCardProps {
    release: IArtistReleaseEntity; // name, coverUrl, releaseYear, type
    variant?: "album" | "mixtape";  // heading context only — no visual fork
}
```

**The album/mixtape variant is not a visual variant.** [08](08-catalog-sections.md) is explicit that
mixtapes use "the same component, not a variant": one square cover, one name, one year, identical at
every breakpoint. The prop exists only so the card can carry the release type into its accessible
name and into analytics — if it ever starts changing the rendering, it has become the fork this doc
spends a section rejecting.

> **Resolved: `ReleaseCard`, not `AlbumCard`.** Earlier drafts of [03](03-information-architecture.md),
> [08](08-catalog-sections.md), [17](17-frontend-module.md) and [26](26-acceptance-criteria.md)
> called it `AlbumCard`; all four now say `ReleaseCard`. The same component renders the Albums
> *and* Mixtapes sections, and Gap 4 lands `EnumReleaseType { Album, Mixtape, EP, Single }`
> ([16](16-backend-gaps-and-contracts.md)) — a card named `AlbumCard` that renders mixtapes is
> already inaccurate, and would get worse if EP/Single are ever surfaced.

Ships only if [16](16-backend-gaps-and-contracts.md) Gap 3 ships.

## Placement summary

```text
src/modules/artists/presentation/
├── containers/
│   ├── ArtistsIndexContainer/
│   └── ArtistProfileContainer/
├── components/
│   ├── cards/       ArtistCard/  ReleaseCard/
│   ├── media/       ArtistAvatar/
│   ├── navigation/  AlphabetRail/  ArtistTabs/  ArtistSectionJumpBar/
│   ├── fields/      ArtistSearchInput/
│   ├── social/      ArtistSocialLinks/
│   ├── lists/       ArtistGrid/
│   └── sections/    ArtistHero/  ArtistIdentityBlock/
│                    ArtistPopularSongsSection/  ArtistLatestSongsSection/
│                    ArtistReleasesSection/
│                    ArtistVideosSection/  ArtistNewsSection/
├── hooks/
├── i18n/
├── utils/           artist/
└── constants/
```

Plus one shared addition: `shared/presentation/components/ui/LoadMoreFooter/`.

Fifteen new components and one shared primitive, against five reused ones and two existing cards
that gain a prop. That is up from nine, and the growth is almost entirely the new `Musique`
sections — the index page's inventory is unchanged. Full module layout, including the domain and
data layers, in [17](17-frontend-module.md).

**A third of them are gap-blocked.** `ReleaseCard`, `ArtistNewsSection`, `ArtistIdentityBlock`
and `ArtistSocialLinks` each wait on a gap
([16](16-backend-gaps-and-contracts.md) Gaps 3–5, 7 and 8). Sequencing in
[24](24-implementation-plan.md); each absent component degrades by its surface simply not rendering,
which is why none of them needs a placeholder.

## Reconciliation with [17](17-frontend-module.md) and [21](21-performance-and-pagination.md)

[17](17-frontend-module.md) enumerates the same component set with different names and two
different bucket choices. They are the same design; the divergences below need one decision each
before implementation, and [17](17-frontend-module.md) is the right doc to hold the outcome since
it owns the module tree.

| Here | [17](17-frontend-module.md) | Note |
|---|---|---|
| `ArtistsIndexContainer` | `ArtistsDirectoryContainer` | naming only |
| `ArtistTabs` (navigation) | `ArtistTabBar` (navigation) | naming only |
| `ArtistSearchInput` (fields) | `ArtistSearchField` (navigation) | it is a form control, so `fields/` |
| `ArtistGrid` (lists) | `ArtistsGrid` (sections) | `lists/` exists in this repo and is the narrower fit |
| six per-surface sections | one `ArtistCatalogSection` + `ArtistTabPanelContainer` | The `Musique` stack settles this: four jump-bar-driven sections that load, fail and paginate independently are not one generic catalog section. Islands win |
| `ReleaseCard` | not listed | named for `EnumReleaseType`, not for albums alone — see the note above |
| bio inline in `ArtistHero` | `ArtistBio` in `fields/` | a folder is justified only if the toggle is reused |
| `ArtistAvatar` in `media/` | not listed | required by [06](06-artist-detail-hero.md) — the card and hero must share one component |

The substantive one: [17](17-frontend-module.md) and [21](21-performance-and-pagination.md) both
say to reuse `InfiniteScrollFooter` "driven by a click instead of a sentinel". That component
cannot be click-driven without changing its behaviour, its markup and its a11y contract at once —
see the argument above. `LoadMoreFooter` is a ~30-line sibling; adding a mode flag to the existing
one costs the same and leaves a component whose name describes half of what it does.
