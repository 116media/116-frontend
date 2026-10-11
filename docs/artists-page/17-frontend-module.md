# 17 — Frontend Module

> **Scope history.** This module was first sized for three tabs (lyrics / videos / albums), then
> for an expanded scope with merch, tour and guest credits, and is now sized for **five content
> surfaces** after those three were cut ([01](01-overview.md)) — plus an identity block and a
> socials row. Corrections from both passes are marked inline rather than deleted.

The `artists` module: where every file this feature adds lives, and why it lives there.

Structure is not invented here. It mirrors `src/modules/articles/` and `src/modules/videos/`
verbatim — four layers, the same file-naming, the same buckets. Anything below that differs from
those modules is a bug in this document, not a new convention.

## Layer layout

```
src/modules/artists/
├── domain/
│   └── entities/
│       ├── IArtistSummaryEntity.ts
│       ├── IArtistDetailEntity.ts            + ArtistTabKey, ArtistMusicSectionKey
│       ├── IArtistIdentityEntity.ts          real name / aliases / birthdate / hometown — Gap 7
│       ├── IArtistSocialLinkEntity.ts        platform-keyed outbound link — Gap 8
│       ├── IArtistAlbumEntity.ts             albums *and* mixtapes, split by releaseType — Gap 3+4
│       └── IArtistPage.ts
├── application/
│   ├── repositories/
│   │   └── artists.repository.port.ts
│   └── usecases/
│       ├── getartists.usecase.ts
│       ├── getartistbyslug.usecase.ts
│       ├── getartistlyrics.usecase.ts        takes `sort` — Populaires *and* Récentes
│       ├── getartistvideos.usecase.ts
│       ├── getartistreleases.usecase.ts      Gap 3 + 4 (was `getartistalbums`)
│       └── getartistnews.usecase.ts          Gap 5
├── infrastructure/
│   ├── mappers/
│   │   └── artists.mapper.ts
│   ├── repositories/
│   │   └── artists.repository.impl.ts
│   └── dependencies/
│       └── artists.dependencies.ts
└── presentation/
    ├── constants/
    │   └── artistKeys.ts
    ├── hooks/
    │   ├── useArtistsDirectory.ts
    │   ├── useArtistProfile.ts
    │   ├── useArtistLyrics.ts                (slug, sort) — one hook, two sections
    │   ├── useArtistVideos.ts
    │   ├── useArtistReleases.ts              (slug, releaseType) — Gap 3 + 4
    │   └── useArtistNews.ts                  Gap 5
    ├── containers/
    │   ├── ArtistsDirectoryContainer/
    │   ├── ArtistProfileContainer/
    │   ├── ArtistTabPanelContainer/
    │   └── ArtistMusicSectionContainer/      island container, one per Musique section
    ├── components/
    │   ├── cards/
    │   ├── sections/
    │   ├── navigation/
    │   ├── social/
    │   ├── fields/
    │   └── pages/
    ├── i18n/
    │   ├── index.ts
    │   └── locales/{en,fr}/
    └── utils/
        ├── artist/artist.utils.ts
        └── json-ld/artist-json-ld.utils.ts
```

Only `getartists` / `getartistbyslug` / `getartistlyrics` / `getartistvideos` are servable by the
backend today. Everything else is gated on a gap in [16](16-backend-gaps-and-contracts.md); the
files land with the gap, not before, and the corresponding section simply does not render until
then ([08](08-catalog-sections.md)).

**Correction:** the earlier tree had a single `getartistalbums.usecase.ts` marked "(Gap 3 only)".
Albums and mixtapes are the *same* query behind a release-type discriminator (Gap 4), so it is one
`getartistreleases` use case parameterised by `releaseType`, not two.

Layer rules, unchanged from every other module:

| Layer | May import | Never imports |
|---|---|---|
| `domain` | nothing | anything |
| `application` | `domain`, `shared/domain` | generated client, React |
| `infrastructure` | `application`, `domain`, generated client | React |
| `presentation` | `application` via the container cradle, `domain` types | the generated client, DTOs |

**Only `artists.repository.impl.ts` imports `116.api.ts`.** DTOs never reach a component; the
mapper is the boundary ([18](18-domain-entities-and-mappers.md)).

## Presentation buckets

**Correction to a common misreading of `AGENTS.md`:** `containers/` is a *sibling* of
`components/`, not a bucket inside it. Every existing module does this
(`modules/articles/presentation/containers/ArticlesFeedContainer/`), so this module does too.

