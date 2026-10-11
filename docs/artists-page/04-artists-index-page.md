# 04 — Artists Index Page (`/artistes`)

Replaces the current "coming soon" `EmptyState`.

## Purpose

A **directory**, not a feed. The user either knows who they want (search) or is browsing (A–Z).

**Nothing on this page is ranked** — deliberately, and this is an *index-only* rule. We have no
per-artist popularity signal (locked decision 6 in [01](01-overview.md)). The **profile** does rank
its songs, because per-song `ViewCount` exists — see [08](08-catalog-sections.md). Do not
generalise the index's no-ranking rule to the profile.

## Layout

```
┌──────────────────────────────────────────────────────────┐
│  Artistes                                    128 artistes│
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🔍  Rechercher un artiste…                          │  │
│  └────────────────────────────────────────────────────┘  │
│  [Tous] [#] [A] [B] [C] [D] … [Z]                        │
├──────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ avatar │ │ avatar │ │ avatar │ │ avatar │ │ avatar │  │
│  │  Name  │ │  Name  │ │  Name  │ │  Name  │ │  Name  │  │
│  │ 12 cont│ │ 3 cont │ │ 40 cont│ │ 7 cont │ │ 1 cont │  │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │
│                        … 30 per page …                    │
│                  ┌──────────────────┐                     │
│                  │   Voir plus       │                    │
│                  └──────────────────┘                     │
└──────────────────────────────────────────────────────────┘
```

## Grid

| Breakpoint | Columns | Rationale |
|---|:---:|---|
| `< 640px` | 2 | Avatar stays legible; 1 column wastes a phone screen on a directory |
| `640–768px` | 3 | |
| `768–1024px` | 4 | |
| `1024–1280px` | 5 | |
| `≥ 1280px` | 6 | Beyond 6 the avatar is too small to identify a face |

Page size **30** — divisible by 2/3/5/6 so the last row is rarely ragged.

Implemented with CSS grid and `gap`, per `AGENTS.md`. No masonry: uniform cards, uniform height.

## Card anatomy — `ArtistCard`

```
┌──────────────────┐
│   ┌──────────┐   │   Avatar    square, rounded-full, 1:1
│   │  avatar  │   │              next/image, sizes-aware
│   └──────────┘   │              fallback: initials on a token background
│   Fally Ipupa ✓  │   Name      1 line, truncate, verified badge inline
│   12 contenus    │   Count     muted, secondary text
└──────────────────┘
```

Rules:

- **The whole card is one link.** One tab stop, one focus ring. No inner "View" button (rejected
  in [02](02-inspiration-benchmark.md)).
- **The name truncates to one line.** Two-line names make rows ragged and shift the grid.
- **The count is the primary signal.** It answers "is this profile worth opening?". Its label
  pluralises and translates — see [12](12-i18n.md).
- **The label is content-type-neutral** (`contenus` / `items`), never "chansons/songs".
  `contentCount` is `lyrics + videos` ([14](14-data-requirements.md)); labelling a mixed total as
  songs is simply wrong for an artist whose catalog is mostly video. Splitting it into
  `12 chansons · 3 vidéos` was rejected — it does not fit one truncated card line and forces two
  aggregates instead of one.
- **The verified badge is inline after the name**, not overlaid on the avatar, where it would
  collide with faces.
- **No hover-only information.** Anything hover-reveals is invisible on touch.

### Avatar fallback

`AvatarFileId` is nullable and most staff-curated artists will not have one. The fallback is
initials on a deterministic token-derived background — never a broken image, never a generic
grey silhouette repeated 30 times down the page.

## Which artists appear

Only artists with **surfaceable content** — at least one item on any of the five surfaces.
Locked in [01](01-overview.md) decision 4, defined once in
[16](16-backend-gaps-and-contracts.md) and reused by the profile's 404 rule
([09](09-loading-empty-error.md)).

Today that reduces to songs and videos, because albums, features and news are still gaps. That is
a statement about what exists, not the rule: an artist with only albums is a real destination and
must appear here the day Gap 3 lands, without this page's filter being rewritten.

Unclaimed stubs created as a side effect of tagging a song are real rows in `ArtistEntity` but are
not destinations. Listing them produces a directory padded with empty profiles and generates
crawlable dead pages.

This is a backend filter, not a frontend one — the endpoint must not return them. See
[16](16-backend-gaps-and-contracts.md).

## Ordering

Alphabetical by `Name`, ascending, always.

Not by content count (implies a ranking we can't defend), not by recency (an artist directory
isn't a feed), not by `CreatedAt` (an internal detail no user can perceive).

Sorting must be **accent- and case-insensitive** — `Élodie` sorts with `E`, not after `Z`. This is
a collation concern; see [16](16-backend-gaps-and-contracts.md).

## Paging

"Load more" button, appending to the grid. Not infinite scroll — see [02](02-inspiration-benchmark.md)
for the a11y and footer reasoning. Not numbered pagination — the user is scanning, not navigating
to "page 7 of artists".

The button is the paging control **and** the loading indicator: it shows a spinner and becomes
disabled while fetching, and is replaced by an end-of-list message when exhausted.
See [09](09-loading-empty-error.md).

> **Component decision:** the existing `shared/presentation/components/ui/InfiniteScrollFooter`
> **cannot** be reused — it auto-loads via `useIntersectionObserver` when a sentinel scrolls into
> view, which is exactly the infinite scroll rejected above. A new sibling
> `shared/presentation/components/ui/LoadMoreFooter` is required. Adding a `mode` flag to a
> component whose whole identity is "infinite scroll" was rejected: two opposite behaviours behind
> one prop is how a shared component becomes unmaintainable.

## Result count

`128 artistes` in the header, reflecting the **currently filtered** set. When a letter or query is
active it reads as a filtered count, so the user can tell the filter did something. Comes from
the paginated response's total; no extra request.

## Data this page needs

Per artist: `slug`, `name`, `avatarUrl`, `isVerified`, `contentCount`.
Plus: `total` for the header and paging.

Full derivation in [14](14-data-requirements.md). **None of this is servable today** — the
endpoint does not exist ([16](16-backend-gaps-and-contracts.md)).
