# 04 — Architecture

Favorites is a cross-content presentation shell. Article, video, and short data remain owned by
their existing clean-architecture modules.

## Frontend ownership

```text
articles module
  bookmark activity, liked/commented/shared lists, my-comments detail, existing edit/delete

videos module
  rated/shared lists, rating mutation, playlist summaries/detail/management

shorts module
  liked/saved/shared lists and existing like/save/share mutations

favorites module
  layout, three-route side menu, inner collection controls, page composition, i18n

app/(public)/favorites/*
  metadata, redirects, route containers
```

Do not create a Favorites repository or copy article/video/short entities into the presentation
module. The module consumes public hooks and mapped domain entities from each owner.

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

## Proposed presentation tree

```text
modules/favorites/presentation/
  components/navigation/FavoritesSidebar/
  components/navigation/FavoriteCollectionTabs/
  components/sections/FavoritesHeader/
  components/sections/FavoriteArticleCollection/
  components/sections/FavoriteVideoCollection/
  components/sections/FavoriteShortCollection/
  components/sections/FavoritePlaylists/
  components/cards/CommentedArticleCard/
  components/cards/PlaylistCard/
  components/modals/MyArticleCommentsDrawer/
  containers/FavoriteArticlesContainer/
  containers/FavoriteVideosContainer/
  containers/FavoriteShortVideosContainer/
  constants/favoriteNavigation.ts
  i18n/locales/{en,fr}/
  utils/navigation/
```

Every exported component follows the repository's leaf-folder/barrel and concise JSDoc rules.
