# 08 — Page Composition

## Shared shell

```text
FavoritesLayout
├── FavoritesSidebar
│   ├── Favorite articles
│   ├── Favorite videos
│   └── Favorite short videos
└── route content
    ├── page heading + description
    ├── compact inner collection selector
    └── active collection container
        ├── count/actions
        ├── StateRenderer
        ├── grid/list
        └── pagination sentinel/end state
```

## Settings-style behavior

Reuse the settings shell pattern rather than embedding settings components directly. On desktop,
the side menu is a `md:w-60` vertical sidebar with right border. On mobile it becomes a horizontal,
scrollable row with bottom border. Route matching, focus, active colors, icons, padding, and touch
targets follow `SettingsSidebar` conventions.

## Content containers

- `FavoriteArticlesContainer` owns bookmarked/commented/liked/shared article selection.
- `FavoriteVideosContainer` owns playlists/rated/shared video selection.
- `FavoriteShortVideosContainer` owns liked/saved/shared short selection.

Each container loads only its active inner collection. Drawers/dialogs are lazy interaction
islands and do not force other collections to load.

