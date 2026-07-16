# 13 — Testing, Rollout & File Manifest

## Route migration

- Add `FAVORITES_PATH`, `FAVORITE_ARTICLES_PATH`, `FAVORITE_VIDEOS_PATH`, and
  `FAVORITE_SHORTS_PATH`.
- `/favorites` redirects to `/favorites/articles`.
- `/bookmarks` redirects to `/favorites/articles?collection=bookmarked`.
- Replace stale `/profile/bookmarks` callers.

## Likely frontend files

```text
app/(public)/favorites/{layout,page}.tsx
app/(public)/favorites/{articles,videos,shorts}/page.tsx
app/(public)/bookmarks/page.tsx
src/shared/presentation/constants/{paths,userMenu}.ts
src/shared/presentation/components/common/UserAccountControl/UserAccountControl.Menu.tsx
src/modules/settings/presentation/i18n/locales/{en,fr}/nav.ts
src/modules/{articles,videos,shorts}/{domain,application,infrastructure,presentation}/...
src/modules/favorites/presentation/**
```

Generated client and locale files are expected. A Favorites application/infrastructure layer is not.

## Release gate

- [ ] Nine new reads, upgraded bookmark response, and playlist DTO additions are generated/verified.
- [ ] Backend ownership/grouping/timestamp/publication/index/query-plan tests pass.
- [ ] Three routes and all 4/3/3 inner collections work for two isolated users.
- [ ] Account dropdown shows the Favorite group with exactly three destinations.
- [ ] Comment preview/drawer/edit/delete/last-removal flows pass.
- [ ] Playlist 0/1/2/3/4+ collage and management flows pass without N+1 requests.
- [ ] Bookmark/save date/removal, re-rating, and personal share-count flows pass.
- [ ] Type check, format/lint, tests, en/fr, accessibility, responsive, and noindex checks pass.
- [ ] Backend deploys before or with its consuming frontend; unavailable collections are gated.

