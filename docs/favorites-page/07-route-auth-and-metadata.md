# 07 — Routes, Auth & Metadata

## Route tree

```text
app/(public)/favorites/layout.tsx
app/(public)/favorites/page.tsx                 -> redirect /favorites/articles
app/(public)/favorites/articles/page.tsx
app/(public)/favorites/videos/page.tsx
app/(public)/favorites/shorts/page.tsx
```

The layout mirrors `app/(public)/settings/layout.tsx`: a bordered responsive shell,
`FavoritesSidebar`, and an authenticated content region. The parent public layout continues
to supply the site header and page container.

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

