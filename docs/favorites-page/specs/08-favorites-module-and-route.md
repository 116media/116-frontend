# 08 — Favorites Shell & Routes

Create a presentation-only Favorites module composing public article/video/short hooks.

## Files

```text
app/(public)/favorites/layout.tsx
app/(public)/favorites/page.tsx
app/(public)/favorites/articles/page.tsx
app/(public)/favorites/videos/page.tsx
app/(public)/favorites/shorts/page.tsx
src/modules/favorites/presentation/components/navigation/FavoritesSidebar/
src/modules/favorites/presentation/components/navigation/FavoriteCollectionTabs/
src/modules/favorites/presentation/components/sections/**
src/modules/favorites/presentation/components/cards/{CommentedArticleCard,PlaylistCard}/
src/modules/favorites/presentation/components/modals/MyArticleCommentsDrawer/
src/modules/favorites/presentation/containers/{FavoriteArticlesContainer,FavoriteVideosContainer,FavoriteShortVideosContainer}/
src/modules/favorites/presentation/{constants,i18n,utils}/
```

## Shell contract

Mirror settings layout behavior: bordered responsive flex shell, `md:w-60` vertical sidebar,
horizontal mobile navigation, active pathname styling, and authenticated guarded content. Do not
import `SettingsSidebar` or settings constants; share primitives/tokens only.

`/favorites` redirects to `/favorites/articles`. Each page sets private robots metadata and
normalizes only its own `collection` values.

## Tasks

- [ ] Add shell, guard/auth states, three route pages, redirect, and metadata.
- [ ] Build the accessible three-link sidebar matching settings behavior.
- [ ] Build route-scoped inner collection selectors (4/3/3).
- [ ] Keep all data infrastructure in owner modules.
- [ ] Verify server/client boundaries, responsive navigation, and private cache behavior.

