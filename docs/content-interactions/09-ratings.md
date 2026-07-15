# 09 — Ratings

A **rating** is one 1–5 star value per user, upserted, feeding a server-computed aggregate.
**Full videos only** — articles and short videos are not rateable.

---

## Behaviour

| Aspect | Rule |
|---|---|
| Scale | 1–5 stars (`short`, validated `1..5`) |
| Cardinality | One rating per `(user, video)` — re-rating **updates** the value |
| Auth | Visitor required — logged-out tap opens the auth modal, then resumes |
| Aggregate | Backend recomputes `ratingAverage` (2 dp) + `ratingCount` after each write |
| Feedback | Success + failure toasts; detail query invalidated to pull the new aggregate |
| Readback | **None** — the API never returns the user's own star value |

---

## The hook

`useRateVideo(videoId, slug)` is an auth-gated mutation. `submit(stars)` runs behind
`useRequireAuth`; on success it toasts and invalidates the cached detail entity so the
server-recomputed `ratingAverage` / `ratingCount` come back:

```ts
const { submit, isPending } = useRateVideo(video.id, video.slug);
submit(4); // opens auth if needed, then POSTs { stars: 4 }
```

Unlike like/bookmark, rating is **not** optimistic: the average is recomputed server-side
from every rating, so the frontend can't predict the new value — it refetches instead of
guessing.

---

## The `myRating` gap

There is **no endpoint to read the caller's own star value** and **no `hasRated` / `myRating`
flag on the video DTO**. Consequences the UI must accept:

- The rating stars **always open unselected** — the modal can't pre-highlight "you rated 4".
- "Already rated" is not distinguishable from "never rated"; a returning rater just re-rates
  (the backend upserts, so no harm).
- After submit, the aggregate updates but the user's chosen star is not persisted in the UI
  beyond the current session state.

This is a **known gap** — tracked in [14](14-open-questions.md). Closing it is a backend
change (add `myRating` to the video detail DTO, or a get-own-rating endpoint), then the
modal seeds its initial selection from it.

---

## Surfaces

| Surface | Component | Shows |
|---|---|---|
| Video detail | `VideoRatingModal` | interactive stars → `submit` |
| Video detail | `VideoDetailScoreboard` | `ratingAverage` + `ratingCount` (aggregate) |
| Video feed card | `VideoCard.Rating` | compact `ratingAverage` |

The rating modal and star-input contract are in [specs/08-ratings.md](specs/08-ratings.md).
