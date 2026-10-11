# 03 — Information Architecture

## Routes

Note `app/` sits at the **package root**, not under `src/`.

```
app/(public)/artistes/page.tsx              -> /artistes            (index — new)
app/(public)/artistes/[slug]/page.tsx       -> /artistes/{slug}     (profile — new)
app/(public)/artistes/[slug]/not-found.tsx  -> 404 boundary
```

Both are public, server-rendered, and indexable. Neither is auth-gated.

`ARTISTE_DETAIL_PATH = "/artistes/:slug"` already exists in the route constants and is currently
unrouted — this feature is what finally uses it. Do not introduce a second constant.

### Why `/artistes` and not `/artists`

The header nav already ships an "ARTISTES" link pointing at `/artistes`, and the constant already
exists. Renaming means touching nav, constants, and any external link that has leaked out, for a
cosmetic gain. Locked in [01](01-overview.md).

## Page hierarchy

```
/artistes                                   /artistes/{slug}
├── Page header                             ├── Artist hero
│   ├── Title                               │   ├── Avatar
│   └── Result count                        │   ├── Name + verified badge
├── Search input (scoped)                   │   ├── Bio (clamped, expandable)
├── Alphabet rail (A–Z, #, All)             │   └── Stat row (lyrics · videos · albums)
├── Artist grid                             ├── Tab bar (URL-addressable)
│   └── ArtistCard × n                      │   ├── Lyrics
│       ├── Avatar                          │   ├── Videos
│       ├── Name                            │   └── Albums
│       └── Content count                   └── Tab panel
└── Load-more control                           ├── Latest preview grid (optional)
                                                ├── Full paginated list
                                                └── Load-more control
```

## Entry points

How a user reaches an artist. Every one of these is a link that exists or is trivially added:

| From | Element | Status |
|---|---|---|
| Header nav | "ARTISTES" link | ✅ exists (`Header/constants.ts`) — **currently 404s** |
| Lyrics detail page | Artist name under the song title | ⬜ new — `ArtistSlug` already returned |
| Video detail page | Artist name in the meta row | ⬜ new — needs `ArtistSlug` on the video response |
| Artist index | Card | ⬜ new |
| Search results | Artist result type | ⬜ deferred, see [25](25-open-questions.md) |
| Sitemap / organic | Direct | ⬜ new, see [13](13-seo-and-metadata.md) |

The lyrics-page link is the highest-value one: it is the moment a reader is already looking at an
artist's name and wants more. It is also nearly free — `PublicGetLyricsBySlugResult.ArtistSlug`
is already populated.

## Navigation state

| State | Carrier | Example |
|---|---|---|
| Selected letter | query param | `/artistes?letter=F` |
| Search term | query param | `/artistes?q=fally` |
| Index page | query param | `/artistes?page=2` |
| Selected tab | query param | `/artistes/fally-ipupa?tab=videos` |
| Tab page | query param | `/artistes/fally-ipupa?tab=videos&page=2` |

All state is in the URL. Rationale: a directory position and a selected tab are both things users
share and bookmark, and both must survive a refresh and a back-button press. Full behaviour in
[05](05-alphabet-search-and-filters.md) and [07](07-artist-detail-tabs.md).

`letter` and `q` are **mutually exclusive** — typing a search clears the letter, picking a letter
clears the search. Combining them yields near-empty results and an incoherent UI.

## Relationship to existing surfaces

- **Lyrics module** — ⚠️ **does not exist yet.** `src/modules/` currently holds `articles`, `auth`,
  `session`, `settings`, `shorts`, `videos` only. The lyrics tab is meant to reuse `LyricsCard`, so
  either the lyrics module ships first or the artist feature builds that card. See
  [08](08-catalog-sections.md) and [24](24-implementation-plan.md).
- **Videos module** — ✅ exists; the videos tab reuses its `VideoCard`.
- **Albums** — no existing surface. The album tab renders a new, minimal `ReleaseCard`; there is no
  album detail page and album cards are **not** links in v1. See [08](08-catalog-sections.md).
- **Shorts** — deliberately excluded. Shorts have no `ArtistId`.
