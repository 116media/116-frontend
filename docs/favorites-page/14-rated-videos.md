# 14 — Rated Videos

Show each published video rated by the current user, ordered by rating creation/update time.

## Card contract

Reuse the normal video card for content metadata but render a dedicated personal-rating control:

```text
Your rating: ★★★★☆ 4/5
```

This value is only `VideoRatingEntity.Stars` for the authenticated user. Community average/count
may remain in the base video card but must be labelled separately and never substituted for the
user's rating.

## Re-rate in place

The existing rate endpoint is an upsert and `VideoRatingModal` already seeds the user's prior stars.
Expose a `Rate again`/editable star action from the Favorites card using that established control.
On success:

- update or invalidate the rated collection;
- update the displayed own stars;
- refresh affected video detail/feed aggregate rating caches;
- move the item according to the server's latest-rating ordering after convergence.

The paginated rated-video read is implemented; no new rating mutation is required. Regenerate the
client and connect it to the existing rating modal/hook.
