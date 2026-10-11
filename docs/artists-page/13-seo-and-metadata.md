# 13 — SEO & Metadata

Titles, Open Graph, JSON-LD, canonicals, and the sitemap. Both routes are public, server-rendered
and indexable ([03](03-information-architecture.md)).

> **Scope history.** An expanded scope briefly added merch and tour to this page, bringing
> `Product`, `Offer` and `MusicEvent` nodes and a commercial outbound-link policy. All three were
> cut ([01](01-overview.md)). What survives from that pass and still applies: `MusicAlbum` for
> releases, and `ViewCount` making one count-derived property genuinely backed.

The artist profile is the strongest SEO asset in this feature: it is an entity page for a named
person that aggregates content we already hold, which is exactly the shape search engines reward.
The index is a hub page whose job is crawl discovery, not ranking.

## `generateMetadata`

Both routes use the existing server translation util, the same pattern the placeholder page and
the lyrics routes use ([`../lyrics-page/04-routes-and-artist-placeholder.md`](../lyrics-page/04-routes-and-artist-placeholder.md)):

```tsx
const { t } = await getServerTranslation();
```

`getServerTranslation` is memoized with React `cache`, so calling it from both `generateMetadata`
and the page component costs one resolution. The profile route pairs it with a `cache()`-memoized
`fetchArtist(slug)` — one backend call shared by metadata and render, the same shape as
`app/(public)/articles/[slug]/page.tsx`.

The root layout already sets `metadataBase` from `SITE_URL` and a `title.template` of `"116 - %s"`,
so route titles are written bare and get the prefix for free.

### `/artistes`

| Field | Value |
|---|---|
| `title` | `t("artists.index.metaTitle")` → *116 - Artistes* |
| `description` | `t("artists.index.metaDescription")` |
| `alternates.canonical` | see [Canonicals](#canonicals) |
| `openGraph` | `type: "website"`, same title/description, site default image |
| `twitter.card` | `summary_large_image` |
| `robots` | `noindex` **only** when `?q=` is present |

### `/artistes/{slug}`

| Field | Value |
|---|---|
| `title` | `` `${artist.name} — ${t("artists.profile.metaTitleSuffix")}` `` → *116 - Fally Ipupa — Chansons, vidéos, actualités et concerts* |
| `description` | `artist.bio` truncated to ~160 chars on a word boundary; fallback `t("artists.profile.metaDescriptionFallback", { name })` |
| `alternates.canonical` | `/artistes/{slug}` — always bare |
| `openGraph.type` | `"profile"` |
| `openGraph.images` | `[artist.avatarUrl]` when present, else the site default |
| `twitter.card` | `summary` when the image is the avatar, `summary_large_image` when it is the site default |

Notes on the choices:

- **The title carries a suffix, not just the name.** A bare `116 - Fally Ipupa` competes with every
  other page mentioning the artist and says nothing about what the page holds. The suffix is the
  page's actual value proposition and the keyword set it can legitimately rank for.
  The suffix names **four** content types ([12](12-i18n.md)), not every section on the page: past
  ~60 characters the title truncates in the SERP, and a longer suffix would be cut off mid-word on
  exactly the pages that matter. Four surfaces is the honest maximum that fits.
- **The description falls back, never empties.** `Bio` is nullable and most staff-curated artists
  will not have one ([06](06-artist-detail-hero.md)). An artist page with no description gets one
  generated from the name; a missing `<meta name="description">` lets the engine invent one from
  the tab labels.
- **Truncation is on a word boundary**, and the source is plain text — `Bio` is a plain string and
  must not be run through `htmlToPlainText` as if it were rich text ([06](06-artist-detail-hero.md)).
- **`twitter.card` switches on which image we got.** The avatar is 1:1
  ([04](04-artists-index-page.md)); rendering a square into a `summary_large_image` slot produces a
  centre-cropped band of somebody's forehead. `summary` shows it as the small square it is. The
  site default OG image is already 1.91:1 and keeps the large card.
- **`notFound()` is called from `generateMetadata` too**, for both 404 causes
  ([09](09-loading-empty-error.md)). A 404 that still advertises the artist's real name in `<title>`
  tells a crawler the page exists.

## Canonicals

This is the part with real consequences, because four query params touch these two routes.

| URL | Canonical | Robots |
|---|---|---|
| `/artistes` | self | index, follow |
| `/artistes?letter=F` | **self** | index, follow |
| `/artistes?page=2` | `/artistes` | index, follow |
| `/artistes?letter=F&page=2` | `/artistes?letter=F` | index, follow |
| `/artistes?q=gola` | `/artistes` | **noindex, follow** |
| `/artistes/{slug}` | self | index, follow |
| `/artistes/{slug}?tab=music` | `/artistes/{slug}` | index, follow |
| `/artistes/{slug}?tab=videos` | `/artistes/{slug}` | index, follow |
| `/artistes/{slug}?tab=news` | `/artistes/{slug}` | index, follow |
| `/artistes/{slug}?tab=videos&page=2` | `/artistes/{slug}` | index, follow |
| `/artistes/{slug}?tab=music#albums` | `/artistes/{slug}` | index, follow |
| `?tab=lyrics` · `?tab=albums` · `?tab=merch` · `?tab=tour` | `/artistes/{slug}` | index, follow — **retired keys** |

### `?letter=` self-canonicalises

27 values, fixed, stable, and each returns a genuinely distinct set of artists. That is a facet
worth indexing, not duplicate content: *"artists starting with F"* is a real, finite page and a
legitimate entry point. Collapsing all 27 into `/artistes` would waste 27 crawlable hub pages that
cost nothing to serve.

### `?page=` canonicalises away

The paging model here is an **accumulation cursor**, not discrete pages: `?page=3` means "the first
three pages, appended" ([05](05-alphabet-search-and-filters.md) — *the accumulated list is the
state, and the URL records how deep you are*). Every `?page=n` URL therefore *contains* page 1's
content, so self-canonicalising publishes a chain of nested near-duplicates each of which repeats
the head content.

