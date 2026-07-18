# 07 — Routes, Auth & Metadata

## Route tree

```text
app/(private)/favorites/layout.tsx
app/(private)/favorites/page.tsx                 -> redirect /favorites/articles
app/(private)/favorites/articles/page.tsx
app/(private)/favorites/videos/page.tsx
app/(private)/favorites/shorts/page.tsx
```

The layout uses the shared `FavoriteLayout` presentation frame. The parent `(private)` layout
owns the authentication boundary, while the root layout supplies the site header and page
container.

## Auth behavior

- Resolve authentication before enabling any private query.
- Authenticated users render the selected route/collection.
- Guests see the established login-required state/auth modal.
- After login, remain on the requested Favorites URL.
- Expired sessions follow the shared session-expiry flow.

## Metadata

Every Favorites route contains private personalized data and emits:

```text
robots: { index: false, follow: false }
```

Do not emit collection Open Graph previews, JSON-LD contents, or sitemap entries.

## Account entry points

The existing account dropdown gains a `Favorite` section after `Account`, containing:

- Favorite articles → `/favorites/articles`
- Favorite videos → `/favorites/videos`
- Favorite short videos → `/favorites/shorts`

Sign out remains the final destructive row after a separator.

## Legacy bookmarks

`/bookmarks` redirects to `/favorites/articles?collection=bookmarked`. Replace the stale
`/profile/bookmarks` constant and preserve saved external links.
