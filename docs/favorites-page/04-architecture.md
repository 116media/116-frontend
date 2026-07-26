# 04 — Architecture

Favorites is a private route composition, not a domain or feature module. Article, video, and
short behavior remains in its existing clean-architecture vertical slice.

## Frontend ownership

```text
articles module
  bookmark activity, liked/commented/shared lists, my-comments detail, existing edit/delete

videos module
  rated/shared lists, rating mutation, playlist summaries/detail/management

shorts module
  liked/saved/shared lists and existing like/save/share mutations

shared presentation
  content-agnostic card anatomy, collection tabs/shell, route layout, shared route copy

app/(private)/favorites/*
  metadata, redirects, thin composition entry points
```

Do not create a Favorites module, repository, facade, proxy use case, or duplicate model. Each
content module owns its favorites containers, components, constants, hooks, use cases, entities,
ports, and adapters end to end.

## Backend ownership

New private reads stay in the Content module's public interaction query slices. Extend
`IArticleRepository`, `IVideoRepository`, and `IShortVideoRepository`; retain playlist reads in
`IPlaylistRepository`. All ownership ids come from authenticated claims.

## Reuse map

| Existing piece | Reuse |
|---|---|
| `SettingsSidebar`/settings layout | structural pattern, not direct component coupling |
| `ArticlesGrid`, `ArticleCard.Feed` | base article presentation |
| existing comment components/hooks | edit/delete forms and comment presentation behavior |
| `VideosGrid`, `VideoCard.Vertical` | rated/shared and playlist-detail video rendering |
| `VideoRatingModal`, `useRateVideo` | re-rating interaction with Favorites invalidation |
| `ShortCard`, short detail/player | liked/saved/shared short rendering/opening |
| `Tabs`, `StateRenderer`, skeletons | inner collection and async states |
| `ConfirmDialog`, `ModalForm` | destructive/rename playlist and comment actions |
| existing `Dialog` foundation | add a reusable accessible right-side Sheet/Drawer primitive if the chosen UI requires it; none exists today |

## Presentation tree

```text
modules/articles/presentation/
  components/{cards,modals,sections}/
  containers/FavoriteArticlesContainer/
  constants/favoriteArticleCollections.ts

modules/videos/presentation/
  components/{cards,forms,lists,navigation,sections}/
  containers/FavoriteVideosContainer/
  constants/favoriteVideoCollections.ts
  validation/playlist.schema.ts

modules/shorts/presentation/
  components/{cards,sections}/
  containers/FavoriteShortVideosContainer/
  constants/favoriteShortCollections.ts

shared/presentation/
  components/common/FavoriteCard/
  layouts/FavoriteLayout/{FavoriteLayout,FavoriteLayout.Collection,FavoriteLayout.Sidebar,FavoriteLayout.Tabs}.tsx
  constants/favorites.ts
  i18n/locales/{en,fr}/favorites.ts
```

Every exported component follows the repository's leaf-folder/barrel and concise JSDoc rules.