This is why the usual "paginated pages should self-canonicalise" advice does not apply — that
advice assumes disjoint pages. Canonicalising to the bare route (or to the letter-filtered route)
is correct here, and crawlers still reach deeper artists through the alphabet facets, which
partition the directory into 27 small sets that need no paging at all for most letters.

### `?q=` is `noindex`

Search-result URLs are unbounded: any string is a valid `q`, so an indexable search view is an
infinite crawl space that dilutes the site's index budget with thin, duplicate pages. This is the
single most important robots rule in the feature.

`follow` is kept, not `nofollow` — if a crawler does land on a search URL, we still want the artist
links on it followed.

### `?tab=` canonicalises to the bare profile

`tab` takes **three** values — `music` | `videos` | `news` ([07](07-artist-detail-tabs.md)). Every
one of them canonicalises to the bare profile. Tabs are views of **one entity**, not separate
documents. Two further reasons:

- The **default tab varies per artist** ([07](07-artist-detail-tabs.md)) — it is the first
  non-empty one. So `/artistes/x` and `/artistes/x?tab=videos` serve identical content for a
  video-only artist, and `?tab=music` duplicates the bare URL for everyone else. Self-canonicalising
  would guarantee a duplicate pair on every profile.
- The song, video and article cards inside each panel link to their own detail pages, which are the
  documents that should rank for that content. The profile ranks for the *artist*.

Three consequences:

- **`#albums`-style fragments change nothing.** A fragment is never sent to the server and needs no
  canonical treatment; it canonicalises to the bare profile along with everything else.
- **The retired keys need no redirect** ([07](07-artist-detail-tabs.md)) — nothing shipped them, so
  nothing links to them. An unknown `tab` falls back to the default tab and the page still
  canonicalises to itself, so a stale link is a soft landing, not a 404 and not a duplicate.
- **Nothing here is `noindex`.** A `?tab=` value is a bounded set of three, unlike `?q=`, so there
  is no crawl-space explosion to defend against. Canonicalisation is sufficient and keeps the item
  links on every panel followable.

Tabs stay ordinary crawlable links so those item links are still discovered, news article links
included.

## JSON-LD

Rendered server-side in a single `<script type="application/ld+json">`, built from a typed builder
in `presentation/utils/json-ld/artist-json-ld.utils.ts` — mirroring
`videoJsonLd` ([`../video-detail/16-seo-and-metadata.md`](../video-detail/16-seo-and-metadata.md)).
Fields with no data are **omitted, never null**.

