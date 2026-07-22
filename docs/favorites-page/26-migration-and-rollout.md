# 26 — Migration & Rollout

## Compatibility migration

`/favorites/articles?collection=bookmarked` becomes canonical for article bookmarks. The current
`/bookmarks` route performs a permanent application redirect and keeps existing inbound links functional. Update the stale
`BOOKMARKS_PATH` value (`/profile/bookmarks`) and all bookmarks navigation callers in the same
release; do not leave three competing URLs.

## Rollout sequence

1. **Complete:** add indexes, backend projections, queries, endpoints, and tests.
2. Regenerate the frontend API client and commit generated changes separately from hand edits.
3. Add article/video data layers and playlist gaps behind the existing module boundaries.
4. Ship `/favorites` with only contract-backed inner collections enabled in the deployment artifact.
5. Add the Favorite account-menu group, three destinations, and `/bookmarks` redirect after all
   three routes/ten inner collections pass staging checks.
6. Monitor endpoint latency, error rate, empty-result rate, and playlist mutation failures.

A single release is preferred, but the backend can deploy before the frontend. Until generated-client
and frontend work lands, Favorites routes remain unavailable/feature-gated. Database migration
rollback removes only the added indexes; it must not delete user interaction data.
