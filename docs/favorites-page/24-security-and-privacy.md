# 24 — Security & Privacy

Favorites is private account history. Every read and mutation derives the user id from the
authenticated principal; a user id supplied in a route, query string, or request body is
never trusted.

## Required controls

- All ten collection APIs return `401` for anonymous callers.
- Repository queries always include the current user predicate.
- Playlist detail and mutations verify playlist ownership before revealing or changing data.
- `comments/mine` verifies both current-user ownership and requested article visibility; edit/delete
  continue checking comment ownership server-side.
- Lists include only currently published parent content.
- Soft-deleted comments never contribute to commented-article history.
- Inactive short videos never appear in personal short-video collections.
- Anonymous share events (`UserId == null`) never appear in a signed-in user's history.
- Responses use summary DTOs and do not expose another user's identifiers or activity.
- The page is `noindex, nofollow` and must not be cached as shared/public HTML.

Removing a current-state interaction removes it from the corresponding collection. Historical
comment/share rows follow normal retention policy; this feature must not invent a separate
shadow activity log. Account deletion must cover these rows through the backend's established
privacy workflow before release.
