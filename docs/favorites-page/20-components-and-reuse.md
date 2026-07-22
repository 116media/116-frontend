# 20 — Components & Reuse

## New Favorites presentation components

| Component | Responsibility |
|---|---|
| `FavoritesSidebar` | three pathname-backed content destinations |
| `FavoriteCollectionTabs` | route-scoped inner collections, maximum four |
| `FavoriteArticlesContainer` | article collection orchestration |
| `FavoriteVideosContainer` | video/playlist collection orchestration |
| `FavoriteShortVideosContainer` | short collection orchestration |
| `CommentedArticleCard` | base article card + latest-own-comment context/actions |
| `MyArticleCommentsDrawer` | lazy own-comment list, edit/delete, view article |
| `PlaylistCard` | fixed 2×2 collage, count, open/rename/delete |
| `PlaylistDetail` | ordered video list and management |
| `FavoriteActivityMeta` | timestamp/count/channel/own-rating context |

## Reuse principles

- Follow `SettingsSidebar` layout/behavior but keep Favorites navigation independently owned.
- Compose existing article/video/short cards; do not fork their content mapping.
- A specialized wrapper/card is justified where collection controls and comment/collage structure
  materially change anatomy.
- Reuse existing edit/delete comment hooks and UI pieces inside the drawer.
- Reuse `VideoRatingModal` for re-rating.
- Reuse `ConfirmDialog` and form/dialog primitives for delete/rename actions.
- Cards remain presentational; route/section containers own collection queries.