### Profile — `MusicGroup`

```json
{
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "@id": "https://116.cd/artistes/fally-ipupa",
  "name": "Fally Ipupa",
  "url": "https://116.cd/artistes/fally-ipupa",
  "image": "…avatarUrl…",
  "description": "…bio…",
  "alternateName": ["Drizzy", "Champagne Papi"],
  "foundingLocation": { "@type": "Place", "name": "Kinshasa, RDC" },
  "sameAs": ["https://instagram.com/…", "https://youtube.com/…"]
}
```

The last three properties are **new**, and all three are backed by the identity and social fields
in [16](16-backend-gaps-and-contracts.md) Gaps 7 and 8:

| Property | Source | Rule |
|---|---|---|
| `alternateName` | `Aliases` | Emitted only when the array is non-empty. Never contains the stage name itself |
| `foundingLocation` | `Hometown` | A bare `Place` with a `name`. **Not** `address` or a `PostalAddress` — the field is free text (`"Kinshasa, RDC"`), not a structured place, and inventing a country code from a string is a fabrication |
| `sameAs` | `ArtistSocialLink[]` | The canonical use of `sameAs`: third-party profiles for the same entity. Omitted entirely when there are no links |

Two things deliberately still absent from the identity set:

- **`birthDate` is not emitted.** `MusicGroup` has no `birthDate` — it is a `Person` property — and
  switching the type per artist to unlock one field would fork the vocabulary across the feature.
  The date is rendered for readers ([06](06-artist-detail-hero.md)); it is not asserted in schema.
- **`RealName` is not emitted.** There is no `MusicGroup` property that means it (`legalName` is an
  `Organization` property), and `alternateName` would invert the relationship — a legal name is not
  an alias of the stage name in the sense the property means.

> **Corrected:** this doc previously said `sameAs` was *"deliberately not emitted — we have no
> social links"*. Gap 8 adds them, so the reason expired. `sameAs` is now emitted whenever links
> exist, and omitted (not empty-arrayed) when they do not.

`MusicGroup` is the right type even for a solo artist — schema.org's `MusicGroup` covers "a musical
group, such as a band, ensemble or simply a musician", and it is what the lyrics page's own JSON-LD
already uses for `byArtist` ([`../lyrics-page/04-routes-and-artist-placeholder.md`](../lyrics-page/04-routes-and-artist-placeholder.md)).
`Person` would be wrong for groups and would fork the vocabulary across two features.

Deliberately **not** emitted:

- `track` — we hold lyrics pages, not recordings. A `MusicRecording` we cannot play is an assertion
  about audio we do not have.
- `member` / `foundingDate` — no data, and no editorial process to source them.

### `album` — now emitted, as `MusicAlbum`

> **Corrected.** This doc previously refused `album` arrays because "albums aren't even linked to
> artists in v1". That was wrong on the facts: `AlbumEntity.ArtistId` **already exists** and only
> the query path is missing ([16](16-backend-gaps-and-contracts.md) Gap 3, itself a correction of an
> earlier mis-statement). Once Gap 3 ships, the profile renders a real, artist-scoped release list,
> and structured data that omits it is under-describing a page we already publish.

```json
"album": [
  {
    "@type": "MusicAlbum",
    "name": "Control",
    "url": "https://116.cd/artistes/fally-ipupa?tab=music#albums",
    "image": "…coverUrl…",
    "datePublished": "2018",
    "albumProductionType": "https://schema.org/StudioAlbum",
    "byArtist": { "@id": "https://116.cd/artistes/fally-ipupa" }
  }
]
```

Rules:

- **Only releases actually rendered on the page are listed.** Same principle as the index's
  `ItemList`: structured data must not contradict the document.
- **`url` points at the profile's albums anchor, not at an album detail page** — there is no album
  detail page in v1 ([08](08-catalog-sections.md)). Emitting a `url` to a route that does not exist
  is a 404 we invited a crawler to.
- **`datePublished` is a bare year** (`"2018"`). `ReleaseYear` is an integer; padding it to
  `2018-01-01` invents a precision we do not hold.
- **`albumProductionType` distinguishes album from mixtape** once Gap 4 lands the release-type
  discriminator. Until then the property is **omitted**, not guessed — a mixtape declared
  `StudioAlbum` is exactly the fabrication this section exists to avoid. `EP` and `Single` are not
  rendered in v1 and so are not emitted either.
