# 14 — Short-Video Data & Collections

## Backend — complete

```text
GetLikedShortVideosAsync(userId, pageIndex, pageSize, ct)
GetBookmarkedShortVideosAsync(userId, pageIndex, pageSize, ct)
GetSharedShortVideosAsync(userId, pageIndex, pageSize, ct)
```

Expose `/public/shorts/liked`, `/public/shorts/bookmarked`, and `/public/shorts/shared`. Like/save
return current active rows and required interaction time. Shares group authenticated current-user
events with own count/latest time. Filter `IsActive`; add only the filtered user-first share index.

## Frontend

Add activity/page mappings, repository/use-case/DI paths, and:

```text
useMyLikedShorts
useMySavedShorts
useMySharedShorts
```

At `/favorites/shorts`, validate `collection=liked|saved|shared`. Reuse `ShortCard` and the existing
detail/player. Saved cards show actual bookmark `CreatedAt` and Remove; shared cards show own count
and date without a channel. Never use dummy feed fallback.

## Tasks

- [x] Add three backend projections/endpoints/metadata/tests.
- [ ] Regenerate the frontend API client for the three operations.
- [ ] Add shorts domain/mapping/repository/use-case/DI/query paths.
- [ ] Build liked/saved/shared panels and responsive portrait grid.
- [ ] Add saved-date Remove with optimistic rollback/cache synchronization.
- [x] Backend-test inactive shorts, anonymous shares, grouping, pagination, auth, and empty results.
- [ ] Frontend-test URLs, rendering, optimistic mutations, and empty/error states.