```
presentation/containers/
├── ArtistsDirectoryContainer/      owns the index infinite query + letter/search state
├── ArtistProfileContainer/         owns the profile query, seeded by the server page
├── ArtistTabPanelContainer/        island container — one instance per tab, own query
└── ArtistMusicSectionContainer/    island container — one per Musique section, own query

presentation/components/
├── cards/
│   ├── ArtistCard/                 index grid tile (avatar, name, badge, count)
│   └── ReleaseCard/                albums *and* mixtapes tile — not a link, see [08]
├── sections/
│   ├── ArtistsGrid/                the responsive grid + .Loading/.Empty/.Error/.EndOfFeed
│   ├── ArtistHero/                 avatar, h1, badge, bio, stat row
│   ├── ArtistIdentityBlock/        real name / aliases / birthdate / hometown — Gap 7
│   └── ArtistCatalogSection/       preview grid + titled full list + load-more
├── navigation/
│   ├── AlphabetRail/               A–Z / # / Tous rail
│   ├── ArtistSearchField/          debounced, artist-scoped search input
│   ├── ArtistTabBar/               ARIA tablist, sticky at md+
│   └── ArtistSectionJumpBar/       <nav> of in-page anchors inside Musique — never role="tab"
├── social/
│   └── ArtistSocialLinks/          platform icon row, unknown platforms skipped — Gap 8
├── fields/
│   └── ArtistBio/                  clamped bio + aria-expanded toggle
└── pages/
    └── ArtistProfile/              composes hero + identity + socials + tab bar + panel
```

`social/` is a sanctioned kind bucket in `AGENTS.md`. The `lists/` bucket that an earlier version
carried held only the tour list and its row, both cut with the tour surface — so it is gone from
this tree. Whether the artist grid belongs in `lists/` or `sections/` is still the one open bucket
question, recorded in [10](10-components-and-reuse.md).

`ArtistSectionJumpBar` is deliberately in `navigation/` next to `ArtistTabBar` **and deliberately
not built on the same primitive.** [07](07-artist-detail-tabs.md) forbids `role="tab"` inside the
`Musique` panel — the jump-bar is a `<nav>` of plain anchors. Two components, two ARIA contracts,
one bucket.

`fields/` is a real bucket in this repo (`modules/settings/presentation/components/fields/`), and
`ArtistBio` is the right shape for it: a labelled, self-contained display control.

Folder rules from `AGENTS.md` apply unchanged — one component per folder, flat dotted state files
(`ArtistsGrid.Empty.tsx`), no nesting, `index.ts` barrel, `export interface XxxProps` inline until
two files in the folder need it.

## Reused, not rebuilt

| Need | Comes from |
|---|---|
| Song cards (Populaires, Récentes) | `modules/lyrics` `LyricsCard` — `showArtist={false}` ([08](08-catalog-sections.md)) |
| Video cards | `modules/videos` `VideoCard`, same suppression |
| News cards | `modules/articles` `ArticleCard` — reuse, do not rebuild |
| Avatar shell + fallback | `shared/.../ui/Avatar` (Radix root, compose `next/image` inside) |
| Tab primitive | `shared/.../ui/Tabs` (Radix, already has the sliding indicator) — **tab bar only** |
| Empty / error states | `shared/.../ui/EmptyState`, `FeedError`, `StateRenderer` |
| Load-more footer | `shared/.../ui/InfiniteScrollFooter` |
| Debounce | `shared/presentation/hooks/useDebouncedValue` (300ms, matches [05](05-alphabet-search-and-filters.md)) |

**Correction:** the earlier version closed this section with *"`ArtistCard` is new… `ReleaseCard` is
new… Nothing else is."* That held for a three-tab profile and is now wrong. The new components are:

| New component | Why nothing existing covers it |
|---|---|
| `ArtistCard` | No existing card is avatar-first with a count subtitle |
| `ReleaseCard` | Nothing renders releases today; serves albums and mixtapes alike |
| `ArtistIdentityBlock` | Label/value pairs with per-field null suppression ([06](06-artist-detail-hero.md)) |
| `ArtistSocialLinks` | Platform-keyed icon row with unknown-platform skipping (Gap 8) |
| `ArtistSectionJumpBar` | Anchor `<nav>`; no shared primitive, and the Radix `Tabs` one is forbidden here |