- `byArtist` references the `MusicGroup` `@id` rather than repeating it, keeping one node per entity.

### Counts — `interactionStatistic` is now legitimate

> **Corrected.** This doc previously rejected "anything derived from a count — counts are UI
> orientation, not schema properties". That was written when the only counts on the page were
> pagination totals. It is now **half wrong**.

The distinction that replaces it:

| Kind of count | Emitted? |
|---|---|
| `ViewCount` on a lyrics page | **Yes** — a real, backend-stored engagement metric ([16](16-backend-gaps-and-contracts.md)) |
| Pagination totals (`24 chansons`) | **No** — an artefact of how we paginate, not a property of the artist |
| `contentCount` on the index | **No** — same reason, and it is a mixed sum ([12](12-i18n.md)) |

`interactionStatistic` therefore belongs on the **lyrics detail page**, where the count is a
property of the thing being described:

```json
"interactionStatistic": {
  "@type": "InteractionCounter",
  "interactionType": "https://schema.org/ReadAction",
  "userInteractionCount": 12043
}
```

- **`ReadAction`, not `ListenAction`.** `ViewCount` counts page reads. This is the same honesty
  constraint that forces *"Les plus lues"* over *"Les plus écoutées"* ([12](12-i18n.md)), and it is
  the same mistake in a different syntax.
- **It goes on the item, not on the artist.** A `MusicGroup` carrying a summed view count would be
  asserting an artist-level popularity metric we never computed.
- **Like and share counts are not emitted.** They exist on the entity but are sparse
  ([08](08-catalog-sections.md)); a `LikeAction` counter reading 0 on most of the catalog is a worse
  signal than no counter.
- Implementation lands in the lyrics module's own JSON-LD builder, not here — same disposition as
  the `byArtist` `@id` note below.

**Worth doing at the same time:** the lyrics detail page already emits
`byArtist: { "@type": "MusicGroup", "name": … }`. Adding `"@id"` and `"url"` pointing at
`/artistes/{slug}` there connects the two documents into one graph and is a two-line change —
`ArtistSlug` is already on that response ([01](01-overview.md)). Track it in the lyrics module, not
here.

### How the profile's nodes fit together

Three node types can appear on one profile — `MusicGroup`, `MusicAlbum` and the existing
`BreadcrumbList`. They ship as a **single `@graph`** in one
`<script type="application/ld+json">`, not as three scripts:

- The `MusicGroup` is the only node with a stable `@id`; everything else references it via
  `byArtist` / `performer`. One entity, one node, N references.
- **A node whose surface is not rendered is not emitted.** Empty arrays are omitted, never
  `"album": []` — the same "omit, never null" rule the builder already follows.
- The builder stays one typed function in
  `presentation/utils/json-ld/artist-json-ld.utils.ts`, not inlined in the page component.

