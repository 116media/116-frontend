# 31 — Account Dropdown Favorite Section

The current authenticated `UserAccountControl` menu contains a centered avatar/name/email,
an `Account` label with My profile and Change password, then destructive Sign out. Preserve that
identity header and add one new grouped section—not ten individual interaction links.

## Required order

```text
[Large avatar]
Username
Email

Account
  My profile
  Change password

Favorite
  Favorite articles
  Favorite videos
  Favorite short videos

Sign out
```

## Implementation contract

- Add constants for `/favorites`, `/favorites/articles`, `/favorites/videos`, and
  `/favorites/shorts`.
- Model account and Favorite groups separately instead of flattening unrelated items into one
  `USER_MENU_ITEMS` list.
- Add `settings.menu.favoriteGroup`, `favoriteArticles`, `favoriteVideos`, and
  `favoriteShortVideos` in English and French.
- Use clear content icons from the shared icon barrel; icons remain decorative beside text.
- Keep the menu approximately its current `min-w-64`, sidebar surface, padding, separators,
  router behavior, keyboard navigation, and focus semantics.
- Do not put Bookmarked, Commented, Liked, Playlists, Rated, Shared, or Saved rows here.
- Sign out stays last and destructive.

The three destinations correspond one-to-one with the Favorites side menu. Inner collections
belong inside their respective route container.