`ArticleCard`, `LyricsCard` and `VideoCard` are still reuse-only — News and Populaires add no new
card, only new queries and headings.

## Routes

The `app/` directory sits at the **frontend package root**, not under `src/`.

```
app/(public)/artistes/
├── page.tsx                 /artistes         index — replaces the coming-soon page
├── loading.tsx
└── [slug]/
    ├── page.tsx             /artistes/{slug}  profile
    ├── loading.tsx
    └── not-found.tsx
```

Both routes are server components: they read `searchParams`/`params`, fetch through
`createServerCradle()` memoized with React `cache` so `generateMetadata` and the render share one
call, and hand the resolved entity to a client container as `initialData` — exactly the shape of
`app/(public)/articles/[slug]/page.tsx`.

`ARTISTES_PATH` and `ARTISTE_DETAIL_PATH` already exist in
`src/shared/presentation/constants/paths.ts`. Use them. Do not add a third constant, and do not
rename the route ([01](01-overview.md), locked).

### Replacing the coming-soon page

`app/(public)/artistes/page.tsx` currently renders an `EmptyState` placeholder —
[`../lyrics-page/specs/06-artist-coming-soon-page.md`](../lyrics-page/specs/06-artist-coming-soon-page.md).
This feature **deletes that body** and its two `artistes.comingSoon.*` i18n keys.

Because the index page is blocked on backend Gap 1 ([16](16-backend-gaps-and-contracts.md)) and
the profile page is not, the coming-soon placeholder **stays live through Phase 1** and is removed
only in Phase 3 ([24](24-implementation-plan.md)). During Phase 1 the profile is reachable by
direct link and from lyrics pages; the index still says "coming soon". That is intentional and is
better than shipping a directory with no endpoint behind it.

## Registration points

Three files outside the module change, once each:

| File | Change |
|---|---|
| `src/shared/infrastructure/service.locator.ts` | call `registerArtistsDependencies(container)`, add the use-case/repository types to `Cradle` |
| `src/shared/presentation/i18n/resources.ts` | nest `artistsMessages.en` / `.fr` under the `artists` namespace |
| `app/sitemap.ts` | artist profile entries — see [13](13-seo-and-metadata.md) |

`app/sitemap.ts` does not exist yet. It is created by whichever feature needs it first.

## Naming

Module-derived, matching the repo (`articles` → `ArticlesMapper`, `IArticlesRepositoryPort`,
`articleKeys`):

- `ArtistsMapper`, `IArtistsRepositoryPort`, `ArtistsRepositoryImpl`,
  `registerArtistsDependencies`, `artistKeys`.
- Entities stay singular: `IArtistSummaryEntity`, `IArtistDetailEntity`, `IArtistIdentityEntity`,
  `IArtistSocialLinkEntity`, `IArtistAlbumEntity`, `IArtistPage` — one file per entity,
  `I`-prefixed, never pluralised even when the repository returns a list of them.

The README calls the mapper `ArtistMapper`. The repo convention is the plural module name, so the
symbol is `ArtistsMapper`; treat the README entry as shorthand.

### Reconciliation with [10](10-components-and-reuse.md)

[10](10-components-and-reuse.md) owns the component layer and names some of the same pieces
slightly differently (`ArtistsIndexContainer`, `ArtistTabs`, `ArtistSearchInput`, `ArtistGrid`,
plus an `ArtistAvatar` in `media/` that this document folds into the cards and hero).

**Where the two differ on a component's name or bucket, [10](10-components-and-reuse.md) wins** —
it is the component doc and it reasons about each folder individually. The tree above is the module
skeleton; treat its component leaves as indicative.

Two of its calls are worth adopting here explicitly:

- **`ArtistAvatar` is a real shared component**, not an inline fragment. [06](06-artist-detail-hero.md)
  requires the card and the hero to use the *identical* initials fallback, which only holds if
  there is one component.
- **`InfiniteScrollFooter` is not reusable** for this feature — it is sentinel-driven, and
  [04](04-artists-index-page.md) rejects auto-loading. A `LoadMoreFooter` sibling is required
  ([21](21-performance-and-pagination.md) assumes an explicit control).

Domain and application naming — `IArtistDetailEntity`, `ArtistTabKey`, `IArtistsRepositoryPort`,
`ArtistsMapper` — stays owned by [18](18-domain-entities-and-mappers.md) and
[19](19-repository-usecases-and-di.md).
