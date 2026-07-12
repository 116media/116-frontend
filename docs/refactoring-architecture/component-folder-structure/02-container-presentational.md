# 02 — Container / Presentational

The model behind [R2/R3](01-rules.md). It formalizes what the codebase already does
implicitly (the `index.tsx` smart shell vs the `Foo.tsx` view) and adds the *island
container* concept so React Query's per-region loading doesn't force fragmentation.

## The two roles

| | **Container** | **Presentational** |
|---|---|---|
| Lives in | `containers/` | `components/<kind>/` |
| Owns | the surface's primary `useQuery`/`useInfiniteQuery` | nothing server-side |
| Decides | which view: loading / error / empty / data | how resolved data looks |
| Holds markup? | minimal — hooks + branch + hand off | all of it |
| Local UI state (open/hover) | avoid | allowed |
| Actions / mutations (like, rate, submit, share) | may pass handlers down | allowed (an action is not a data source) |
| Reused across surfaces | no — one per surface | yes — the reusable vocabulary |
| Name | `<Surface>Container` | `<Component>` |

### Example — a route container

```
containers/VideoDetailContainer/VideoDetailContainer.tsx
```
Owns `useVideoDetail(slug)`; renders `VideoDetail.Loading` / `VideoDetail.Error` (with
`onRetry`) / `VideoDetail.NotFound` / `VideoDetail` (the presentational assembler). Holds no
layout of its own.

### Example — a presentational assembler

```
components/pages/VideoDetail/VideoDetail.tsx
```
Receives the resolved `video`, lays out the two-column grid, owns modal open-state and the
auth gate, composes the sections. It is the only component holding the full entity; every
child gets scoped props.

## Island containers (R3)

Some regions load independently of the page. Forcing each into `containers/` would shred the
page and hide the UI far from where it's used. So an **island container** is allowed: a
component that owns its own query and lives in its presentational bucket.

Confirmed islands in this codebase:

| Island | Owns | Lives in |
|---|---|---|
| `VideoDetailSimilar` | `useSimilarVideos` (infinite) | `sections/VideoDetailSimilar/` |
| `VideoDetailLyrics` | `useVideoLyrics` (lazy) | `sections/VideoDetailLyrics/` |
| `VideosPopularSidebar` | `useVideoDetailPopular` | `sections/VideosPopularSidebar/` |
| `ArticleDetailComments` | `useArticleComments` (infinite) | `sections/ArticleDetailComments/` |
| `ArticlesPopularSidebar` | `useArticleDetailPopular` | `sections/ArticlesPopularSidebar/` |
| `SessionsList` | `useSessions` | `lists/SessionsList/` |
| `SessionCard` | `useRevokeSession` (mutation island) | `cards/SessionCard/` |

Rule of thumb: **one route/section container per surface in `containers/`; independently-
loading islands own their query in place.** Everything else is dumb.

## Naming the presentational assembler

The route container is `<Surface>Container`; the presentational assembler it renders keeps
the plain surface name (`VideoDetail`, `ArticleDetail`) and lives in `pages/`. Its state
views are dotted siblings (`VideoDetail.Loading.tsx`, `.Error.tsx`, `.NotFound.tsx`) — the
container imports them and decides which to show; the view itself never fetches.

## Why containers hold almost no markup

Keeping containers thin means the presentational tree is:
- **reusable** — the same `VideoDetail` view could be fed by a different data source (SSR,
  a preview, a test) without touching a query;
- **testable** — presentational components render from fixtures with no network;
- **honest** — where data enters the tree is exactly one file per surface (plus the marked
  islands), not scattered.
