# 08 — Favorites Shell & Routes

Compose the private Favorites routes from the existing article, video, and shorts modules.
Favorites is a route grouping, not a business capability, so it does not get a module.

## Files

```text
app/(private)/favorites/layout.tsx
app/(private)/favorites/page.tsx
app/(private)/favorites/articles/page.tsx
app/(private)/favorites/videos/page.tsx
app/(private)/favorites/shorts/page.tsx
src/modules/articles/presentation/{components,constants,containers,hooks}/
src/modules/videos/presentation/{components,constants,containers,hooks,validation}/
src/modules/shorts/presentation/{components,constants,containers,hooks}/
src/shared/presentation/components/common/FavoriteCard/
src/shared/presentation/layouts/FavoriteLayout/
src/shared/presentation/constants/favorites.ts
src/shared/presentation/i18n/locales/{en,fr}/favorites.ts
```

## Shell contract

Mirror settings layout behavior: bordered responsive flex shell, `md:w-60` vertical sidebar,
horizontal mobile navigation, active pathname styling, and authenticated guarded content. Do not
import `SettingsSidebar` or settings constants; share primitives/tokens only.

`/favorites` redirects to `/favorites/articles`. Each page sets private robots metadata and
normalizes only its own `collection` values.

## Ownership rules

- Article favorites UI and orchestration belong to `articles`.
- Playlist, rated-video, and shared-video UI and orchestration belong to `videos`.
- Liked, saved, and shared short-video UI and orchestration belong to `shorts`.
- Only content-agnostic presentation primitives belong to `shared`.
- Domain models, use cases, repositories, adapters, and query hooks remain in their owning
  content module. Do not add forwarding facades to a Favorites module.
- Authentication is enforced once at the `(private)` route boundary; shared favorites
  components remain presentational.
