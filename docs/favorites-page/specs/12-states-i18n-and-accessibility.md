# 12 — States, i18n & Accessibility

## Translation surface

Add matching English/French Favorites trees for:

```text
navigation.articles, videos, shorts
collections.bookmarked, commented, liked, shared, playlists, rated, saved
activity.bookmarkedAt, savedAt, latestComment, commentCount, shareCount, sharedAt, yourRating
comments.viewComments, viewArticle, edit, delete, confirmations, drawerTitle
playlist.open, create, rename, delete, removeVideo, emptySlot, confirmations
loading, empty.*, error, retry, endOfResults, authentication
```

Add account-dropdown group/destination copy to the existing settings menu catalogs. Use complete
localized plural/date messages rather than concatenating fragments.

## Async states

Each inner collection owns initial/append/empty/error/end states. Comment drawer and playlist
detail own local skeleton/error/retry states while preserving the underlying collection.

## Accessibility/responsive checks

- [ ] Sidebar links expose current route and become an operable horizontal mobile strip.
- [ ] Inner collection Tabs/links expose selection and keyboard/focus behavior.
- [ ] Comment/playlist sheets label themselves, trap/restore focus, and close with Escape.
- [ ] Edit/delete/Remove/Rate again have content-specific accessible names and pending states.
- [ ] Rating is textual, share counts are not color-only, and targets meet 44px guidance.
- [ ] Playlist empty collage cells have meaningful or decorative semantics without repeated noise.
- [ ] English/French key shapes and long-label layouts match.