### Index — `CollectionPage` + `ItemList`

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Artistes",
  "url": "https://116.cd/artistes",
  "mainEntity": {
    "@type": "ItemList",
    "itemListOrder": "https://schema.org/ItemListOrderAscending",
    "numberOfItems": 128,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "url": "https://116.cd/artistes/awilo-longomba", "name": "Awilo Longomba" }
    ]
  }
}
```

- `itemListElement` covers the **first server-rendered page only** — the 30 artists actually in the
  HTML. Listing artists that aren't on the page is structured data that contradicts the document.
- `numberOfItems` is the filtered total, matching the header count
  ([04](04-artists-index-page.md)).
- **Emitted only on canonical views** — the bare route and `?letter=` facets. A `?q=` view is
  `noindex` and a `?page=` view canonicalises elsewhere; emitting an `ItemList` on either publishes
  structured data for a URL we've asked not to be indexed.
- `itemListOrder` is ascending because the ordering is alphabetical and defensible
  ([04](04-artists-index-page.md)) — never `ItemListOrderDescending`, which would imply ranking.

## Outbound links

The social row ([06](06-artist-detail-hero.md)) is the only thing on either route that links
off-site. Getting the `rel` wrong here is a site-wide liability rather than a per-page one — every
artist profile would carry it.

| Link | `rel` | `target` |
|---|---|---|
| Social profile links | `noopener noreferrer` | `_blank` |
| Internal cards (song, video, article) | none | same tab |

### Socials get an ordinary followed link, deliberately

A social profile link is **not** a commercial placement: it identifies the same entity elsewhere, is
already asserted as `sameAs` in the JSON-LD, and is the canonical case for an ordinary followed
link. It gets `noopener noreferrer` for security and nothing else.

Marking socials `nofollow sponsored` would contradict the `sameAs` we emit for the very same URLs —
we would be telling a crawler "this is the artist's Instagram" and "we do not vouch for this link"
about one destination.

> **Scope note.** This section previously specified `nofollow sponsored` for merch and ticket
> links, which were the commercial outbound surfaces on the profile. Both were cut
> ([01](01-overview.md)), so **no link on this page is a commercial placement** and `sponsored`
> appears nowhere. If a commercial outbound surface is ever added, it does not inherit the social
> row's `rel` — it needs `nofollow sponsored`, and that decision belongs with the feature that
> adds it.

### Rules that apply to every outbound link

- **`noopener noreferrer` is non-negotiable on every `target="_blank"`** — the destination must not
  receive `window.opener`, and our referrer stays out of third-party analytics.
- **`https://` is validated on write and re-checked on render.** A `javascript:` URL in a
  staff-entered field is an XSS vector; a non-`https` scheme is refused rather than rendered.
- **No tracking parameters are appended client-side.** Anything of the sort belongs in the stored
  URL, entered once by staff.
- **Every outbound link needs a visible ↗ affordance and an announced destination change**
  ([11](11-accessibility-and-responsive.md)). That is an accessibility requirement, but it lands on
  the same markup, so it is decided once with the `rel`.
- **Dead outbound links are invisible to us.** There is no automated check today, and link rot on a
  social icon is accepted for v1 ([06](06-artist-detail-hero.md)).

## Sitemap

> **Found while checking:** `app/sitemap.ts` and `app/robots.ts` **do not exist** in the repo.
> [01](01-overview.md) treats sitemap entries as in scope, so this feature either creates the
> sitemap or depends on someone else creating it first. The shape below follows
> [`../brainstorming/seo/04-sitemap-robots.md`](../brainstorming/seo/04-sitemap-robots.md), which
> already specifies a single dynamic `app/sitemap.ts` for all content types. Adding an
> artists-only sitemap would fork that plan — flag before implementing.

Entries this feature contributes:

| URL | `changeFrequency` | `priority` |
|---|---|---|
| `/artistes` | `daily` | `0.9` |
| `/artistes/{slug}` × n | `weekly` | `0.7` |

Rules:

- **The source is the public artist list endpoint**, paged at its maximum page size. That endpoint
  already excludes artists with no published content ([16](16-backend-gaps-and-contracts.md)), so
  the exclusion locked in [01](01-overview.md) — unlisted, zero-content artists must never appear —
  comes for free and cannot drift from the index page's own filter. Deriving the sitemap from any
  other source (an admin endpoint, a raw table read) reintroduces exactly the dead pages that
  decision exists to prevent, and each one would then 404 for a crawler we personally invited.
- **No `?letter=`, `?q=`, `?page=` or `?tab=` URLs.** The sitemap lists canonical URLs only. The
  letter facets are indexable but are discovered through the rail; putting 27 facet URLs in the
  sitemap alongside the profiles they duplicate is noise.
- **`lastModified` is omitted, not faked.** No `updatedAt` is exposed on artist DTOs and
  [14](14-data-requirements.md) explicitly says the frontend doesn't need one. Emitting
  `new Date()` per artist tells crawlers every profile changed on every build, which trains them to
  ignore the field. If we want it later, the honest value is the artist's most recently published
  item's date — a backend addition, recorded in [25](25-open-questions.md).
- Split with `generateSitemaps()` past 50,000 URLs. Not a v1 concern at this catalog size, but it
  is the reason the sitemap builder should page the endpoint rather than assume one request
  returns everything.

`robots.ts`, when it lands, must allow `/artistes` — the `?q=` exclusion is handled per-route by
`robots: { index: false }` in `generateMetadata`, not by a `Disallow` line. A `Disallow` would stop
crawlers reading the page at all, which also stops them seeing the `noindex` and following the
artist links on it.
