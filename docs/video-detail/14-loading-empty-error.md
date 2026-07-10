# 14 — Loading, Empty, Error & Not-Found

Same state-selection philosophy as the article detail: the route owns not-found and the
streaming skeleton; the container owns the transient error view; each supplementary
surface owns quiet local states. All skeletons build from the shared `Skeleton`
primitive.

## Full-page skeleton — `VideoDetail.Loading`

Rendered by `app/(public)/videos/[slug]/loading.tsx` while the RSC streams, and by the
container if the query ever holds a pending state. Mirrors the default (Studio) shell so
content drops in without shift:

- a 16:9 `rounded-lg` player block;
- category pill, two title lines, a stat-chip row (4 small chips), an action-button row;
- a tab-strip bar + six description lines;
- the sidebar: `SectionHeader`-shaped block (icon box + title + divider) above five
  horizontal-row placeholders inside the muted gossip block — identical to the articles
  loading sidebar.

## Not-found (404)

Unknown/unpublished slug → RSC `notFound()` →
`app/(public)/videos/[slug]/not-found.tsx`: shared `EmptyState`
(`context="video-detail-not-found"`, film/`PlayIcon` glyph, copy from
`videos.detail.notFound.*`) with a "back to videos" link (`VIDEOS_PATH`). Crawlers get a
real 404. Dummy-data phase: the route's dummy fallback keeps this boundary dormant,
exactly like articles.

## Client error — `VideoDetail.Error`

Transient `useVideoDetail` failure after hydration (offline, 5xx, 429): shared
`EmptyState` with `AlertCircleIcon`, `videos.detail.error.*` copy, and a retry `Button`
calling `refetch`. Never `notFound()` from the client.

## Per-surface states

| Surface | Loading | Empty | Error |
|---|---|---|---|
| YouTube stat chips | 3–4 chip skeletons | hidden (null fields) | hidden |
| Lyrics tab | stanza-line skeletons | `videos.detail.lyrics.empty` muted line | same as empty |
| Similar tab | 3 vertical-card skeletons | `videos.detail.similar.empty` muted line | as empty |
| Popular sidebar | header + 5 row skeletons in the muted block | column renders nothing | as empty |
| Playlist modal list | 3 checkbox-row skeletons | empty line + create field focus | inline retry line |
| Rating submit | button/stars pending state | — | error toast, stars revert |
| Share record | none (fire-and-forget) | — | swallowed |

Modal submit failures are **toasts**, never section swaps — typed input and selections
survive. Notification copy lives in `*.notification.ts` configs.
